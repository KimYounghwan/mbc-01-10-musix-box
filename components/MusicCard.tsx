
import React from 'react';
import { Song } from '../types';

interface MusicCardProps {
  song: Song;
  index: number;
}

const MusicCard: React.FC<MusicCardProps> = ({ song, index }) => {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + ' ' + song.title)}`;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
            {index + 1}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
              {song.title}
            </h3>
            <p className="text-gray-500 font-medium">{song.artist}</p>
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${song.isKorean ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
          {song.isKorean ? '국내 음악' : '해외 음악'}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 italic line-clamp-2">
          "{song.reason}"
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{song.genre}</span>
        <a 
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
        >
          <span>유튜브에서 듣기</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MusicCard;
