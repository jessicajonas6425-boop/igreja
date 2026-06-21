import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Elegant phased timing for intro elements
    // 0s - 2.5s: Bible Verse
    // 2.5s - 5.5s: Church Logo overlay with glow
    // 5.5s - 6.0s: Total transition to main page
    
    const verseTimer = setTimeout(() => {
      setStep(1);
    }, 2800);

    const logoTimer = setTimeout(() => {
      setStep(2);
    }, 5500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6200);

    return () => {
      clearTimeout(verseTimer);
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Array of floating light particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 6 + 6,
    delay: Math.random() * -10,
  }));

  return (
    <motion.div
      id="intro-overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sophisticated-dark overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Sky Background Photo with subtle zoom-out parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 pointer-events-none"
        style={{ 
          backgroundImage: `url('https://i.postimg.cc/ZYPZW8c3/726838928-841485378789522-8854248702185838387-n.jpg')`,
          filter: "brightness(0.6) contrast(1.1) saturate(0.85)"
        }}
      />

      {/* Deep spiritual overlay (teal/dark) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#051414] via-[#0A2424]/60 to-transparent pointer-events-none" />

      {/* Light Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gold/40 blur-[1px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: ["0px", "-150px"],
              x: ["0px", Math.random() > 0.5 ? "30px" : "-30px"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 text-center flex flex-col items-center justify-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="verse"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="text-gold font-display tracking-[0.25em] font-bold uppercase text-xs sm:text-sm mb-4">
                Igreja MCI Vila Velha
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl text-zinc-100 font-serif italic font-light leading-relaxed tracking-wide text-shadow-md">
                "Mas recebereis poder, ao descer sobre vós o Espírito Santo..."
              </p>
              <div className="h-[1px] w-16 bg-gold my-4" />
              <p className="text-gold/80 font-display text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold">
                Atos 1:8
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ 
                duration: 0.9, 
                ease: [0.34, 1.56, 0.64, 1] 
              }}
              className="flex flex-col items-center"
            >
              {/* Glowing Logo Circle */}
              <div className="relative group mb-6">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold to-gold-dark opacity-75 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <img
                  src="https://i.postimg.cc/Y9q0dd8Z/726996325-1036680408784033-7332466181714466935-n.jpg"
                  alt="Igreja MCI Vila Velha Logo"
                  referrerPolicy="no-referrer"
                  className="relative object-cover w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gold shadow-2xl"
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-display font-medium tracking-wider text-zinc-50 uppercase"
              >
                MCI VILA VELHA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gold font-display tracking-[0.25em] text-[10px] uppercase mt-2 font-bold"
              >
                UmLugarParaPertencer
              </motion.p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="transition"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-zinc-500 font-display text-[10px] uppercase tracking-widest"
            >
              Inicializando...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2">
          <div className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${step === 0 ? 'bg-gold' : 'bg-white/10'}`} />
          <div className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${step === 1 ? 'bg-gold' : 'bg-white/10'}`} />
        </div>
      </div>
    </motion.div>
  );
}
