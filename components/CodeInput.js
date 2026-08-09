'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CodeInput() {
  const [mode, setMode] = useState('text');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const languages = [
    { value: 'auto', label: '✨ Auto Detect' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'shell', label: 'Shell' },
    { value: 'r', label: 'R' },
    { value: 'dart', label: 'Dart' },
    { value: 'lua', label: 'Lua' },
    { value: 'perl', label: 'Perl' },
    { value: 'yaml', label: 'YAML/JSON' },
  ];

  const handleAnalyze = async () => {
    if (!code) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      sessionStorage.setItem('codelens_results', JSON.stringify(data));
      router.push('/results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        setMode('text');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="code-input-section">
      <div className="input-tabs">
        <button 
          className={`input-tab ${mode === 'text' ? 'active' : ''}`}
          onClick={() => setMode('text')}
        >
          Paste Code
        </button>
        <button 
          className={`input-tab ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          Upload File
        </button>
      </div>

      <div className="code-input-card">
        {mode === 'text' ? (
          <>
            <div className="language-select-row">
              <span className="language-select-label">Language:</span>
              <select 
                className="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="code-textarea"
              placeholder="Paste your code here to analyze..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </>
        ) : (
          <label className="drop-zone">
            <span className="drop-zone-icon">📁</span>
            <span className="drop-zone-text">Click or drag file to upload</span>
            <span className="drop-zone-hint">Supports all major text files</span>
            <input 
              type="file" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
          </label>
        )}

        <div className="analyze-btn-row">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleAnalyze}
            disabled={!code || loading}
          >
            {loading ? <span className="loading-spinner"></span> : 'Analyze Code 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
}
