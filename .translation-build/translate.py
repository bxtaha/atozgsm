import json, os, re
from pathlib import Path
import torch
from transformers import AutoTokenizer, MarianMTModel

torch.set_num_threads(4)
model_name = 'Helsinki-NLP/opus-mt-en-zh'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name).eval()
strings = json.loads(Path('.translation-build/strings.json').read_text())
output = {}
for i in range(0, len(strings), 12):
    batch = strings[i:i+12]
    inputs = tokenizer(batch, return_tensors='pt', padding=True, truncation=True, max_length=500)
    with torch.inference_mode():
        results = model.generate(**inputs, num_beams=2, max_new_tokens=500)
    output.update(zip(batch, tokenizer.batch_decode(results, skip_special_tokens=True)))
    if i % 120 == 0:
        print(f'{i}/{len(strings)}', flush=True)
Path('zh-CN.json').write_text(json.dumps(output, ensure_ascii=False, indent=2)+'\n')
