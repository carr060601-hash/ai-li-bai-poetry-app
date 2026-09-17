/**
 * Web Speech API synthesis utility customized for Classical Chinese poetry recitation.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopRecitation(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function recitePoem(
  title: string,
  author: string,
  verses: string[],
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (!isSpeechSupported()) {
    return false;
  }

  stopRecitation();

  // Format with natural classical pauses
  const fullText = `${title}。作者：${author}。\n\n${verses.join('。\n')}`;

  const utterance = new SpeechSynthesisUtterance(fullText);
  
  // Choose Chinese voice if available
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(v => v.lang === 'zh-TW') ||
                       voices.find(v => v.lang === 'zh-HK') ||
                       voices.find(v => v.lang.startsWith('zh'));

  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  utterance.lang = 'zh-TW';
  utterance.rate = 0.85; // Slightly leisurely tempo for poetry
  utterance.pitch = 0.95;

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    onError?.(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}
