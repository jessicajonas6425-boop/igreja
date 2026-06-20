import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { ChurchConfig } from "./types";
import { seedDatabase } from "./dbSeed";

// Components
import Intro from "./components/Intro";
import Navbar from "./components/Navbar";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import EventsSection from "./components/EventsSection";
import GeracaoSanta from "./components/GeracaoSanta";
import MemberArea from "./components/MemberArea";
import AdminPanel from "./components/AdminPanel";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Real-time site configs synchronized via Firestore db
  const [churchConfig, setChurchConfig] = useState<ChurchConfig>({
    address: "Avenida Presidente Kennedy, 99 - Barramares, Vila Velha, ES",
    email: "igrejamcivilavelha@gmail.com",
    phone: "(27) 99695-2801",
    whatsapp: "5527996952801",
    instagram: "igrejamcivilavelha",
    facebook: "igrejamcivilavelha",
    youtube: "@igrejamcivilavelha",
    logoUrl: "https://i.postimg.cc/Y9q0dd8Z/726996325-1036680408784033-7332466181714466935-n.jpg",
    introCeuUrl: "https://i.postimg.cc/ZYPZW8c3/726838928-841485378789522-8854248702185838387-n.jpg",
    gsText: "O Geração Santa é o ministério de jovens apaixonado da Igreja MCI Vila Velha. Encontros vibrantes e profundos em santidade de vida.",
    gsVision: "Engajar os jovens de Vila Velha a viverem uma fé autêntica, forte e corajosa com o Espírito Santo."
  });

  useEffect(() => {
    // 1. Seed database with defaults on first boot if they do not exist
    seedDatabase();

    // 2. Subscribe to configurations in realtime from database
    const configDocRef = doc(db, "config", "main");
    const unsubscribeConfig = onSnapshot(configDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setChurchConfig(docSnap.data() as ChurchConfig);
      }
    }, (error) => {
      console.log("Config fetch failed, using fallback templates: ", error);
    });

    // 3. Monitor visible section on scroll
    const handleScroll = () => {
      const sections = ["home", "sobre-nos", "eventos", "geracao-santa", "membros", "admin", "contato"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      unsubscribeConfig();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth scroll and set active trigger
  const handleNavigate = (sectionId: string) => {
    if (sectionId === "admin") {
      setShowAdminPanel(true);
    }
    setActiveSection(sectionId);
    
    // Slight delay to allow focus and transition
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const handleToggleAdmin = () => {
    setShowAdminPanel((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          handleNavigate("admin");
        }, 100);
      }
      return next;
    });
  };

  const handleOpenAuth = () => {
    handleNavigate("membros");
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-amber-400 selection:text-zinc-950 font-sans">
      
      <AnimatePresence mode="wait">
        {showIntro ? (
          <div key="intro" className="fixed inset-0 z-50">
            <Intro onComplete={() => setShowIntro(false)} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col min-h-screen"
            key="main-web-content"
          >
            {/* Nav Header */}
            <Navbar 
              onNavigate={handleNavigate} 
              activeSection={activeSection} 
              onOpenAuth={handleOpenAuth} 
            />

            {/* Sections Wrapper */}
            <main className="flex-grow">
              
              {/* Home / Hero */}
              <HomeSection 
                onNavigate={handleNavigate} 
                onOpenAuth={handleOpenAuth} 
                config={churchConfig} 
              />
              
              {/* Sobre Nós */}
              <AboutSection />

              {/* Eventos */}
              <EventsSection />

              {/* Geração Santa (Grupo Jovem) */}
              <GeracaoSanta 
                config={churchConfig} 
                onNavigate={handleNavigate} 
              />

              {/* Membros Card Form and Area */}
              <MemberArea />

              {/* Restricted Admin Panel */}
              {showAdminPanel && <AdminPanel config={churchConfig} />}

              {/* Contatos / Localização */}
              <ContactSection config={churchConfig} />

            </main>

            {/* Footer */}
            <Footer 
              config={churchConfig} 
              onNavigate={handleNavigate} 
              onToggleAdmin={handleToggleAdmin}
            />

            {/* WhatsApp Floater */}
            <FloatingWhatsApp config={churchConfig} />

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
