import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Globe,
  Building,
  FolderSync,
  Mic,
  Network,
  type LucideIcon,
} from 'lucide-react';
import { SectionShell } from './SectionShell';

interface IntegrationDef {
  icon: LucideIcon;
  nameKey: string;
  descKey: string;
  badgeKey?: string;
  primary?: boolean;
  accent: string;
}

const integrations: IntegrationDef[] = [
  {
    icon: MessageCircle,
    nameKey: 'landing.intMaxName',
    descKey: 'landing.intMaxDesc',
    badgeKey: 'landing.intMaxBadge',
    primary: true,
    accent: '#00D4FF',
  },
  {
    icon: Globe,
    nameKey: 'landing.intWidgetName',
    descKey: 'landing.intWidgetDesc',
    accent: '#00D4FF',
  },
  {
    icon: Building,
    nameKey: 'landing.intAmoName',
    descKey: 'landing.intAmoDesc',
    accent: '#22C55E',
  },
  {
    icon: FolderSync,
    nameKey: 'landing.intDriveName',
    descKey: 'landing.intDriveDesc',
    accent: '#F59E0B',
  },
  {
    icon: Mic,
    nameKey: 'landing.intVoiceName',
    descKey: 'landing.intVoiceDesc',
    accent: '#A855F7',
  },
  {
    icon: Network,
    nameKey: 'landing.intNeoName',
    descKey: 'landing.intNeoDesc',
    accent: '#EC4899',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const IntegrationCard = memo<{ item: IntegrationDef; index: number }>(({ item, index }) => {
  const { t } = useTranslation();
  const Icon = item.icon;
  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`
        group relative overflow-hidden
        p-6 md:p-7
        rounded-2xl
        border backdrop-blur-xl
        transition-all duration-500
        ${
          item.primary
            ? 'md:col-span-2 bg-gradient-to-br from-[#00D4FF]/[0.08] via-[#0066FF]/[0.04] to-transparent border-[#00D4FF]/25 hover:border-[#00D4FF]/45'
            : 'bg-white/[0.025] border-white/[0.07] hover:border-white/[0.16] hover:bg-white/[0.04]'
        }
      `}
    >
      {item.primary && (
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-40 blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(0, 212, 255, 0.15)' }}
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${item.accent}14`,
                borderColor: `${item.accent}30`,
              }}
            >
              <Icon size={18} style={{ color: item.accent }} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              {t(item.nameKey)}
            </h3>
            {item.badgeKey && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/25">
                {t(item.badgeKey)}
              </span>
            )}
          </div>
          <p className="text-sm text-white/55 leading-relaxed">{t(item.descKey)}</p>
        </div>
      </div>
    </motion.div>
  );
});
IntegrationCard.displayName = 'IntegrationCard';

export const Integrations = memo(() => {
  const { t } = useTranslation();
  return (
    <SectionShell
      id="integrations"
      eyebrow={t('landing.integrationsEyebrow')}
      title={t('landing.integrationsTitle')}
      description={t('landing.integrationsDescription')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {integrations.map((item, i) => (
          <IntegrationCard key={item.nameKey} item={item} index={i} />
        ))}
      </div>
    </SectionShell>
  );
});

Integrations.displayName = 'Integrations';
