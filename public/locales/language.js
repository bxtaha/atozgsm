(() => {
  const key = "atozgsm-language";
  const toggleSelector = "[data-language-toggle]";
  const attributes = ["alt", "title", "placeholder", "aria-label", "aria-description", "aria-valuetext"];
  const excluded = 'script, style, noscript, svg, code, pre, iframe, .inline-meaning, #canvasAnswerMeaning, #sentenceFullMeaning, #answerPopupMeaning, [contenteditable], [translate="no"], [lang="zh"]:not(html), [lang="zh-CN"]:not(html)';
  // Keep source text for switching back, without replacing nodes or resetting forms.
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  let language = "en";
  let translations;
  let patterns = [];
  let switching = false;

  function translate(value) {
    const key = value.trim().replace(/\s+/g, " ");
    if (!/[a-z]/i.test(key)) return value;
    let translated = Object.hasOwn(translations, key) ? translations[key] : undefined;
    if (!translated) {
      for (const { prefix, regex, ids, target } of patterns) {
        if (!key.startsWith(prefix)) continue;
        const match = key.match(regex);
        if (!match) continue;
        translated = target.replace(/\{(\d+)\}/g, (_, id) => {
          const original = match[ids.indexOf(id) + 1];
          return Object.hasOwn(translations, original) ? translations[original] : original;
        });
        break;
      }
    }
    return translated ? value.replace(/\S[\s\S]*\S|\S/, () => translated) : value;
  }

  function updateText(node) {
    const element = node.parentElement;
    if (!element || element.tagName === "TEXTAREA" || element.closest(excluded)) return;
    if (element.tagName === "OPTION") {
      // Keep the submitted option value stable even when its text supplies it.
      updateAttribute(element, "label", element.textContent);
      return;
    }
    const record = textRecords.get(node);
    const original = record?.translated === node.data ? record.original : node.data;
    const translated = language === "zh-CN" ? translate(original) : original;
    if (node.data !== translated) node.data = translated;
    if (original !== translated) textRecords.set(node, { original, translated });
    else textRecords.delete(node);
  }

  function updateAttribute(element, name, fallback) {
    if (element.closest(excluded)) return;
    const records = attributeRecords.get(element) ?? {};
    const current = element.getAttribute(name);
    const record = records[name];
    const original = record?.translated === current ? record.original : current;
    const value = original ?? fallback;
    const translated = language === "zh-CN" && value ? translate(value) : original;
    const replacement = translated === value && original === null ? null : translated;
    if (replacement !== current) {
      if (replacement === null) element.removeAttribute(name);
      else element.setAttribute(name, replacement);
    }
    if (original !== replacement) {
      records[name] = { original, translated: replacement };
      attributeRecords.set(element, records);
    } else delete records[name];
  }

  function syncToggle(button) {
    const chinese = language === "zh-CN";
    button.setAttribute("aria-pressed", String(chinese));
    button.setAttribute("aria-label", chinese ? "切换为英文" : "Switch to Simplified Chinese");
    button.querySelector("span").textContent = chinese ? "EN" : "中文";
    button.disabled = switching;
  }

  function update(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      updateText(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches(toggleSelector)) syncToggle(root);
    root.querySelectorAll(toggleSelector).forEach(syncToggle);
    if (root.closest(excluded)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.nodeType === Node.ELEMENT_NODE && node.matches(excluded)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    });
    const updateNode = node => {
      if (node.nodeType === Node.TEXT_NODE) updateText(node);
      else {
        for (const name of attributes) {
          if (node.hasAttribute(name) || attributeRecords.get(node)?.[name]) updateAttribute(node, name);
        }
        if (node.tagName === "OPTION" && node.hasAttribute("label")) updateAttribute(node, "label", node.textContent);
      }
    };
    updateNode(root);
    while (walker.nextNode()) updateNode(walker.currentNode);
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "attributes") {
        if (language === "zh-CN") updateAttribute(record.target, record.attributeName);
      } else if (record.type === "characterData") {
        if (language === "zh-CN") updateText(record.target);
      } else {
        for (const node of record.addedNodes) {
          if (language === "zh-CN") update(node);
          else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches(toggleSelector)) syncToggle(node);
            node.querySelectorAll(toggleSelector).forEach(syncToggle);
          }
        }
      }
    }
  });
  const observe = () => observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: attributes,
  });

  async function setLanguage(next) {
    if (switching || language === next) return;
    switching = true;
    document.querySelectorAll(toggleSelector).forEach(syncToggle);
    try {
      if (next === "zh-CN" && !translations) {
        const [response, university] = await Promise.all([
          fetch("/locales/zh-CN.json"),
          fetch("/locales/university-zh-CN.json").then(r => r.ok ? r.json() : null).catch(() => null),
        ]);
        if (!response.ok) throw new Error("Unable to load the Chinese translation");
        const catalog = await response.json();
        patterns = Object.entries({ ...catalog.patterns, ...university?.patterns }).map(([source, target]) => {
          const segments = source.split(/\{(\d+)\}/);
          const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const ids = segments.filter((_, i) => i % 2);
          const regex = new RegExp("^" + segments.map((part, i) => i % 2 ? "(.+?)" : escape(part)).join("") + "$");
          return { prefix: segments[0], regex, ids, target };
        });
        translations = { ...catalog.strings, ...university?.strings };
      }
      observer.disconnect();
      language = next;
      document.documentElement.lang = next;
      update(document.body);
      const title = document.querySelector("title");
      if (title) update(title);
      try { localStorage.setItem(key, next); } catch { /* The current page still works. */ }
    } catch (error) {
      console.warn("AtoZGSM language switch:", error);
    } finally {
      switching = false;
      document.querySelectorAll(toggleSelector).forEach(syncToggle);
      observe();
    }
  }

  document.addEventListener("click", event => {
    if (event.target instanceof Element && event.target.closest(toggleSelector)) {
      void setLanguage(language === "en" ? "zh-CN" : "en");
    }
  });

  window.addEventListener("storage", event => {
    if (event.key === key) void setLanguage(event.newValue === "zh-CN" ? "zh-CN" : "en");
  });
  observe();
  try {
    if (localStorage.getItem(key) === "zh-CN") void setLanguage("zh-CN");
  } catch { /* English is the default if storage is unavailable. */ }
})();
