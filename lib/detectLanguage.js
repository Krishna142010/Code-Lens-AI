import { LANGUAGES } from './languages.js';

const KEYWORD_MAPS = {
  python: ['def ', 'import ', 'from ', 'class ', 'self', 'elif', 'print(', '__init__'],
  javascript: ['function', 'const ', 'let ', 'var ', '=>', 'require(', 'module.exports', 'document.'],
  typescript: ['interface ', 'type ', 'implements ', 'namespace ', 'declare ', 'enum '],
  java: ['public class ', 'private ', 'protected ', 'void ', 'System.out', 'import java'],
  go: ['func ', 'package ', 'import ', 'fmt.', 'goroutine', 'chan ', 'defer '],
  rust: ['fn ', 'let mut ', 'impl ', 'pub fn ', 'use std', 'match ', 'enum ', 'struct '],
  c: ['#include', 'int main', 'printf', 'malloc', 'free', 'void ', 'sizeof'],
  cpp: ['#include', 'using namespace std', 'std::', 'cout', 'cin', 'class ', 'virtual'],
  csharp: ['using System', 'namespace ', 'public class ', 'Console.WriteLine', 'string[] args'],
  ruby: ['def ', 'end', 'require ', 'class ', 'attr_accessor', 'puts'],
  php: ['<?php', 'echo', '$', 'public function ', 'require_once'],
  swift: ['import Foundation', 'func ', 'let ', 'var ', 'guard ', 'print('],
  kotlin: ['fun main', 'val ', 'var ', 'println(', 'data class '],
  html: ['<html>', '<body>', '</div>', '</a>', '<span>'],
  css: ['margin:', 'padding:', 'color:', 'background-color:', 'display:', 'flex'],
  sql: ['SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'UPDATE', 'DELETE'],
  shell: ['echo ', 'export ', 'if [', 'fi', 'done'],
  r: ['<-', 'c(', 'data.frame', 'library('],
  dart: ['import \'package:', 'void main', 'Widget build', 'class '],
  lua: ['local ', 'function ', 'end', 'print(', 'require '],
  perl: ['use strict', 'my $', 'print', 'sub '],
};

const SHEBANG_MAP = {
  'python': 'python',
  'python3': 'python',
  'node': 'javascript',
  'bash': 'shell',
  'sh': 'shell',
  'zsh': 'shell',
  'ruby': 'ruby',
  'perl': 'perl',
  'php': 'php',
};

export function detectLanguage(code, filename = '') {
  // 1. Match by extension
  if (filename) {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    if (ext && ext !== filename.toLowerCase()) {
      for (const [id, lang] of Object.entries(LANGUAGES)) {
        if (lang.extensions.includes(ext)) {
          return id;
        }
      }
    }
  }

  // 2. Check shebang
  const lines = code.split('\n');
  if (lines.length > 0 && lines[0].startsWith('#!')) {
    const shebang = lines[0].toLowerCase();
    for (const [key, langId] of Object.entries(SHEBANG_MAP)) {
      if (shebang.includes(key)) {
        return langId;
      }
    }
  }

  // 3. Keyword frequency analysis
  const scores = {};
  for (const [lang, keywords] of Object.entries(KEYWORD_MAPS)) {
    scores[lang] = 0;
    for (const keyword of keywords) {
      // simple count of keyword occurrences
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = code.match(regex);
      if (matches) {
        scores[lang] += matches.length;
      }
    }
  }

  let bestMatch = 'unknown';
  let maxScore = 0;

  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestMatch = lang;
    }
  }

  // Fallback to TypeScript if JavaScript is detected but TypeScript keywords exist
  if (bestMatch === 'javascript' && scores['typescript'] > 0) {
      bestMatch = 'typescript';
  }

  return bestMatch;
}
