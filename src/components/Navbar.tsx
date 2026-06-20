import { useState, useEffect } from "react";
import { User, Menu, X, Settings2, LogOut } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAuth: () => void;
}

export default function Navbar({ onNavigate, activeSection, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Sobre Nós", id: "sobre-nos" },
    { label: "Eventos", id: "eventos" },
    { label: "Geração Santa", id: "geracao-santa" },
    { label: "Área do Membro", id: "membros" },
    { label: "Contato", id: "contato" },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Sessão encerrada com sucesso!");
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = user?.email === "pastor@x.com";

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-sophisticated-dark/80 backdrop-blur-md border-b border-white/10 py-2 sm:py-3 shadow-2xl"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo with Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleLinkClick("home")}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-white to-gold opacity-60 blur group-hover:opacity-100 transition duration-300" />
              <img
                src="https://i.postimg.cc/Y9q0dd8Z/726996325-1036680408784033-7332466181714466935-n.jpg"
                alt="Logo MCI"
                referrerPolicy="no-referrer"
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gold object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gold uppercase group-hover:from-gold group-hover:to-gold-dark transition duration-300">
                MCI VILA VELHA
              </span>
              <span className="text-[9px] sm:text-[10px] font-display text-zinc-400 tracking-[0.2em] hidden sm:block">
                UM LUGAR PARA PERTENCER
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all relative font-display ${
                  activeSection === item.id
                    ? "text-gold"
                    : "text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold rounded-full" />
                )}
              </button>
            ))}

            {/* Admin Link if Admin is authorized */}
            {isAdmin && (
              <button
                onClick={() => handleLinkClick("admin")}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:text-white bg-sophisticated-card border border-gold/30 hover:border-gold rounded-lg flex items-center gap-1.5 transition-all ${
                  activeSection === "admin" ? "bg-gold/10 text-white border-gold" : ""
                }`}
              >
                <Settings2 className="w-3.5 h-3.5 text-gold" />
                Painel Admin
              </button>
            )}

            {/* Custom Logged / Sign In Status */}
            {user ? (
              <div className="flex items-center gap-2 pl-4 border-l border-white/10 ml-2 animate-none">
                <div 
                  onClick={() => handleLinkClick("membros")} 
                  className="flex items-center gap-1.5 cursor-pointer max-w-[150px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                >
                  <User className="w-4 h-4 text-gold" />
                  <span className="text-xs text-zinc-200 font-medium truncate">
                    {user.displayName || "Membro"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sair"
                  className="p-2 text-zinc-400 hover:text-red-400 cursor-pointer bg-zinc-900/50 hover:bg-red-950/20 rounded-lg border border-zinc-800 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="ml-4 px-6 py-2 border border-gold text-gold rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all cursor-pointer"
              >
                Área do Membro
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAdmin && (
              <button
                onClick={() => handleLinkClick("admin")}
                className="p-2 text-gold bg-sophisticated-card border border-gold/20 rounded-lg"
                title="Painel Admin"
              >
                <Settings2 className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 focus:outline-none border border-white/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state */}
      {isOpen && (
        <div className="lg:hidden bg-sophisticated-dark border-b border-white/10 py-3 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all font-display ${
                activeSection === item.id
                  ? "bg-gold/5 text-gold border-l-2 border-gold"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Admin panel Mobile */}
          {isAdmin && (
            <button
              onClick={() => handleLinkClick("admin")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all text-gold bg-sophisticated-card border border-gold/20 ${
                activeSection === "admin" ? "border-l-2 border-gold bg-gold/5 text-white" : ""
              }`}
            >
              ⚙️ Painel Admin
            </button>
          )}

          {/* Login / Auth session and details on Mobile */}
          <div className="pt-4 border-t border-white/10 mt-2 flex flex-col gap-2.5">
            {user ? (
              <div className="flex items-center justify-between bg-sophisticated-card p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-zinc-200">
                    {user.displayName || "Membro"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-xs text-red-400 font-semibold border border-red-500/20 hover:border-red-500/40 hover:bg-red-950/10 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-3.5 border border-gold text-gold rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                Área do Membro
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
