import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plug, Database, Wand2, Bot, type LucideIcon } from 'lucide-react';
import { SectionShell } from './SectionShell';

interface StepDef {
  number: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

const steps: StepDef[] = [
  { number: '01', icon: Plug, titleKey: 'landing.step1Title', descKey: 'landing.step1Desc' },
  { number: '02', icon: Database, titleKey: 'landing.step2Title', descKey: 'landing.step2Desc' },
  { number: '03', icon: Wand2, titleKey: 'landing.step3Title', descKey: 'landing.step3Desc' },
  { number: '04', icon: Bot, titleKey: 'landing.step4Title', descKey: 'landing.step4Desc' },
];

const stepVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const Step = memo<{ step: StepDef; index: number }>(({ step, index }) => {
  const { t } = useTranslation();
  const Icon = step.icon;
  return (
    <motion.div
      variants={stepVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="relative"
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-4 mb-5">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#00D4FF]/70">
            {step.number}
          </span>
          <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center backdrop-blur-xl">
            <Icon size={18} className="text-white/85" strokeWidth={1.75} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
          {t(step.titleKey)}
        </h3>
        <p className="text-sm text-white/55 leading-relaxed max-w-[260px]">{t(step.descKey)}</p>
      </div>
    </motion.div>
  );
});
Step.displayName = 'HowItWorksStep';

export const HowItWorks = memo(() => {
  const { t } = useTranslation();
  return (
    <SectionShell
      id="how"
      eyebrow={t('landing.howEyebrow')}
      title={t('landing.howTitle')}
      description={t('landing.howDescription')}
    >
      <div className="relative">
        {/* Animated connector line - desktop only */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden lg:block absolute top-[42px] left-[6%] right-[6%] h-px origin-left bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 relative">
          {steps.map((step, i) => (
            <Step key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
});

HowItWorks.displayName = 'HowItWorks';
