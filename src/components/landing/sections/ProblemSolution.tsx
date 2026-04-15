import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionShell } from './SectionShell';

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

interface ColumnProps {
  problemKey: string;
  solutionKey: string;
  delay: number;
}

const Column = memo<ColumnProps>(({ problemKey, solutionKey, delay }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      variants={cardVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="
        group relative
        p-6 md:p-8
        rounded-2xl
        bg-gradient-to-b from-white/[0.04] to-white/[0.01]
        border border-white/[0.08]
        backdrop-blur-xl
        transition-colors
        hover:border-white/[0.14]
      "
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-500/[0.08] border border-red-500/15 flex items-center justify-center">
          <AlertTriangle size={16} className="text-red-400/80" strokeWidth={1.75} />
        </div>
        <div className="pt-1.5">
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-red-400/60 mb-1.5">
            {t('landing.problemLabel')}
          </p>
          <p className="text-[15px] text-white/75 leading-relaxed">{t(problemKey)}</p>
        </div>
      </div>

      <div className="relative my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <ArrowRight size={14} className="text-[#00D4FF]/60" strokeWidth={1.75} />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#00D4FF]/[0.08] border border-[#00D4FF]/20 flex items-center justify-center">
          <CheckCircle2 size={16} className="text-[#00D4FF]" strokeWidth={1.75} />
        </div>
        <div className="pt-1.5">
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#00D4FF]/75 mb-1.5">
            {t('landing.solutionLabel')}
          </p>
          <p className="text-[15px] text-white/90 leading-relaxed">{t(solutionKey)}</p>
        </div>
      </div>
    </motion.div>
  );
});
Column.displayName = 'ProblemSolutionColumn';

export const ProblemSolution = memo(() => {
  const { t } = useTranslation();
  return (
    <SectionShell
      eyebrow={t('landing.problemEyebrow')}
      title={t('landing.problemTitle')}
      description={t('landing.problemDescription')}
      divider={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        <Column problemKey="landing.problem1" solutionKey="landing.solution1" delay={0} />
        <Column problemKey="landing.problem2" solutionKey="landing.solution2" delay={0.1} />
        <Column problemKey="landing.problem3" solutionKey="landing.solution3" delay={0.2} />
      </div>
    </SectionShell>
  );
});

ProblemSolution.displayName = 'ProblemSolution';
