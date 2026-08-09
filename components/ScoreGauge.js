'use client';

import { useState, useEffect } from 'react';

export default function ScoreGauge({ score, grade }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart)
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedScore(Math.floor(ease * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedScore(score);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  let scoreClass = 'fail';
  if (score >= 90) scoreClass = 'excellent';
  else if (score >= 75) scoreClass = 'good';
  else if (score >= 60) scoreClass = 'fair';
  else if (score >= 40) scoreClass = 'poor';

  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  return (
    <div className="score-gauge">
      <svg viewBox="0 0 220 220">
        <circle 
          className="score-gauge-bg"
          cx="110" 
          cy="110" 
          r={radius} 
        />
        <circle 
          className={`score-gauge-fill gauge-${scoreClass}`}
          cx="110" 
          cy="110" 
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      
      <div className="score-gauge-center">
        <div className={`score-number score-${scoreClass}`}>
          {animatedScore}
        </div>
        <div className="score-label">Code Score</div>
        <div className={`score-grade score-${scoreClass}`}>{grade}</div>
      </div>
    </div>
  );
}
