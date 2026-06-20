import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Lock, Cake, Calendar, UserCheck, ShieldAlert, 
  MapPin, Phone, Heart, Mail, Edit3, Save, MessageSquare, Info 
} from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, getDocs, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Member, DailyVerse } from "../types";

export function generateMockEmail(name: string): string {
  if (!name) return "";
  const sanitized = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9_-]/g, "");    // remove spaces and other symbols
  return `${sanitized}@mcimembros.com`;
}

export default function MemberArea() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Input States
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [age, setAge] = useState("");
  const [pin, setPin] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Account editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editMinistry, setEditMinistry] = useState("");
  const [editCell, setEditCell] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");

  // Admin and daily details
  const [verse, setVerse] = useState<DailyVerse>({
    id: "v-default",
    text: "E conhecereis a verdade, e a verdade vos libertará.",
    reference: "João 8:32",
    dateString: ""
  });

  // Listen to Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Query Firestore for detailed member data
        const docRef = doc(db, "membros", user.uid);
        const unsubscribeMemberDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as Member;
            setMemberData(data);
            setEditPhone(data.phone || "");
            setEditMinistry(data.ministry || "");
            setEditCell(data.cellGroup || "");
            setEditPhotoUrl(data.photoUrl || "");
          } else {
            console.log("No such member document in Firestore.");
          }
        });

        return () => unsubscribeMemberDoc();
      } else {
        setMemberData(null);
      }
      setLoading(false);
    });

    // Realtime verse for member dashboard
    const unsubscribeVerse = onSnapshot(collection(db, "versiculos_diarios"), (snap) => {
      if (!snap.empty) {
        const today = new Date().toISOString().split("T")[0];
        const match = snap.docs.find(d => d.data().dateString === today);
        if (match) {
          setVerse({ id: match.id, ...match.data() } as DailyVerse);
        } else {
          setVerse({ id: snap.docs[0].id, ...snap.docs[0].data() } as DailyVerse);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeVerse();
    };
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!fullName.trim() || !birthYear.trim() || !birthDay.trim() || !birthMonth.trim() || !age.trim() || !pin.trim()) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios, incluindo o PIN de 6 dígitos.");
      return;
    }

    const pinVal = pin.trim();
    if (pinVal.length !== 6 || isNaN(Number(pinVal))) {
      setErrorMsg("O campo de lembrete com a senha deve ter exatamente 6 dígitos numéricos.");
      return;
    }

    const yearVal = parseInt(birthYear);
    const dayVal = parseInt(birthDay);
    const monthVal = parseInt(birthMonth);
    const ageVal = parseInt(age);

    if (isNaN(yearVal) || yearVal < 1920 || yearVal > new Date().getFullYear()) {
      setErrorMsg("Ano de nascimento inválido.");
      return;
    }
    if (isNaN(dayVal) || dayVal < 1 || dayVal > 31) {
      setErrorMsg("Dia de aniversário inválido.");
      return;
    }
    if (isNaN(monthVal) || monthVal < 1 || monthVal > 12) {
      setErrorMsg("Mês de aniversário inválido.");
      return;
    }
    if (isNaN(ageVal) || ageVal < 0 || ageVal > 130) {
      setErrorMsg("Idade inválida.");
      return;
    }

    const email = generateMockEmail(fullName);
    const password = pinVal;

    try {
      setLoading(true);
      // 1. Create account in Firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Set beautiful display name
      await updateProfile(user, { displayName: fullName.trim() });

      // 3. Save detailed schema in Firestore membros collection
      const newMember: Member = {
        id: user.uid,
        name: fullName.trim(),
        age: ageVal,
        birthDay: dayVal,
        birthMonth: monthVal,
        birthYear: yearVal,
        joinedAt: new Date().toISOString(),
        phone: "",
        cellGroup: "Visitante",
        ministry: "Membro",
        photoUrl: "",
        pin: pinVal
      };

      await setDoc(doc(db, "membros", user.uid), newMember);
      setSuccessMsg("Seu cadastro de membro foi realizado com sucesso!");
      setIsLogin(true);
      
      // Clear inputs
      setFullName("");
      setBirthYear("");
      setBirthDay("");
      setBirthMonth("");
      setAge("");
      setPin("");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("Este nome já está cadastrado como membro. Tente logar ou use variações do seu nome.");
      } else {
        setErrorMsg("Erro ao realizar cadastro: " + (err.message || err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || !loginPassword.trim()) {
      setErrorMsg("Por favor, preencha o Nome do Usuário e a Senha/PIN.");
      return;
    }

    // Checking if trying to log in as pastor/admin
    const isPastorLogin = fullName.trim().toLowerCase() === "pastor@x.com";
    const email = isPastorLogin ? "pastor@x.com" : generateMockEmail(fullName);
    const password = loginPassword.trim();

    try {
      setLoading(true);
      // Wait: pastor account might not exist yet during the very first run.
      // If pastor@x.com login fails, we register them on the fly to prevent password lockout.
      if (isPastorLogin) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authErr: any) {
          if (authErr.code === "auth/user-not-found" || authErr.code === "auth/invalid-credential") {
            // Register pastor automatically under the requested password 'pastor4321'
            if (password === "pastor4321") {
              await createUserWithEmailAndPassword(auth, email, password);
              await updateProfile(auth.currentUser!, { displayName: "Pastor Lider" });
            } else {
              throw authErr;
            }
          } else {
            throw authErr;
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      setSuccessMsg("Bem-vindo de volta à família MCI!");
      setLoginPassword("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Dados de login incorretos ou membro não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const memberDocRef = doc(db, "membros", currentUser.uid);
      await updateDoc(memberDocRef, {
        phone: editPhone,
        ministry: editMinistry,
        cellGroup: editCell,
        photoUrl: editPhotoUrl
      });
      setIsEditing(false);
      setSuccessMsg("Dados atualizados com sucesso!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Erro ao salvar atualizações: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Static church announcements
  const dailyAnnouncements = [
    {
      title: "Aniversariantes do Mês",
      text: "Hoje parabenizamos todos os nossos queridos irmãos aniversariantes deste mês! Que Deus derrame graças, sabedoria e muita unção sobre vocês."
    },
    {
      title: "Retiro de Jovens GS 2026",
      text: "As inscrições estão oficialmente abertas com condições exclusivas na secretaria. Garanta sua vaga com o líder dos jovens sabado no culto!"
    }
  ];

  return (
    <section id="membros" className="py-24 bg-sophisticated-dark relative overflow-hidden border-t border-white/5 flex flex-col justify-center min-h-[70vh] text-left">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gold/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gold-dark/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Loading State Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold border-t-transparent mb-3 shrink-0" />
            <span className="text-[10px] font-display text-zinc-500 uppercase tracking-widest">Aguarde...</span>
          </div>
        )}

        {!loading && !currentUser && (
          <div className="max-w-xl mx-auto">
            
            {/* Header info */}
            <div className="text-center mb-10 space-y-3">
              <span className="text-gold font-display tracking-[0.25em] text-[10px] uppercase block font-bold">
                Comunhão & Conectividade
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase italic">
                {isLogin ? "ACESSAR ÁREA " : "CADASTRE-SE NA "}
                <span className="text-gold not-italic font-sans font-black tracking-tight">{isLogin ? "DO MEMBRO." : "IGREJA."}</span>
              </h2>
              <div className="h-[1px] w-12 bg-gold mx-auto my-1" />
              <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                {isLogin 
                  ? "Acesse seu painel exclusivo com mensagens diárias, adoração e dados pessoais." 
                  : "Crie seu registro de membro para fazer parte oficialmente do nosso discipulado."}
              </p>
            </div>

            {/* Form Box */}
            <div className="bg-[#0A0C14] border border-white/10 rounded-sm p-6 sm:p-10 shadow-2xl relative">
              
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 p-4 mb-6 bg-red-950/40 border border-red-500/20 text-red-300 rounded-sm text-xs text-left"
                  >
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 p-4 mb-6 bg-green-950/40 border border-green-500/20 text-green-300 rounded-sm text-xs text-left"
                  >
                    <UserCheck className="w-4 h-4 flex-shrink-0 text-green-400" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-5 text-left">
                  <div>
                    <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Nome do Usuário (Membro) ou Email Pastor
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Ex: João da Silva (igual ao cadastro)"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3.5 pl-11 pr-4 text-white text-xs outline-none transition duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Senha / PIN de 6 Dígitos ou Senha Pastor
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        placeholder="Ex: 123456"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3.5 pl-11 pr-4 text-white text-xs outline-none transition duration-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-gold to-gold-dark text-black hover:brightness-110 rounded-sm transition-all shadow-md cursor-pointer transform hover:scale-[1.01] font-display"
                  >
                    Entrar no Painel do Membro
                  </button>
                  
                  <div className="pt-4 text-center border-t border-white/5">
                    <p className="text-xs text-zinc-500 font-light">
                      Não possui um cadastro de membro ainda?{" "}
                      <span
                        onClick={() => {
                          setErrorMsg("");
                          setSuccessMsg("");
                          setIsLogin(false);
                        }}
                        className="text-gold font-semibold hover:underline cursor-pointer ml-1"
                      >
                        Cadastre-se Agora
                      </span>
                    </p>
                  </div>
                </form>
              ) : (
                /* SIGNUP FORM */
                <form onSubmit={handleSignup} className="space-y-4 text-left">
                  
                  <div>
                    <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Ex: Pedro de Souza"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 pl-11 pr-4 text-white text-xs outline-none transition duration-200"
                        required
                      />
                    </div>
                    <span className="text-[9px] text-zinc-550 font-mono mt-1 block leading-relaxed">
                      Importante: Lembre-se do seu nome exato para usar nos próximos logins!
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Idade Atual
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 28"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition duration-200 font-sans"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Ano de Nascimento
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 1998"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 px-4 text-white text-xs outline-none transition duration-200 font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Dia de Aniversário
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                          <Cake className="w-4 h-4" />
                        </span>
                        <input
                          type="number"
                          placeholder="Ex: 14"
                          value={birthDay}
                          onChange={(e) => setBirthDay(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 pl-11 pr-4 text-white text-xs outline-none transition duration-200 font-sans"
                          min="1"
                          max="31"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Mês de Aniversário
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                          <Calendar className="w-4 h-4" />
                        </span>
                        <input
                          type="number"
                          placeholder="Ex: 10"
                          value={birthMonth}
                          onChange={(e) => setBirthMonth(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 pl-11 pr-4 text-white text-xs outline-none transition duration-200 font-sans"
                          min="1"
                          max="12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Senha / PIN de 6 Dígitos
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        maxLength={6}
                        placeholder="Ex: 123456"
                        value={pin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ""); // Apenas números
                          setPin(val);
                        }}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-sm py-3 pl-11 pr-4 text-white text-xs outline-none transition duration-200 font-sans"
                        required
                      />
                    </div>
                    <span className="text-[9px] text-gold font-mono mt-1 block leading-relaxed uppercase tracking-wide">
                      Importante: Lembre-se de sua senha exata de 6 dígitos para usar nos próximos logins!
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-gold to-gold-dark text-black rounded-sm transition-all shadow-md cursor-pointer transform hover:scale-[1.01] font-display"
                  >
                    Salvar e Cadastrar Membro
                  </button>

                  <div className="pt-4 text-center border-t border-white/5">
                    <p className="text-xs text-zinc-500 font-light">
                      Já possui seu cadastro de membro?{" "}
                      <span
                        onClick={() => {
                          setErrorMsg("");
                          setSuccessMsg("");
                          setIsLogin(true);
                        }}
                        className="text-gold font-semibold hover:underline cursor-pointer ml-1"
                      >
                        Faça Login aqui
                      </span>
                    </p>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

        {/* LOGGED MEMBER DASHBOARD PANEL */}
        {!loading && currentUser && memberData && (
          <div className="max-w-6xl mx-auto text-left w-full">
            
            {/* Greeting Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                
                {/* Photo profile circle */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gold to-gold-dark opacity-50 blur" />
                  <img
                    src={memberData.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                    alt={memberData.name}
                    referrerPolicy="no-referrer"
                    className="relative object-cover w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/10 shadow"
                  />
                </div>

                <div>
                  <span className="text-[9px] font-display font-bold tracking-widest uppercase bg-gold/10 text-gold border border-gold/25 px-2.5 py-1 rounded-sm">
                    💡 Família MCI
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-white uppercase mt-2 italic leading-tight">
                    Olá, <span className="text-gold not-italic font-sans font-black tracking-tight">{memberData.name}!</span>
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
                    Cadastrado desde {new Date(memberData.joinedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2.5 bg-[#0A0C14] hover:bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm transition-all flex items-center gap-1.5 cursor-pointer font-display"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gold" />
                  {isEditing ? "Cancelar Edição" : "Editar meus dados"}
                </button>
                
                <button
                  onClick={() => auth.signOut()}
                  className="px-4 py-2.5 bg-[#5b1e1e]/15 hover:bg-[#5b1e1e]/35 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider text-red-300 rounded-sm transition-all cursor-pointer font-display"
                >
                  Encerrar Sessão
                </button>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Personal info summary & editors */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-[#0A0C14] border border-white/10 rounded-sm p-6 shadow-xl space-y-5">
                  <h3 className="text-[10px] font-bold font-display text-white uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gold" /> Seus Dados Cadastrais
                  </h3>

                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      /* EDITING MODE SUBMISSION */
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                          <label className="text-[9px] font-display font-medium text-zinc-500 uppercase tracking-widest block mb-1">
                            Foto de Perfil (URL da Imagem)
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: https://..."
                            value={editPhotoUrl}
                            onChange={(e) => setEditPhotoUrl(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-2.5 px-3 text-white text-xs outline-none focus:border-gold/50"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-display font-medium text-zinc-500 uppercase tracking-widest block mb-1">
                            Telefone / WhatsApp
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: (27) 99888-7766"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-2.5 px-3 text-white text-xs outline-none focus:border-gold/50"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-display font-medium text-zinc-500 uppercase tracking-widest block mb-1">
                            Seu Pequeno Grupo (Célula)
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Célula Amizade"
                            value={editCell}
                            onChange={(e) => setEditCell(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-2.5 px-3 text-white text-xs outline-none focus:border-gold/50"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-display font-medium text-zinc-500 uppercase tracking-widest block mb-1">
                            Ministério que Atua
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Igreja / Louvor / GS"
                            value={editMinistry}
                            onChange={(e) => setEditMinistry(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-2.5 px-3 text-white text-xs outline-none focus:border-gold/50"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-gradient-to-r from-gold to-gold-dark text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display shadow-md"
                        >
                          <Save className="w-3.5 h-3.5" /> Salvar Alterações
                        </button>
                      </form>
                    ) : (
                      /* READ-ONLY CARD INFO */
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-white/5">
                          <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider">Idade</span>
                          <span className="text-xs text-white font-semibold">{memberData.age} anos</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-white/5">
                          <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider">Aniversário</span>
                          <span className="text-xs text-white font-semibold">
                            {String(memberData.birthDay).padStart(2, '0')}/{String(memberData.birthMonth).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-white/5">
                          <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider">WhatsApp</span>
                          <span className="text-xs text-zinc-200 font-mono">
                            {memberData.phone || "Não informado"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-white/5">
                          <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider">Sua Célula</span>
                          <span className="text-xs text-gold font-bold font-display uppercase tracking-wider">{memberData.cellGroup || "Nenhuma"}</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-white/5">
                          <span className="text-[9px] font-display text-zinc-500 uppercase tracking-wider">Ministério</span>
                          <span className="text-xs text-white font-bold font-display uppercase tracking-wider">{memberData.ministry || "Nenhum"}</span>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

              {/* Right Column: Real-time Verse Feed, Church news & Notices */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Real-time Scripture Banner */}
                <div className="bg-[#0A0C14] border border-white/10 p-6 rounded-sm relative overflow-hidden shadow-xl">
                  <div className="absolute right-0 bottom-0 pr-6 pb-2 select-none opacity-5 pointer-events-none">
                    <span className="text-9xl font-serif">“</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[9px] text-gold uppercase font-display tracking-[0.2em] mb-4 font-bold">
                    <Heart className="w-4 h-4 text-gold shrink-0" />
                    Meditação Diária
                  </div>

                  <p className="text-white text-base sm:text-lg italic font-serif font-light leading-relaxed">
                    "{verse.text}"
                  </p>
                  
                  <span className="text-gold font-display text-xs font-bold tracking-widest uppercase mt-4 text-right block">
                    — {verse.reference}
                  </span>
                </div>

                {/* Mural de Avisos da Igreja */}
                <div className="bg-[#0A0C14] border border-white/10 rounded-sm p-6 shadow-xl space-y-5">
                  <h3 className="text-[10px] font-bold font-display text-white uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-gold" /> Mural de Avisos & Agenda Interna
                  </h3>

                  <div className="space-y-4">
                    {dailyAnnouncements.map((ann, idx) => (
                      <div 
                        key={idx} 
                        className="bg-black/20 p-4 rounded-sm border border-white/5 flex items-start gap-3.5 hover:border-gold/25 transition duration-200"
                      >
                        <div className="p-2 sm:p-2.5 bg-white/5 rounded-sm border border-white/10 mt-1 text-gold flex-shrink-0">
                          <Info className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold font-display text-white tracking-wider uppercase block">
                            {ann.title}
                          </span>
                          <p className="text-xs text-zinc-400 font-light leading-relaxed">
                            {ann.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}
