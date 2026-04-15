import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: 'center' | 'left';
  divider?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const dividerVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const SectionShell = memo<SectionShellProps>(
  ({ id, eyebrow, title, description, children, className = '', align = 'center', divider = true }) => {
    return (
      <section id={id} className={`relative py-20 md:py-28 px-6 md:px-10 ${className}`}>
        {divider && (
          <motion.div
            variants={dividerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(92%,1100px)] h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent origin-center pointer-events-none"
          />
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-[1200px] mx-auto"
        >
          {(eyebrow || title || description) && (
            <div
              className={`mb-12 md:mb-16 ${
                align === 'center' ? 'text-center mx-auto max-w-[760px]' : 'text-left max-w-[720px]'
              }`}
            >
              {eyebrow && (
                <motion.div variants={itemVariants} className="mb-4">
                  <span className="inline-block text-[11px] md:text-xs font-medium tracking-[0.22em] uppercase text-[#00D4FF]/75">
                    {eyebrow}
                  </span>
                </motion.div>
              )}
              {title && (
                <motion.h2
                  variants={itemVariants}
                  className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold tracking-[-0.02em] leading-[1.1] text-white"
                >
                  {title}
                </motion.h2>
              )}
              {description && (
                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-base md:text-lg text-white/55 leading-relaxed"
                >
                  {description}
                </motion.p>
              )}
            </div>
          )}

          {children}
        </motion.div>
      </section>
    );
  },
);

SectionShell.displayName = 'SectionShell';
