import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Square, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ScrollText, 
  Columns, 
  AlignLeft,
  Sparkles,
  BookOpen,
  Info
} from 'lucide-react';
import { PoemRecommendation } from '../types';
import { recitePoem, stopRecitation, isSpeechSupported } from '../utils/audio';

interface PoemDisplayProps {
  poem: PoemRecommendation;
  isSaved: boolean;
  onToggleSave: (poem: PoemRecommendation) => void;
  isAiGenerated?: boolean;
}

export const PoemDisplay: React.FC<PoemDisplayProps> = ({
  poem,
  isSaved,
  onToggleSave,
  isAiGenerated = true,
}) => {
  const [isVertical, setIsVertical] = useState(false);
  const [isReciting, setIsReciting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Stop reciting if poem changes
  useEffect(() => {
    stopRecitation();
    setIsReciting(false);
  }, [poem.id]);

  const handleRecite = () => {
    if (isReciting) {
      stopRecitation();
      setIsReciting(false);
      return;
    }

    const started = recitePoem(
      poem.title,
      poem.author,
      poem.verses,
      () => setIsReciting(false),
      () => setIsReciting(false)
    );

    if (started) {
      setIsReciting(true);
    }
  };

  const handleCopy = async () => {
    const textToCopy = `【${poem.title}】\n朝代：${poem.dynasty} · 作者：${poem.author}（${poem.genre}）\n\n${poem.verses.join('\n')}\n\n【白話文解釋】\n${poem.vernacular}\n\n【推薦原因】\n${poem.reason}\n\n—— 來自「AI 李白詩詞小助手」`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <article className="w-full max-w-3xl mx-auto my-6 px-4">
      {/* Scroll / Rice-Paper Card */}
      <div className="bg-[#FAF6EE] border-2 border-[#D9CABE] rounded-2xl shadow-md overflow-hidden relative">
        
        {/* Classical Top Bar / Status */}
        <div className="bg-[#F2EAE0] px-5 py-3 border-b border-[#E3D5C5] flex flex-wrap items-center justify-between gap-3 text-xs font-serif-tc text-[#695A4E]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A62B2B]" />
            <span className="font-semibold text-[#3D3026]">因君所思「{poem.queryKeyword}」而薦</span>
            {isAiGenerated ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E4D7C7] text-[#5A4A3C] text-[11px]">
                <Sparkles className="w-3 h-3 text-[#9E301F]" />
                詩仙智慧共鳴
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E4D7C7] text-[#5A4A3C] text-[11px]">
                太白名篇精選
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Vertical / Horizontal Layout Toggle */}
            <button
              id="btn-toggle-layout"
              type="button"
              onClick={() => setIsVertical(!isVertical)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#E8DDD0] hover:bg-[#DDD0C0] text-[#3D3026] text-xs font-serif-tc transition-colors cursor-pointer"
              title={isVertical ? '切換為現代橫書' : '切換為古典直排'}
            >
              {isVertical ? (
                <>
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>橫書</span>
                </>
              ) : (
                <>
                  <Columns className="w-3.5 h-3.5" />
                  <span>直排</span>
                </>
              )}
            </button>

            {/* Recite Audio Button */}
            {isSpeechSupported() && (
              <button
                id="btn-recite-audio"
                type="button"
                onClick={handleRecite}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-serif-tc transition-all cursor-pointer ${
                  isReciting
                    ? 'bg-[#A62B2B] text-white animate-pulse'
                    : 'bg-[#E8DDD0] hover:bg-[#DDD0C0] text-[#3D3026]'
                }`}
                title={isReciting ? '停止朗讀' : '聆聽古典朗誦'}
              >
                {isReciting ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>停止朗讀</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#A62B2B]" />
                    <span>詩詞朗讀</span>
                  </>
                )}
              </button>
            )}

            {/* Bookmark Favorite */}
            <button
              id="btn-save-favorite"
              type="button"
              onClick={() => onToggleSave(poem)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isSaved
                  ? 'text-[#A62B2B] bg-[#EED8D8]'
                  : 'text-[#695A4E] hover:text-[#A62B2B] hover:bg-[#E8DDD0]'
              }`}
              title={isSaved ? '已在太白詩篋中（點擊移除）' : '收藏至太白詩篋'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 fill-current" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Copy Button */}
            <button
              id="btn-copy-poem"
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded text-[#695A4E] hover:text-[#3D3026] hover:bg-[#E8DDD0] transition-colors cursor-pointer"
              title="複製全文與賞析"
            >
              {hasCopied ? (
                <Check className="w-4 h-4 text-green-700" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Main Poetry Content Section */}
        <div className="p-6 sm:p-9 relative">
          
          {/* Classical Vermilion Stamp in the background corner */}
          <div className="absolute top-6 right-6 opacity-85 select-none pointer-events-none hidden sm:block">
            <div className="w-16 h-16 border-2 border-[#A62B2B] rounded-xs flex flex-col items-center justify-center text-[#A62B2B] font-calligraphy text-xs leading-tight tracking-widest rotate-6">
              <span>太白</span>
              <span>醉墨</span>
            </div>
          </div>

          {/* Header: Poem Title, Author & Genre */}
          <div className="text-center mb-8 border-b border-[#E8DCCF] pb-6">
            <div className="inline-block mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFE3D3] text-[#7A6452] font-serif-tc border border-[#DFD1BF]">
                {poem.dynasty} · {poem.author} 著
              </span>
              <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full bg-[#F3EBE0] text-[#8C7664] font-serif-tc border border-[#E2D6C6]">
                {poem.genre}
              </span>
              <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full bg-[#F5E2DE] text-[#9E3326] font-serif-tc border border-[#E9CECA]">
                意境 · {poem.moodTag}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-[#261E18] font-serif-tc tracking-widest mt-1">
              {poem.title}
            </h3>
          </div>

          {/* Verses Layout (Horizontal or Vertical) */}
          <div className="my-8 flex justify-center">
            {isVertical ? (
              /* Traditional Vertical Reading Layout (Right to Left) */
              <div className="writing-vertical text-right overflow-x-auto max-w-full py-4 px-6 bg-[#FAF4E8] rounded-xl border border-[#E5D7C7] shadow-inner flex items-center justify-center min-h-[220px]">
                <div className="inline-flex flex-row-reverse gap-6 sm:gap-8 tracking-widest text-lg sm:text-2xl font-serif-tc font-medium text-[#292019] leading-loose">
                  {poem.verses.map((line, idx) => (
                    <p key={idx} className="whitespace-pre py-1 hover:text-[#A62B2B] transition-colors">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              /* Modern Horizontal Reading Layout */
              <div className="w-full max-w-xl text-center space-y-3 sm:space-y-4 py-3">
                {poem.verses.map((line, idx) => {
                  const isFamous = poem.famousVerse && line.includes(poem.famousVerse.replace(/[，。！？]/g, ''));
                  return (
                    <p
                      key={idx}
                      className={`text-xl sm:text-2xl font-serif-tc tracking-widest transition-all ${
                        isFamous
                          ? 'text-[#A62B2B] font-bold sm:scale-105 my-1'
                          : 'text-[#2A211B] font-medium'
                      }`}
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Highlight Key Verse */}
          {poem.famousVerse && (
            <div className="my-6 p-4 rounded-xl bg-[#F4EDE2] border border-[#DFCFC0] text-center">
              <span className="text-[11px] font-semibold tracking-wider text-[#8A715D] block mb-1 uppercase font-serif-tc">
                ✦ 膾炙名句 ✦
              </span>
              <blockquote className="text-lg sm:text-xl font-bold font-serif-tc text-[#8F2323] tracking-wider">
                「{poem.famousVerse}」
              </blockquote>
            </div>
          )}

          {/* Interpretations: Vernacular & Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 pt-6 border-t border-[#E8DCCF]">
            
            {/* Vernacular Chinese Explanation (白話文解釋) */}
            <div className="bg-[#FFFFFF]/70 p-5 rounded-xl border border-[#E3D7C9] shadow-2xs">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#EFE5D9]">
                <BookOpen className="w-4 h-4 text-[#A62B2B]" />
                <h4 className="text-base font-bold text-[#30251D] font-serif-tc">
                  白話文詳細解釋
                </h4>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[#4A3E34] font-serif-tc text-justify">
                {poem.vernacular}
              </p>
            </div>

            {/* Recommendation Reason (推薦原因) */}
            <div className="bg-[#FFFFFF]/70 p-5 rounded-xl border border-[#E3D7C9] shadow-2xs">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#EFE5D9]">
                <Sparkles className="w-4 h-4 text-[#C27D29]" />
                <h4 className="text-base font-bold text-[#30251D] font-serif-tc">
                  何以推薦此詩
                </h4>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[#4A3E34] font-serif-tc text-justify">
                {poem.reason}
              </p>
            </div>
          </div>

          {/* Background Context if available */}
          {poem.background && (
            <div className="mt-5 p-4 rounded-xl bg-[#F6F0E5] border border-[#E2D5C6] text-xs sm:text-sm text-[#615246] font-serif-tc">
              <div className="flex items-center gap-1.5 font-semibold text-[#3D3025] mb-1">
                <Info className="w-3.5 h-3.5 text-[#8A715D]" />
                <span>太白心境與背景導讀</span>
              </div>
              <p className="leading-relaxed">
                {poem.background}
              </p>
            </div>
          )}

          {/* Bottom Toolbar & Copy Alert */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#ECE0D3] text-xs text-[#8A796A] font-serif-tc">
            <span>李白 · 字太白 · 號青蓮居士</span>
            <div className="flex items-center gap-2">
              {hasCopied && (
                <span className="text-green-800 font-medium">已複製詩篇至剪貼簿</span>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="hover:text-[#A62B2B] underline cursor-pointer"
              >
                複製全篇賞析
              </button>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};
