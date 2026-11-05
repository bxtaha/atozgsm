import json, os, re
from pathlib import Path
import torch
from transformers import AutoTokenizer, MarianMTModel

torch.set_num_threads(4)
model_name = 'Helsinki-NLP/opus-mt-en-zh'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name).eval()
strings = json.loads(Path('.translation-build/strings.json').read_text())
part = int(os.environ['COPY_PART'])
strings = strings[part::4]
output = {}
for i in range(0, len(strings), 12):
    batch = strings[i:i+12]
    inputs = tokenizer(batch, return_tensors='pt', padding=True, truncation=True, max_length=500)
    with torch.inference_mode():
        results = model.generate(**inputs, num_beams=2, max_new_tokens=min(240, inputs.input_ids.shape[1] * 2 + 20))
    output.update(zip(batch, tokenizer.batch_decode(results, skip_special_tokens=True)))
    if i % 120 == 0:
        print(f'{i}/{len(strings)}', flush=True)
Path(f'zh-CN-{part}.json').write_text(json.dumps(output, ensure_ascii=False, indent=2)+'\n')
