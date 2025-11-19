import torchaudio as ta
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent / "chatterbox" / "src"))

from chatterbox.mtl_tts import ChatterboxMultilingualTTS
import torch, time

device = "cuda" if torch.cuda.is_available() else "cpu"
gpu_name = torch.cuda.get_device_name(0) if device == "cuda" else "CPU"
print(f"Device: {device} ({gpu_name})")

t0 = time.perf_counter()
model = ChatterboxMultilingualTTS.from_pretrained(device=device)
print(f"Model loaded in {time.perf_counter() - t0:.2f}s")

text = (
    "Era una giornata normale… Lui era sereno. Tranquillo. In pace col mondo."
)



print("Generating audio...")
t1 = time.perf_counter()
wav = model.generate(
    text,
    language_id="it",
    audio_prompt_path="myAudio.wav",  # opzionale: 3–10s, mono, 16–48 kHz
    exaggeration=2.0,                  # più alto = voce più “spinta”
    cfg_weight=0.5                     # 0.3–0.7 di solito è ok
)

print(f"Generated in {time.perf_counter() - t1:.2f}s")

out = "test6.wav" if device == "cuda" else "test6.wav"
ta.save(out, wav, model.sr)
print(f"Saved: {out}")
