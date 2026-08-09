import { analyzeCode } from '@/lib/analyzer';
import { detectLanguage } from '@/lib/detectLanguage';

async function analyzeOneFile(code, language, filename) {
  let detectedLanguage = language;
  if (!language || language === 'auto') {
    detectedLanguage = detectLanguage(code, filename || '');
  }
  return await analyzeCode(code, detectedLanguage);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mode } = body;

    // === SINGLE FILE (paste code) ===
    if (mode === 'single' || !mode) {
      const { code, language, filename } = body;
      if (!code || !code.trim()) {
        return Response.json({ error: 'No code provided' }, { status: 400 });
      }
      const results = await analyzeOneFile(code, language, filename);
      return Response.json(results);
    }

    // === MULTIPLE FILES (upload) ===
    if (mode === 'multi') {
      const { files } = body;
      if (!files || !Array.isArray(files) || files.length === 0) {
        return Response.json({ error: 'No files provided' }, { status: 400 });
      }

      const allResults = [];
      let totalIssues = [];
      let totalLinesAnalyzed = 0;

      for (const file of files) {
        const result = await analyzeOneFile(file.code, file.language, file.filename);
        allResults.push({
          filename: file.filename,
          ...result,
        });
        totalIssues = totalIssues.concat(
          result.issues.map(issue => ({ ...issue, filename: file.filename }))
        );
        totalLinesAnalyzed += result.linesAnalyzed || 0;
      }

      // Combine scores — average across files weighted by lines
      const combinedCategories = {};
      const categoryNames = ['security', 'bugs', 'performance', 'best-practices', 'style'];
      for (const cat of categoryNames) {
        const scores = allResults
          .filter(r => r.scores?.categories?.[cat])
          .map(r => r.scores.categories[cat]);
        const avgScore = scores.length > 0
          ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
          : 100;
        const allCatIssues = scores.flatMap(s => s.issues || []);
        combinedCategories[cat] = { score: avgScore, issues: allCatIssues };
      }

      const overallScores = allResults.map(r => r.scores?.overall || 100);
      const overall = Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length);

      let grade = 'F';
      if (overall >= 95) grade = 'A+';
      else if (overall >= 90) grade = 'A';
      else if (overall >= 85) grade = 'B+';
      else if (overall >= 75) grade = 'B';
      else if (overall >= 70) grade = 'C+';
      else if (overall >= 60) grade = 'C';
      else if (overall >= 40) grade = 'D';

      return Response.json({
        language: 'multi',
        scores: {
          overall,
          grade,
          categories: combinedCategories,
          totalIssues: totalIssues.length,
          passRate: overall,
        },
        issues: totalIssues,
        linesAnalyzed: totalLinesAnalyzed,
        summary: `Analyzed ${files.length} files (${totalLinesAnalyzed} lines). Found ${totalIssues.length} issues.`,
        fileResults: allResults,
      });
    }

    // === GITHUB URL ===
    if (mode === 'github') {
      const { url } = body;
      if (!url || !url.trim()) {
        return Response.json({ error: 'No URL provided' }, { status: 400 });
      }

      // Convert GitHub URLs to raw URLs
      let rawUrl = url.trim();
      if (rawUrl.includes('github.com') && !rawUrl.includes('raw.githubusercontent.com')) {
        rawUrl = rawUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      try {
        const response = await fetch(rawUrl, {
          headers: { 'Accept': 'text/plain' },
        });
        if (!response.ok) {
          return Response.json(
            { error: `Failed to fetch from GitHub (${response.status}). Make sure the URL points to a valid file and the repository is public.` },
            { status: 400 }
          );
        }
        const code = await response.text();
        if (!code.trim()) {
          return Response.json({ error: 'The fetched file is empty.' }, { status: 400 });
        }

        // Extract filename from URL
        const filename = rawUrl.split('/').pop() || 'unknown';
        const result = await analyzeOneFile(code, 'auto', filename);
        return Response.json(result);
      } catch (fetchError) {
        return Response.json(
          { error: 'Could not fetch from GitHub. Check the URL and make sure the repo is public.' },
          { status: 400 }
        );
      }
    }

    return Response.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: 'Analysis failed', details: error.message }, { status: 500 });
  }
}
