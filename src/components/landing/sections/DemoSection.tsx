import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import LandingChat from '../LandingChat';
import { SectionShell } from './SectionShell';

export const DemoSection = memo(() => {
  const { t } = useTranslation();

  return (
    <SectionShell
      id="demo"
      eyebrow={t('landing.demoEyebrow')}
      title={t('landing.demoTitle')}
      description={t('landing.demoDescription')}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Glow backdrop */}
        <div className="absolute -inset-10 pointer-events-none">
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-[#00D4FF]/[0.08] via-transparent to-[#0066FF]/[0.06] blur-3xl" />
        </div>

        {/* Card */}
        <div
          className="
            relative
            p-6 sm:p-8 md:p-12 lg:p-16
            rounded-3xl
            bg-white/[0.025]
            border border-white/[0.08]
            backdrop-blur-2xl
            shadow-2xl shadow-black/30
          "
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/[0.08] border border-[#00D4FF]/20 mb-5">
                <Sparkles size={12} className="text-[#00D4FF]" strokeWidth={2} />
                <span className="text-[10px] md:text-xs font-medium tracking-[0.18em] uppercase text-[#00D4FF]/90">
                  {t('landing.demoBadge')}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-[1.15] mb-4">
                {t('landing.demoHeadline')}
              </h3>
              <p className="text-base text-white/55 leading-relaxed max-w-[440px] mx-auto lg:mx-0">
                {t('landing.demoCaption')}
              </p>

              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-2.5">
                {['demoTag1', 'demoTag2', 'demoTag3'].map((key) => (
                  <span
                    key={key}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-white/65 bg-white/[0.03] border border-white/[0.08]"
                  >
                    {t(`landing.${key}`)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 order-1 lg:order-2">
              <LandingChat />
            </div>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
});

DemoSection.displayName = 'DemoSection';
