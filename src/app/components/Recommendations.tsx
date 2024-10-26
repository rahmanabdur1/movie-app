import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface RecommendationProps {
  recommendations: {
    results: { id: number; title: string; poster_path: string }[];
  };
}

const Recommendations: React.FC<RecommendationProps> = ({ recommendations }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {recommendations.results.map((rec) => (
        <Link key={rec.id} href={`/movie/${rec.id}`} className="flex flex-col rounded-lg bg-slate-500 items-center text-center">
          <Image
            src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
            alt={rec.title}
            width={100}
            height={150}
            className="object-cover rounded-lg shadow-md"
          />
          <span
            className="mt-2 text-[13px] font-medium text-white text-shadow-custom"
            style={{ fontFamily: 'var(--font-geist-mono), monospace, sans-serif' }}
          >
            {rec.title}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Recommendations;
