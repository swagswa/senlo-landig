import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Send } from 'lucide-react';
import { SenloLogo } from '@/components/ui/SenloLogo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface LinkColumn {
  titleKey: string;
  links: Array<{ labelKey: string; href: string }>;
}

const columns: LinkColumn[] = [
  {
    titleKey: 'landing.footerColProduct',
    links: [
      { labelKey: 'landing.navFeatures', href: '#features' },
      { labelKey: 'landing.navPricing', href: '#pricing' },
      { labelKey: 'landing.navDemo', href: '#demo' },
      { labelKey: 'landing.navHow', href: '#how' },
    ],
  },
  {
    titleKey: 'landing.footerColCompany',
    links: [
      { labelKey: 'landing.footerAbout', href: '#' },
      { labelKey: 'landing.footerContacts', href: '#' },
      { labelKey: 'landing.footerPrivacy', href: '#' },
      { labelKey: 'landing.footerTerms', href: '#' },
    ],
  },
];

export const Footer = memo(() => {
  const { t } = useTranslation();
  return (
    <footer className="relative px-6 pt-20 pb-14 md:pt-24 md:pb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(92%,1100px)] h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand column */}
          <div className="md:col-span-2 max-w-[360px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#0066FF] flex items-center justify-center shadow-lg shadow-[#00D4FF]/20">
                <SenloLogo size={16} className="text-white" />
              </div>
              <span className="text-base font-semibold text-white tracking-tight">Senlo</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              {t('landing.footerTagline')}
            </p>
            <LanguageSwitcher />
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.titleKey}>
              <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/35 mb-4">
                {t(col.titleKey)}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.labelKey}>
                    <a
                      href={link.href}
                      className="text-sm text-white/65 hover:text-white transition-colors duration-200"
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact block */}
        <div className="mt-14 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col items-center text-center gap-4 mb-10">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/35">
              {t('landing.footerContactTitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href="tel:+79817324230"
                className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] group-hover:bg-white/[0.12] flex items-center justify-center transition-colors duration-200">
                  <Phone size={16} className="text-[#00D4FF]" />
                </div>
                <span className="text-sm font-medium">8 981 732-42-30</span>
              </a>
              <a
                href="https://t.me/rtsmerty"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] group-hover:bg-white/[0.12] flex items-center justify-center transition-colors duration-200">
                  <Send size={16} className="text-[#00D4FF]" />
                </div>
                <span className="text-sm font-medium">@rtsmerty</span>
              </a>
            </div>
            <p className="text-sm text-white/50">{t('landing.footerContactName')}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35">{t('landing.footerCopyright')}</p>
          <p className="text-xs text-white/35">{t('landing.footerBuilt')}</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
