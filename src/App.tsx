/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClassicalHeader } from './components/ClassicalHeader';
import { MoodInput } from './components/MoodInput';
import { PoemDisplay } from './components/PoemDisplay';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { PoetryCardModal } from './components/PoetryCardModal';
import { PoemRecommendation } from './types';
import { CLASSICAL_POEMS, findFallbackPoem } from './data/fallbackPoems';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';

const STORAGE_FAVORITES_KEY = 'libai_poetry_favorites_v1';

export default function App() {
  // Start with classic 《月下獨酌》
  const [currentPoem, setCurrentPoem] = useState<PoemRecommendation>(() => CLASSICAL_POEMS[1]);
  const [keyword, setKeyword] = useState('月亮');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Favorites collection state
  const [favorites, setFavorites] = useState<PoemRecommendation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const handleRecommend = async (searchWord: string) => {
    if (!searchWord.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setKeyword(searchWord.trim());

    try {
      const response = await fetch('/api/recommend-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: searchWord.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP 請求失敗: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.poem) {
        setCurrentPoem(data.poem);
        setIsAiGenerated(true);
      } else {
        // Fallback to rich authentic poetry repository
        const fallback = findFallbackPoem(searchWord.trim());
        setCurrentPoem(fallback);
        setIsAiGenerated(false);
      }
    } catch (err) {
      console.warn('AI 推薦請求異常，啟用典藏庫即時配對:', err);
      // Seamless fallback to guarantee uninterrupted user experience
      const fallback = findFallbackPoem(searchWord.trim());
      setCurrentPoem(fallback);
      setIsAiGenerated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSave = (poemToSave: PoemRecommendation) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.title === poemToSave.title);
      if (exists) {
        return prev.filter((p) => p.title !== poemToSave.title);
      } else {
        return [poemToSave, ...prev];
      }
    });
  };

  const handleRemoveFavorite = (poemId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== poemId));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  const handleRandomInspire = () => {
    const randomIndex = Math.floor(Math.random() * CLASSICAL_POEMS.length);
    const chosen = CLASSICAL_POEMS[randomIndex];
    setCurrentPoem({
      ...chosen,
      id: `${chosen.id}-${Date.now()}`,
      queryKeyword: '隨機拾珠',
      timestamp: Date.now(),
    });
    setKeyword(chosen.queryKeyword);
    setIsAiGenerated(false);
  };

  const isCurrentPoemSaved = favorites.some((p) => p.title === currentPoem.title);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2B2520] flex flex-col selection:bg-[#B33939] selection:text-white">
      {/* Classical Top Header */}
      <ClassicalHeader
        savedCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onRandomInspire={handleRandomInspire}
        isLoading={isLoading}
      />

      {/* Main Classical Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-8 flex flex-col items-center">
        
        {/* Intro Quote Banner */}
        <section className="text-center my-2 max-w-xl mx-auto select-none">
          <p className="font-calligraphy text-2xl sm:text-3xl text-[#5C4033] tracking-widest leading-loose">
            「大鵬一日同風起，扶搖直上九萬里」
          </p>
          <p className="text-xs sm:text-sm text-[#8C7B6D] font-serif-tc mt-1 tracking-wider">
            盛唐氣象 · 詩仙情懷 · 凡心共鳴
          </p>
        </section>

        {/* Search & Mood Input Component */}
        <MoodInput
          onSearch={handleRecommend}
          isLoading={isLoading}
          currentKeyword={keyword}
        />

        {/* Error notification if any */}
        {errorMessage && (
          <div className="w-full max-w-3xl px-4 my-2">
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Poetry Recommendation Display Card */}
        <PoemDisplay
          poem={currentPoem}
          isSaved={isCurrentPoemSaved}
          onToggleSave={handleToggleSave}
          isAiGenerated={isAiGenerated}
        />

        {/* Classical Bottom Inspiration Quote */}
        <section className="w-full max-w-3xl my-8 px-4 text-center border-t border-[#E8DDCF] pt-6">
          <div className="flex items-center justify-center gap-3 text-xs text-[#8A7969] font-serif-tc">
            <span>天寶風骨</span>
            <span>·</span>
            <span>長安落日</span>
            <span>·</span>
            <span>太白醉吟</span>
            <span>·</span>
            <span>萬古同愁</span>
          </div>
          <p className="text-[11px] text-[#A89888] font-serif-tc mt-2">
            AI 李白詩詞小助手 · 依據您的心境智薦李白真跡詩篇 · 領略千載太白詩意
          </p>
        </section>
      </main>

      {/* Favorites Drawer (太白詩篋) */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectPoem={(poem) => {
          setCurrentPoem(poem);
          setKeyword(poem.queryKeyword || '');
        }}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearFavorites}
      />

      {/* Poetry Share Card Modal */}
      <PoetryCardModal
        poem={currentPoem}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />
    </div>
  );
}
