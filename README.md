# CodeLens AI

> **Universal Code Analyzer for 20+ Programming Languages** — Built for [Iris Hacks IV](https://iris-hacks-iv.devpost.com/)

## 🚀 What It Does

CodeLens AI is an intelligent, AI-powered code quality, security, and best-practices analyzer that works across **22 programming languages**. Paste any code, upload a file, or provide a GitHub URL — get instant analysis with severity scores, detailed explanations, and actionable fix suggestions.

### Key Features
- 🔍 **22 Languages Supported**: JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, HTML, CSS, SQL, Shell/Bash, R, Dart, Lua, Perl, YAML/JSON
- 📊 **5 Analysis Categories**: Security, Bugs, Performance, Best Practices, Code Style
- 🎯 **200+ Detection Rules**: Pattern-matching rules that catch real, common issues
- 🔧 **Code Fix Suggestions**: Every issue comes with a suggested fix and explanation
- 🌐 **Auto Language Detection**: Automatically detects the programming language from code patterns
- 🚫 **Zero API Keys Required**: Everything runs server-side — no external AI APIs needed
- ⚡ **Instant Results**: Analysis completes in milliseconds

## 🛠️ Technologies Used

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router) + React 18
- **Styling**: Vanilla CSS with modern features (glassmorphism, CSS animations, custom properties)
- **Analysis Engine**: Custom regex-based rule engine (no external dependencies)
- **Deployment**: [Vercel](https://vercel.com/) (zero-config)
- **Language Detection**: Keyword frequency analysis + file extension matching

## 💡 The Problem It Solves

**96.3% of websites have accessibility issues.** Code quality affects every developer, and security vulnerabilities cost an average of $4.45M per breach. Yet professional code analysis tools are:
- Expensive (enterprise pricing)
- Complex to set up (CI/CD integration required)
- Limited to one or two languages

**CodeLens AI democratizes code review** by providing instant, comprehensive analysis across 22 languages — completely free and accessible to everyone, especially students and beginners.

## 🏗️ How We Built It

1. **Research Phase**: Studied WCAG guidelines, OWASP security patterns, and language-specific best practices
2. **Rule Engine**: Built a modular, regex-based pattern matching engine with 200+ rules across 16 rule modules
3. **Scoring Algorithm**: Developed a weighted scoring system that prioritizes security (3x weight) over style (1x weight)
4. **UI/UX**: Designed a premium dark-mode interface with glassmorphism, animated score gauges, and micro-interactions
5. **Integration**: Connected everything through Next.js API routes for seamless server-side analysis

## 🎯 Challenges We Faced

- **False Positive Reduction**: Regex-based analysis can produce false positives. We added context-aware patterns (e.g., ignoring matches inside comments or strings) to improve accuracy
- **Language Detection**: Distinguishing between similar languages (C vs C++, JavaScript vs TypeScript) required sophisticated keyword frequency analysis
- **Performance**: Analyzing large code files with 200+ rules needed careful optimization to keep response times under 500ms
- **Scoring Balance**: Designing a fair scoring algorithm that weighs security concerns appropriately while not overly penalizing style preferences

## 🚀 Getting Started

```bash
# Clone the repository
git clone <your-repo-url>
cd codelens-ai

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📦 Deploy to Vercel

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Click "Deploy" — that's it! Zero configuration needed.

## 📸 Screenshots

*[Add screenshots of the landing page, analysis results, and score dashboard]*

## 🏆 Built For

**Iris Hacks IV** — A 2-day virtual hackathon introducing students to the world of AI and coding.

## 📄 License

MIT License — Free to use, modify, and distribute.

---

*Made with ❤️ for Iris Hacks IV*
