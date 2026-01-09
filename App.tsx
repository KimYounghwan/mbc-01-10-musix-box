
import React, { useState, useEffect, useCallback } from 'react';
import { getMusicRecommendations } from './services/geminiService';
import { Song, AppStatus } from './types';
import MusicCard from './components/MusicCard';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (customTheme?: string) => {
    const activeTheme = customTheme || theme;
    if (!activeTheme.trim()) {
      setError("음악 테마나 장르를 입력해주세요!");
      return;
    }

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const data = await getMusicRecommendations(activeTheme);
      setSongs(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setError("추천 목록을 가져오는 데 실패했습니다. 다시 시도해주세요.");
      setStatus(AppStatus.ERROR);
    }
  }, [theme]);

  const handleReset = () => {
    setSongs([]);
    setStatus(AppStatus.IDLE);
    setTheme('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">출퇴근 하모니</h1>
          </div>
          <div className="hidden sm:block text-sm text-gray-500 font-medium">
            당신의 여정을 위한 매일의 큐레이션
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Input Area */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            오늘 당신의 기분에 <br />
            <span className="text-indigo-600">딱 맞는 음악 추천</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            지금 어떤 기분인가요? 버스나 지하철에서 듣기 좋은 7곡의 플레이리스트를 만들어 드릴게요.
          </p>

          <div className="relative group">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="예: 신나는 인디 팝, 활기찬 아침, 비오는 날 로파이..."
              className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all text-lg"
              onKeyPress={(e) => e.key === 'Enter' && fetchRecommendations()}
            />
            <button
              onClick={() => fetchRecommendations()}
              disabled={status === AppStatus.LOADING}
              className="absolute right-2 top-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
            >
              {status === AppStatus.LOADING ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>추천 중...</span>
                </span>
              ) : (
                '내 믹스 받기'
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-red-500 text-sm font-medium">{error}</p>}
        </div>

        {/* Results Area */}
        {status === AppStatus.SUCCESS && songs.length > 0 && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">오늘의 추천 곡</h3>
                <p className="text-gray-500">테마: <span className="font-semibold text-indigo-600">"{theme}"</span> 에 맞춰 7곡을 선정했습니다.</p>
              </div>
              <button
                onClick={() => fetchRecommendations()}
                className="flex items-center space-x-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>다시 추천받기</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.map((song, idx) => (
                <MusicCard key={`${song.title}-${idx}`} song={song} index={idx} />
              ))}
            </div>

            <div className="text-center pt-8">
              <button 
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors flex items-center justify-center space-x-1 mx-auto"
              >
                <span>초기화하고 새로운 테마 입력하기</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {status === AppStatus.IDLE && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium italic">당신의 출퇴근길을 즐겁게 할 음악을 찾아보세요.</p>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="mt-auto border-t border-gray-100 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2024 Commute Harmony. AI 기반 음악 큐레이션 서비스.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
