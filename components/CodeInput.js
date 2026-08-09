'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CodeInput() {
  const [mode, setMode] = useState('paste');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
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

  const handleFileUpload = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const readPromises = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({ name: file.name, content: e.target.result, size: file.size });
        };
        reader.readAsText(file);
      });
    });
    Promise.all(readPromises).then(results => {
      setFiles(prev => [...prev, ...results]);
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      let payload;

      if (mode === 'paste') {
        if (!code.trim()) return setLoading(false);
        payload = { mode: 'single', code, language, filename: null };
      } else if (mode === 'upload') {
        if (files.length === 0) return setLoading(false);
        payload = {
          mode: 'multi',
          files: files.map(f => ({ code: f.content, filename: f.name, language: 'auto' })),
        };
      } else if (mode === 'github') {
        if (!githubUrl.trim()) return setLoading(false);
        payload = { mode: 'github', url: githubUrl.trim() };
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('codelens_results', JSON.stringify(data));
        router.push('/results');
      } else {
        alert(data.error || 'Analysis failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check your input and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="code-input-section">
      <div className="input-tabs">
        <button
          className={`input-tab ${mode === 'paste' ? 'active' : ''}`}
          onClick={() => setMode('paste')}
        >
          Paste Code
        </button>
        <button
          className={`input-tab ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          Upload Files
        </button>
        <button
          className={`input-tab ${mode === 'github' ? 'active' : ''}`}
          onClick={() => setMode('github')}
        >
          GitHub URL
        </button>
      </div>

      <div className="code-input-card">
        {/* === PASTE CODE === */}
        {mode === 'paste' && (
          <>
            <div className="language-select-row">
              <span className="language-select-label">Language:</span>
              <select
                className="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            <textarea
              className="code-textarea"
              placeholder={`Paste your code here to analyze...\n\nExample:\nfunction greet(name) {\n  eval(name); // security issue\n  var x = 1; // should use let/const\n  if (x == '1') { } // should use ===\n}`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </>
        )}

        {/* === UPLOAD FILES (MULTIPLE) === */}
        {mode === 'upload' && (
          <>
            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <span className="drop-zone-icon">📁</span>
              <span className="drop-zone-text">Click or drag files to upload</span>
              <span className="drop-zone-hint">Upload multiple files at once — supports all languages</span>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {files.length} file{files.length !== 1 ? 's' : ''} loaded:
                </div>
                {files.map((file, i) => (
                  <div key={i} className="drop-zone-file">
                    <span style={{ flex: 1 }}>{file.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {file.content.split('\n').length} lines
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        color: 'var(--error)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* === GITHUB URL === */}
        {mode === 'github' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Paste a GitHub raw file URL to analyze its code:
            </div>
            <input
              type="url"
              className="code-textarea"
              style={{ minHeight: '56px', height: '56px', fontFamily: 'var(--font-code)' }}
              placeholder="https://raw.githubusercontent.com/user/repo/main/file.js"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong>Tip:</strong> Go to any file on GitHub, click the <strong>Raw</strong> button, then copy that URL.
              <br />Example: https://raw.githubusercontent.com/user/repo/main/index.js
            </div>
          </div>
        )}

        {/* === ANALYZE BUTTON === */}
        <div className="analyze-btn-row">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAnalyze}
            disabled={
              loading ||
              (mode === 'paste' && !code.trim()) ||
              (mode === 'upload' && files.length === 0) ||
              (mode === 'github' && !githubUrl.trim())
            }
          >
            {loading ? (
              <><span className="loading-spinner" style={{ width: 20, height: 20 }}></span> Analyzing...</>
            ) : (
              'Analyze Code 🚀'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
