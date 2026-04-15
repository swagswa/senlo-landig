import React, { memo, Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import {
  Users,
  TrendingUp,
  Sparkles,
  Play,
  MessageCircle,
  HelpCircle,
  Workflow,
  Menu,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { TabItem } from '@/components/ui/expandable-tabs';
import LandingChat from './LandingChat';
import { SenloLogo } from '@/components/ui/SenloLogo';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { ProblemSolution } from './sections/ProblemSolution';
import { FeaturesGrid } from './sections/FeaturesGrid';
import { HowItWorks } from './sections/HowItWorks';
import { Integrations } from './sections/Integrations';
import { DemoSection } from './sections/DemoSection';
import { FAQ } from './sections/FAQ';
import { Footer } from './sections/Footer';

// ============================================================================
// Shader Background
// ============================================================================

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_resolution;

  vec2 toPolar(vec2 p) {
    float r = length(p);
    float a = atan(p.y, p.x);
    return vec2(r, a);
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = 6.0 * ((fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y);
    vec2 polar = toPolar(p);
    float r = polar.x;

    vec2 i = p;
    float c = 0.0;
    float rot = r + u_time + p.x * 0.100;

    for (float n = 0.0; n < 4.0; n++) {
      float rr = r + 0.15 * sin(u_time * 0.7 + n + r * 2.0);
      p *= mat2(
        cos(rot - sin(u_time / 10.0)), sin(rot),
        -sin(cos(rot) - u_time / 10.0), cos(rot)
      ) * -0.25;

      float t = r - u_time / (n + 30.0);
      i -= p + sin(t - i.y) + rr;

      c += 2.2 / length(vec2(
        (sin(i.x + t) / 0.15),
        (cos(i.y + t) / 0.15)
      ));
    }

    c /= 8.0;
    vec3 baseColor = vec3(0.0, 0.83, 1.0);
    vec3 finalColor = baseColor * smoothstep(0.0, 1.0, c * 0.6);
    fragColor = vec4(finalColor, 1.0);
  }

  void main() {
    vec4 fragColor;
    vec2 fragCoord = vUv * u_resolution.xy;
    mainImage(fragColor, fragCoord);
    gl_FragColor = fragColor;
  }
`;

const ShaderBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

// ============================================================================
// Animation Variants
// ============================================================================

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const headlineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const chatVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 },
  },
};

const decorEntranceVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.6 + delay * 0.15,
    },
  }),
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ============================================================================
// Mouse Parallax Hook
// ============================================================================

const useMouseParallax = (intensity: number = 0.02) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set((e.clientX - centerX) * intensity);
      mouseY.set((e.clientY - centerY) * intensity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, intensity]);

  return { x, y };
};

// ============================================================================
// Navbar
// ============================================================================

const Navbar = memo(() => {
  const { t } = useTranslation();
  const navTabs: TabItem[] = [
    { title: t('landing.navFeatures'), icon: Sparkles, href: '#features' },
    { title: t('landing.navHow'), icon: Workflow, href: '#how' },
    { title: t('landing.navDemo'), icon: Play, href: '#demo' },
    { type: 'separator' },
    { title: t('landing.navFaq'), icon: HelpCircle, href: '#faq' },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-4 md:py-6">
        <div className="flex items-center justify-center gap-3 md:gap-4">
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-lg shadow-black/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#0066FF] flex items-center justify-center shadow-lg shadow-[#00D4FF]/30">
              <SenloLogo size={16} className="text-white md:w-[18px] md:h-[18px]" />
            </div>
            <span className="text-sm md:text-base font-semibold text-white tracking-tight pr-1">
              Senlo
            </span>
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="text-[10px] text-white/40 hidden sm:inline">Online</span>
            </div>
          </motion.div>

          <ExpandableTabs tabs={navTabs} activeColor="text-[#00D4FF]" className="hidden sm:flex" />

          <motion.button
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </motion.button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden mt-3 p-2 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl"
          >
            {navTabs
              .filter(
                (tab): tab is Exclude<TabItem, { type: 'separator' }> => tab.type !== 'separator',
              )
              .map((tab, index) => (
                <a
                  key={tab.title || index}
                  href={tab.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <tab.icon size={18} />
                  {tab.title}
                </a>
              ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
});
Navbar.displayName = 'Navbar';

// ============================================================================
// Decorative Elements
// ============================================================================

interface DecorativeStatProps {
  Icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
  iconBg: string;
  delay: number;
}

const DecorativeStat = memo<DecorativeStatProps>(
  ({ Icon, iconColor, label, value, iconBg, delay }) => (
    <motion.div
      variants={decorEntranceVariants}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="
      pointer-events-none select-none
      flex items-center gap-3 xl:gap-4 2xl:gap-5
      px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5
      bg-[#141414]/80 backdrop-blur-md
      border border-white/[0.08]
      rounded-xl xl:rounded-2xl
      shadow-xl shadow-black/20
    "
    >
      <div
        className={`w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-lg xl:rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        <Icon size={22} strokeWidth={2} className={`xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[10px] xl:text-xs 2xl:text-sm text-white/40 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-white">{value}</p>
      </div>
    </motion.div>
  ),
);
DecorativeStat.displayName = 'DecorativeStat';

const DecorativeChatBubble = memo<{
  text: string;
  isBot?: boolean;
  delay: number;
}>(({ text, isBot = true, delay }) => (
  <motion.div
    variants={decorEntranceVariants}
    custom={delay}
    initial="hidden"
    animate="visible"
    className={`
      pointer-events-none select-none
      max-w-[160px] xl:max-w-[200px] 2xl:max-w-[240px]
      px-3 py-2.5 xl:px-4 xl:py-3 2xl:px-5 2xl:py-4
      backdrop-blur-md
      shadow-lg shadow-black/20
      ${
        isBot
          ? 'bg-white/95 text-black rounded-xl xl:rounded-2xl rounded-tl-sm'
          : 'bg-[#141414]/80 border border-white/[0.08] text-white/80 rounded-xl xl:rounded-2xl rounded-tr-sm'
      }
    `}
  >
    {isBot && (
      <div className="flex items-center gap-1 xl:gap-1.5 mb-1 xl:mb-2">
        <div className="w-3 h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 rounded xl:rounded-md bg-gradient-to-br from-[#00D4FF] to-[#0066FF] flex items-center justify-center">
          <SenloLogo size={6} className="text-white xl:w-2 xl:h-2 2xl:w-3 2xl:h-3" />
        </div>
        <span className="text-[8px] xl:text-[10px] 2xl:text-xs font-medium text-black/50">
          Senlo AI
        </span>
      </div>
    )}
    <p
      className={`text-[11px] xl:text-xs 2xl:text-sm leading-relaxed ${isBot ? 'text-black/80' : ''}`}
    >
      {text}
    </p>
  </motion.div>
));
DecorativeChatBubble.displayName = 'DecorativeChatBubble';

const LeftDecorations = memo(() => {
  const { t } = useTranslation();
  return (
    <>
      <div className="absolute top-[8%]" style={{ left: 'calc(-10vw - 60px)' }}>
        <DecorativeStat
          Icon={TrendingUp}
          iconColor="text-[#00D4FF]"
          label={t('landing.tokens')}
          value="-90%"
          iconBg="bg-[rgba(0,212,255,0.15)]"
          delay={0}
        />
      </div>

      <div className="absolute top-1/2 -translate-y-1/2" style={{ left: 'calc(-14vw - 70px)' }}>
        <DecorativeChatBubble text={t('landing.fromDocs')} isBot delay={1} />
      </div>
    </>
  );
});
LeftDecorations.displayName = 'LeftDecorations';

const RightDecorations = memo(() => {
  const { t } = useTranslation();
  return (
    <>
      <div className="absolute top-[8%]" style={{ right: 'calc(-10vw - 60px)' }}>
        <DecorativeStat
          Icon={Users}
          iconColor="text-[#00D4FF]"
          label={t('landing.agents')}
          value="6+"
          iconBg="bg-[#00D4FF]/15"
          delay={0.5}
        />
      </div>

      <div className="absolute top-1/2 -translate-y-1/2" style={{ right: 'calc(-14vw - 70px)' }}>
        <DecorativeChatBubble text={t('landing.rememberConvo')} isBot={false} delay={1.5} />
      </div>
    </>
  );
});
RightDecorations.displayName = 'RightDecorations';

// ============================================================================
// Headline + Hero CTAs
// ============================================================================

const Headline = memo(() => {
  const { t } = useTranslation();
  return (
    <motion.div
      variants={headlineVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-8 md:mb-10 lg:mb-12 2xl:mb-16 relative z-30 max-w-[920px] mx-auto"
    >
      <motion.div variants={wordVariants} className="mb-4 lg:mb-5">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/[0.06] backdrop-blur-xl">
          <MessageCircle size={12} className="text-[#00D4FF]" strokeWidth={2} />
          <span className="text-[10px] sm:text-[11px] lg:text-xs font-medium tracking-[0.18em] uppercase text-[#00D4FF]/85">
            {t('landing.eyebrow')}
          </span>
        </span>
      </motion.div>

      <h1 className="text-[clamp(1.85rem,3.8vw,3.6rem)] font-semibold tracking-[-0.02em] leading-[1.08]">
        <motion.span variants={wordVariants} className="block text-white">
          {t('landing.headlineTop')}
        </motion.span>
      </h1>

      <motion.p
        variants={wordVariants}
        className="mt-5 md:mt-6 text-sm md:text-base text-white/55 leading-relaxed max-w-[600px] mx-auto"
      >
        {t('landing.heroSubheadline')}
      </motion.p>

      <motion.div
        variants={ctaVariants}
        className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <a
          href="/smart-onboarding"
          className="
            group inline-flex items-center gap-2.5
            px-6 py-3.5
            rounded-xl
            bg-gradient-to-r from-[#00D4FF] to-[#0066FF]
            text-black text-sm font-semibold tracking-tight
            hover:brightness-110 active:scale-[0.98]
            transition-all duration-300
            shadow-xl shadow-[#00D4FF]/20
          "
        >
          {t('landing.heroPrimaryCta')}
          <ArrowRight
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </a>
        <a
          href="#demo"
          className="
            inline-flex items-center gap-2
            px-6 py-3.5
            rounded-xl
            bg-white/[0.04] border border-white/[0.08]
            text-white/85 text-sm font-semibold tracking-tight
            hover:bg-white/[0.08] hover:border-white/[0.16]
            active:scale-[0.98]
            transition-all duration-300
          "
        >
          <Play size={14} strokeWidth={2.5} className="text-[#00D4FF]" />
          {t('landing.heroSecondaryCta')}
        </a>
      </motion.div>
    </motion.div>
  );
});
Headline.displayName = 'Headline';

// ============================================================================
// Hero Section (no own background; consumes the sticky shader behind)
// ============================================================================

const Hero = memo(() => {
  const parallax = useMouseParallax(0.015);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 pt-24 pb-10 overflow-hidden">
      <Headline />

      <motion.div
        variants={chatVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20"
      >
        <motion.div
          className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
          style={{ x: parallax.x, y: parallax.y }}
        >
          <LeftDecorations />
          <RightDecorations />
        </motion.div>

        <div className="relative z-20">
          <LandingChat />
        </div>
      </motion.div>
    </section>
  );
});
Hero.displayName = 'Hero';

// ============================================================================
// Sticky Shader Background (stays in place, blurs and darkens with scroll)
// ============================================================================

interface StickyBackdropProps {
  scrollContainer: React.RefObject<HTMLDivElement | null>;
}

const StickyBackdrop = memo<StickyBackdropProps>(({ scrollContainer }) => {
  const { scrollYProgress } = useScroll({
    container: scrollContainer as React.RefObject<HTMLDivElement>,
    offset: ['start start', 'end end'],
  });

  // Blur and fade dissolve the shader in place - no scale, no movement
  const blurPx = useTransform(scrollYProgress, [0, 0.08, 0.22], [0, 10, 28]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const shaderOpacity = useTransform(scrollYProgress, [0, 0.12, 0.25], [1, 0.5, 0]);

  // Dark overlay ramps to full black past the hero
  const darkOpacity = useTransform(scrollYProgress, [0, 0.08, 0.25], [0, 0.55, 1]);

  return (
    <div className="sticky top-0 left-0 right-0 h-screen w-full z-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 will-change-[filter,opacity]"
        style={{ filter, opacity: shaderOpacity }}
      >
        <Suspense fallback={null}>
          <Canvas
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
          >
            <ShaderBackground />
          </Canvas>
        </Suspense>
      </motion.div>

      {/* Hero vignette: kept always for legibility on hero content */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 100%, rgba(0, 212, 255, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0, 0, 0, 0.7) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(10, 10, 10, 0.75) 0%, rgba(10, 10, 10, 0.25) 40%, rgba(10, 10, 10, 0.9) 100%)
          `,
        }}
      />

      {/* Dark curtain: 0 on hero, fully black past first section */}
      <motion.div className="absolute inset-0 bg-[#0A0A0A]" style={{ opacity: darkOpacity }} />
    </div>
  );
});
StickyBackdrop.displayName = 'StickyBackdrop';

// ============================================================================
// Landing Page
// ============================================================================

export const LandingPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="w-full h-screen relative bg-[#0A0A0A] overflow-y-auto overflow-x-hidden landing-scroll"
    >
      <Navbar />

      {/* Sticky bg + content share one containing block so sticky holds the whole page */}
      <div className="relative">
        <StickyBackdrop scrollContainer={scrollRef} />

        <div className="relative z-10 -mt-[100vh]">
          <Hero />
          <ProblemSolution />
          <FeaturesGrid />
          <HowItWorks />
          <Integrations />
          <DemoSection />
          <FAQ />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
