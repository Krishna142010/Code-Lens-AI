import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata = {
  title: 'CodeLens AI — Universal Code Analyzer for 20+ Languages',
  description: 'Analyze code in 20+ programming languages instantly. Detect security vulnerabilities, bugs, performance issues, and get fix suggestions. No API key required.',
  keywords: ['code analyzer', 'code quality', 'security scanner', 'static analysis', 'linting', 'programming', 'AI'],
  openGraph: {
    title: 'CodeLens AI — Universal Code Analyzer',
    description: 'Analyze code in 20+ languages. Find bugs, security issues, and get instant fix suggestions.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <Header />
        <div className="page-wrapper">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
