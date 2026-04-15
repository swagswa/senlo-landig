import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Network,
  Users,
  LayoutTemplate,
  Wrench,
  Gauge,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react';
import { SectionShell } from './SectionShell';

interface FeatureDef {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  color: string;
}

const features: FeatureDef[] = [
  {
    icon: BookOpen,
    titleKey: 'landing.featureRagTitle',
    descKey: 'landing.featureRagDesc',
    color: 'from-[#00D4FF]/20 to-[#00D4FF]/0',
  },
  {
    icon: Brain,
    titleKey: 'landing.featureMemoryTitle',
    descKey: 'landing.featureMemoryDesc',
    color: 'from-purple-500/20 to-purple-500/0',
  },
  {
    icon: Network,
    titleKey: 'landing.featureGraphTitle',
    descKey: 'landing.featureGraphDesc',
    color: 'from-emerald-400/20 to-emerald-400/0',
  },
  {
    icon: Users,
    titleKey: 'landing.featureAgentsTitle',
    descKey: 'landing.featureAgentsDesc',
    color: 'from-[#0066FF]/25 to-[#0066FF]/0',
  },
  {
    icon: LayoutTemplate,
    titleKey: 'landing.featureTemplatesTitle',
    descKey: 'landing.featureTemplatesDesc',
    color: 'from-amber-400/20 to-amber-400/0',
  },
  {
    icon: Wrench,
    titleKey: 'landing.featureToolsTitle',
    descKey: 'landing.featureToolsDesc',
    color: 'from-pink-400/20 to-pink-400/0',
  },
  {
    icon: Gauge,
    titleKey: 'landing.featureCacheTitle',
    descKey: 'landing.featureCacheDesc',
    color: 'from-[#00D4FF]/20 to-[#00D4FF]/0',
  },
  {
    icon: FlaskConical,
    titleKey: 'landing.featureAbTitle',
    descKey: 'landing.featureAbDesc',
    color: 'from-violet-400/20 to-violet-400/0',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const FeatureCard = memo<{ feature: FeatureDef; index: number }>(({ feature, index }) => {
  const { t } = useTranslation();
  const Icon = feature.icon;
  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="
        group relative overflow-hidden
        p-6 md:p-7
        rounded-2xl
        bg-white/[0.025]
        border border-white/[0.07]
        backdrop-blur-xl
        transition-all duration-500
        hover:border-white/[0.16]
        hover:bg-white/[0.04]
      "
    >
      {/* Radial glow on hover */}
      <div
        className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-radial ${feature.color} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none`}
      />

      <div className="relative">
        <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:border-[#00D4FF]/30 transition-colors duration-500">
          <Icon size={18} className="text-white/85" strokeWidth={1.75} />
        </div>
        <h3 className="text-[17px] font-semibold text-white tracking-tight mb-2">
          {t(feature.titleKey)}
        </h3>
        <p className="text-sm text-white/55 leading-relaxed">{t(feature.descKey)}</p>
      </div>
    </motion.div>
  );
});
FeatureCard.displayName = 'FeatureCard';

export const FeaturesGrid = memo(() => {
  const { t } = useTranslation();
  return (
    <SectionShell
      id="features"
      eyebrow={t('landing.featuresEyebrow')}
      title={t('landing.featuresTitle')}
      description={t('landing.featuresDescription')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {features.map((feature, i) => (
          <FeatureCard key={feature.titleKey} feature={feature} index={i} />
        ))}
      </div>
    </SectionShell>
  );
});

FeaturesGrid.displayName = 'FeaturesGrid';
