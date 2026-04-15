import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SectionShell } from './SectionShell';

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

const FAQItem = memo<{ index: number; faqKey: string; isOpen: boolean; onToggle: () => void }>(
  ({ index, faqKey, isOpen, onToggle }) => {
    const { t } = useTranslation();
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: 0.7,
          delay: index * 0.06,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          rounded-2xl
          border backdrop-blur-xl
          transition-colors duration-300
          ${isOpen ? 'bg-white/[0.04] border-white/[0.14]' : 'bg-white/[0.02] border-white/[0.07] hover:border-white/[0.12]'}
        `}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-6 px-6 py-5 md:px-7 md:py-6 text-left"
          aria-expanded={isOpen}
        >
          <span className="text-[15px] md:text-base font-medium text-white tracking-tight">
            {t(`landing.faq_${faqKey}_q`)}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center"
          >
            <Plus size={14} className="text-white/75" strokeWidth={2} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-7 pb-6 text-sm md:text-[15px] text-white/60 leading-relaxed max-w-[720px]">
                {t(`landing.faq_${faqKey}_a`)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
FAQItem.displayName = 'FAQItem';

export const FAQ = memo(() => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionShell
      id="faq"
      eyebrow={t('landing.faqEyebrow')}
      title={t('landing.faqTitle')}
      description={t('landing.faqDescription')}
    >
      <div className="max-w-[860px] mx-auto space-y-3">
        {faqKeys.map((key, i) => (
          <FAQItem
            key={key}
            index={i}
            faqKey={key}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </SectionShell>
  );
});

FAQ.displayName = 'FAQ';
