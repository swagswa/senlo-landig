import React, { useState, useEffect, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Send, Paperclip, History, Settings } from 'lucide-react';
import { SenloLogo } from '@/components/ui/SenloLogo';

// ============================================================================
// Constants
// ============================================================================

const BOT_PHRASES_RU = [
  'Привет! Я Senlo -- ваш AI-ассистент.',
  'Расскажу о продуктах и отвечу на вопросы.',
  'Работаю 24/7, помню контекст разговора.',
  'Интегрируюсь с CRM и базой знаний.',
];

const BOT_PHRASES_EN = [
  "Hi! I'm Senlo -- your AI assistant.",
  "I'll tell you about products and answer questions.",
  'I work 24/7 and remember conversation context.',
  'I integrate with CRM and knowledge base.',
];

const TYPING_SPEED_MS = 80;
const DELETING_SPEED_MS = 40;
const PAUSE_BEFORE_DELETE_MS = 3000;
const PAUSE_BEFORE_TYPE_MS = 800;

// Responsive dimensions handled via CSS classes instead of fixed values

// ============================================================================
// Components
// ============================================================================

const SenloAvatar = memo(() => (
  <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 rounded-lg xl:rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#0066FF] flex items-center justify-center flex-shrink-0">
    <SenloLogo size={16} className="text-white xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
  </div>
));
SenloAvatar.displayName = 'SenloAvatar';

const ChatHeader = memo(() => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 border-b border-white/10">
      <div className="flex items-center gap-3 xl:gap-4">
        <SenloAvatar />
        <div>
          <div className="text-sm xl:text-base 2xl:text-lg font-medium text-white">Senlo AI</div>
          <div className="text-[10px] xl:text-xs 2xl:text-sm text-white/40">
            {t('landing.alwaysReady')}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="p-2 text-white/30">
          <History size={14} className="xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
        </div>
        <div className="p-2 text-white/30">
          <Settings size={14} className="xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
        </div>
      </div>
    </div>
  );
});
ChatHeader.displayName = 'ChatHeader';

interface MessageProps {
  text: string;
  isTyping: boolean;
}

const Message = memo<MessageProps>(({ text, isTyping }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 xl:mb-3">
        <span className="text-xs xl:text-sm 2xl:text-base font-medium text-[#00D4FF]">Senlo</span>
        <span className="text-[10px] xl:text-xs 2xl:text-sm text-white/30">{t('landing.now')}</span>
      </div>
      <div className="inline-block bg-white/5 border border-white/10 rounded-xl rounded-tl-sm px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 max-w-[90%]">
        <p className="text-sm xl:text-base 2xl:text-lg text-white/80 leading-relaxed">
          {text}
          <span
            className={`inline-block w-0.5 h-4 xl:h-5 2xl:h-6 ml-1 align-middle bg-[#00D4FF] ${!isTyping ? 'animate-pulse' : ''}`}
          />
        </p>
      </div>
    </div>
  );
});
Message.displayName = 'Message';

const ChatInput = memo(() => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 border-t border-white/10">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg xl:rounded-xl px-3 py-2 xl:px-4 xl:py-3 2xl:px-5 2xl:py-4">
        <Paperclip size={16} className="text-white/30 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
        <span className="flex-1 text-sm xl:text-base 2xl:text-lg text-white/30">
          {t('landing.messageBot')}
        </span>
        <Send size={14} className="text-white/30 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[10px] xl:text-xs 2xl:text-sm text-white/20">
          {t('landing.enterToSend')}
        </span>
        <span className="text-[10px] xl:text-xs 2xl:text-sm text-white/20">/help</span>
      </div>
    </div>
  );
});
ChatInput.displayName = 'ChatInput';

// ============================================================================
// Main Component
// ============================================================================

export const LandingChat: React.FC = () => {
  const { i18n } = useTranslation();
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const textRef = useRef('');
  const isDeletingRef = useRef(false);
  const phraseIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Floating effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Typewriter
  useEffect(() => {
    const tick = () => {
      const phrases = i18n.language === 'en' ? BOT_PHRASES_EN : BOT_PHRASES_RU;
      const phrase = phrases[phraseIndexRef.current % phrases.length];

      if (isDeletingRef.current) {
        if (textRef.current.length > 0) {
          textRef.current = textRef.current.slice(0, -1);
          setText(textRef.current);
          setIsTyping(false);
          timeoutRef.current = setTimeout(tick, DELETING_SPEED_MS);
        } else {
          isDeletingRef.current = false;
          const phrasesLen = (i18n.language === 'en' ? BOT_PHRASES_EN : BOT_PHRASES_RU).length;
          phraseIndexRef.current = (phraseIndexRef.current + 1) % phrasesLen;
          timeoutRef.current = setTimeout(tick, PAUSE_BEFORE_TYPE_MS);
        }
      } else {
        if (textRef.current.length < phrase.length) {
          textRef.current = phrase.slice(0, textRef.current.length + 1);
          setText(textRef.current);
          setIsTyping(true);
          timeoutRef.current = setTimeout(tick, TYPING_SPEED_MS);
        } else {
          setIsTyping(false);
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            tick();
          }, PAUSE_BEFORE_DELETE_MS);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, 500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[320px] h-[280px] sm:w-[380px] sm:h-[320px] md:w-[420px] md:h-[340px] lg:w-[480px] lg:h-[380px] xl:w-[540px] xl:h-[420px] 2xl:w-[600px] 2xl:h-[460px]"
      style={{ perspective: 1000 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <div className="w-full h-full bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden select-none pointer-events-none shadow-2xl">
          <div className="h-full flex flex-col">
            <ChatHeader />
            <div className="flex-1 px-4 py-4 lg:px-5 lg:py-5">
              <Message text={text} isTyping={isTyping} />
            </div>
            <ChatInput />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingChat;
