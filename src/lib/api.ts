export interface GenerateResponse {
  success: boolean;
  response: string;
  prompt: string;
  timestamp: string;
}

export async function generateKolam(prompt: string, signal?: AbortSignal): Promise<GenerateResponse> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Generation failed with status ${res.status}`);
  }

  return res.json();
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: string;
  filename: string;
  fileSize: number;
  timestamp: string;
}

export async function analyzeKolamImage(file: File, signal?: AbortSignal): Promise<AnalyzeResponse> {
  const form = new FormData();
  form.append('image', file);

  const res = await fetch('/api/analyze', {
    method: 'POST',
    body: form,
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Analysis failed with status ${res.status}`);
  }

  return res.json();
}
