import React from 'react';

interface Stat {
  number: string;
  label: string;
}

export default function StatsSection() {
  const stats: Stat[] = [
    { number: '800+', label: 'REGISTERED' },
    { number: '1.6M+', label: 'VIEWS ON SOCIAL MEDIA' },
    { number: '500+', label: 'ATTENDEES' },
    { number: '30+', label: 'COMPANIES' },
    { number: '5', label: 'PARTNER CLUBS' },
  ];

  // W-shape offset pattern: high, low, lowest (center), low, high
  const offsetClasses = [
    'lg:mt-0',      // 800+ - top left
    'lg:mt-30',     // 1.6M+ - down
    'lg:mt-0',     // 500+ - bottom center (lowest point)
    'lg:mt-30',     // 30+ - up
    'lg:mt-0',      // 5 - top right
  ];

  return (
    <>
      <div className="w-[80%] max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center ${offsetClasses[index]}`}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base font-medium text-white/90 tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}