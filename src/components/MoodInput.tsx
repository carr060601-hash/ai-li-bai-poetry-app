import React, { useState } from 'react';
import { Feather, Sparkles, X, Search, RotateCcw } from 'lucide-react';

interface MoodInputProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
  currentKeyword: string;
}

const INSPIRATION_KEYWORDS = [
  { label: '想念', desc: '故人長相思' },
  { label: '月亮', desc: '明月出天山' },
  { label: '孤獨', desc: '對影成三人' },
  { label: '思鄉', desc: '低頭思故鄉' },
  { label: '失意', desc: '散髮弄扁舟' },
  { label: '豁達', desc: '天生我材必有用' },
  { label: '朋友', desc: '不及汪倫送我情' },
  { label: '迷茫', desc: '長風破浪會有時' },
  { label: '自然', desc: '相看兩不厭' },
  { label: '暢飲', desc: '莫使金樽空對月' },
  { label: '熱血', desc: '事了拂衣去' },
  { label: '釋懷', desc: '輕舟已過萬重山' },
];

export const MoodInput: React.FC<MoodInputProps> = ({
  onSearch,
  isLoading,
  currentKeyword,
}) => {
  const [inputValue, setInputValue] = useState(currentKeyword || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSearch(inputValue.trim());
  };

  const handleChipClick = (word: string) => {
    setInputValue(word);
    onSearch(word);
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <section className="w-full max-w-3xl mx-auto my-6 px-4">
      {/* Container with Classical Calligraphy Banner */}
      <div className="bg-[#FAF6EE] border border-[#DDD0BE] rounded-xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle traditional corner ornaments */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#B89F82] opacity-60" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#B89F82] opacity-60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#B89F82] opacity-60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#B89F82] opacity-60" />

        {/* Section Heading */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E6D6] text-[#785E47] text-xs font-serif-tc mb-2 border border-[#E0D2BE]">
            <Feather className="w-3.5 h-3.5 text-[#A62B2B]" />
            <span>詩仙引路 · 以景繪心</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C221A] font-serif-tc tracking-wide">
            輸入此刻的心境、思緒或眼前意象
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B5D] mt-1 font-serif-tc">
            例如「想念」、「月亮」、「孤獨」、「思鄉」，李白將自千百名篇中為你應聲答和
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#8C7A6B] pointer-events-none">
              <Search className="w-5 h-5" />
            </div>

            <input
              id="mood-keyword-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="試著輸入：想念、月亮、孤獨、深夜、離別、壯志..."
              disabled={isLoading}
              maxLength={60}
              className="w-full pl-11 pr-24 py-3.5 sm:py-4 rounded-lg bg-[#FFFFFF] border-2 border-[#D4C3AE] focus:border-[#A62B2B] focus:outline-none focus:ring-2 focus:ring-[#A62B2B]/20 text-[#2B231D] text-base sm:text-lg font-serif-tc placeholder:text-[#A89989] shadow-inner transition-all"
            />

            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-28 p-1.5 text-[#9C8B7C] hover:text-[#4A3D32] transition-colors"
                title="清除文字"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Submit Button */}
            <button
              id="btn-recommend-poem"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md bg-[#A62B2B] hover:bg-[#8F2323] active:bg-[#781B1B] text-[#FFF9F2] font-medium font-serif-tc text-sm sm:text-base tracking-widest shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">太白吟詠中...</span>
                  <span className="sm:hidden">吟詠中</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FDE047]" />
                  <span>推薦詩詞</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Inspiration Mood Chips */}
        <div className="mt-5 pt-4 border-t border-[#E8DDCF]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-medium text-[#7C6C5E] font-serif-tc flex items-center gap-1.5">
              <span>經典意象速選：</span>
            </span>
            <span className="text-[11px] text-[#A69788] hidden sm:inline">
              點擊即可立即相契
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {INSPIRATION_KEYWORDS.map((item) => {
              const isActive = inputValue === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleChipClick(item.label)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-full text-xs font-serif-tc transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-[#A62B2B] text-white border-[#A62B2B] shadow-xs'
                      : 'bg-[#F2ECE0] text-[#4A3C31] border-[#DACBBA] hover:bg-[#E7DDCD] hover:border-[#BFAF9B]'
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-[10px] opacity-70 hidden md:inline">
                    · {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
