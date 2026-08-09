import { analyzeCode } from '@/lib/analyzer';
import { detectLanguage } from '@/lib/detectLanguage';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, language, filename } = body;

    if (!code || !code.trim()) {
      return Response.json({ error: 'No code provided' }, { status: 400 });
    }

    // Detect language if set to 'auto'
    let detectedLanguage = language;
    if (!language || language === 'auto') {
      detectedLanguage = detectLanguage(code, filename);
    }

    const results = await analyzeCode(code, detectedLanguage);
    return Response.json(results);
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: 'Analysis failed', details: error.message }, { status: 500 });
  }
}
