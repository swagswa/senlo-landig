import { memo } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = memo(() => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ru') ? 'ru' : 'en';

  const toggle = () => {
    const next = currentLang === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="
        flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
        text-white/40 hover:text-white/80 hover:bg-white/5
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]/40
      "
      aria-label={`Switch language to ${currentLang === 'ru' ? 'English' : 'Russian'}`}
    >
      <span className={currentLang === 'ru' ? 'text-white' : 'text-white/40'}>RU</span>
      <span className="text-white/25">/</span>
      <span className={currentLang === 'en' ? 'text-white' : 'text-white/40'}>EN</span>
    </button>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
