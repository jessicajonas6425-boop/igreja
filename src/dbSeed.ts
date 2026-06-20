import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { ChurchConfig, Event, DailyVerse } from "./types";

const defaultConfig: ChurchConfig = {
  address: "Avenida Presidente Kennedy, 99 - Barramares, Vila Velha, ES",
  email: "igrejamcivilavelha@gmail.com",
  phone: "(27) 99695-2801",
  whatsapp: "5527996952801",
  instagram: "igrejamcivilavelha",
  facebook: "igrejamcivilavelha",
  youtube: "@igrejamcivilavelha",
  logoUrl: "https://i.postimg.cc/Y9q0dd8Z/726996325-1036680408784033-7332466181714466935-n.jpg",
  introCeuUrl: "https://i.postimg.cc/ZYPZW8c3/726838928-841485378789522-8854248702185838387-n.jpg",
  gsText: "O Geração Santa é o ministério de jovens apaixonado da Igreja MCI Vila Velha. Unimos música contemporânea, amizade genuína, espiritualidade profunda e uma vontade incansável de fazer a diferença. Nossos encontros são repletos de vida, movimento e do fogo do Espírito Santo.",
  gsVision: "Engajar os jovens a viverem uma fé autêntica e corajosa, estabelecendo valores eternos, promovendo a santidade e transformando nossa comunidade em Vila Velha."
};

const defaultEvents: Event[] = [
  {
    id: "culto-domingo",
    title: "Culto de Celebração",
    description: "Nosso encontro semanal de adoração em família. Venha receber uma palavra inspiradora, louvar com excelência e sentir a presença e o poder de Deus.",
    date: "Todo Domingo",
    time: "18:00",
    location: "Templo Principal - MCI Vila Velha",
    imageUrl: "https://i.postimg.cc/ZYPZW8c3/726838928-841485378789522-8854248702185838387-n.jpg",
    category: "Celebração"
  },
  {
    id: "culto-jovens",
    title: "Culto Geração Santa",
    description: "O encontro oficial dos jovens da MCI Vila Velha. Louvor elétrico, palavra direta e um pós-culto inesquecível com muita resenha e amizade.",
    date: "Sábado Alternados",
    time: "19:30",
    location: "Auditório dos Jovens",
    imageUrl: "https://i.postimg.cc/8PV53kyb/725318273-3060397824170772-6348945460884155426-n.jpg",
    category: "Jovens (GS)"
  },
  {
    id: "celulas-semanais",
    title: "Célula nos Lares",
    description: "Nossa comunidade reunida em pequenos grupos em Vila Velha. Compartilhar a vida, orar uns pelos outros e crescer juntos na fê cristã.",
    date: "Quartas e Quintas",
    time: "20:00",
    location: "Casas e Apartamentos em Vila Velha",
    imageUrl: "https://i.postimg.cc/VLc6Ts7W/726948247-1005898895177912-798875860879382165-n.jpg",
    category: "Pequenos Grupos"
  }
];

const defaultVerses: DailyVerse[] = [
  {
    id: "v-1",
    text: "Elegendo Deus o que para o mundo é fraqueza, para envergonhar as forças espirituais do mal, Ele nos chamou.",
    reference: "1 Coríntios 1:27",
    dateString: "default"
  },
  {
    id: "v-2",
    text: "Mas recebereis poder, ao descer sobre vós o Espírito Santo, e sereis minhas testemunhas tanto em Jerusalém como em toda a Judeia e Samaria e até aos confins da terra.",
    reference: "Atos 1:8",
    dateString: "default"
  },
  {
    id: "v-3",
    text: "Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai senão por mim.",
    reference: "João 14:6",
    dateString: "default"
  }
];

export async function seedDatabase() {
  try {
    // 1. Seed and Force Update Phone Numbers on Config
    const configDocRef = doc(db, "config", "main");
    const configSnap = await getDoc(configDocRef);
    if (!configSnap.exists()) {
      await setDoc(configDocRef, defaultConfig);
      console.log("Config seeded.");
    } else {
      // Force update the whatsapp and phone to the new church requirements
      await setDoc(configDocRef, {
        phone: "(27) 99695-2801",
        whatsapp: "5527996952801"
      }, { merge: true });
      console.log("Default phone updated to live.");
    }

    // 2. Seed and Update Events (auto-replace old unsplash fallback content with real user photos)
    const eventsCollRef = collection(db, "eventos");
    for (const ev of defaultEvents) {
      const docRef = doc(eventsCollRef, ev.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, ev);
      } else {
        const existingData = docSnap.data();
        if (existingData && (existingData.imageUrl?.includes("unsplash") || !existingData.imageUrl)) {
          await setDoc(docRef, {
            ...existingData,
            imageUrl: ev.imageUrl,
            title: ev.title,
            category: ev.category
          }, { merge: true });
        }
      }
    }

    // 3. Seed Verses
    const versesCollRef = collection(db, "versiculos_diarios");
    const versesSnap = await getDocs(versesCollRef);
    if (versesSnap.empty) {
      for (const ver of defaultVerses) {
        await setDoc(doc(versesCollRef, ver.id), ver);
      }
      console.log("Default verses seeded.");
    }
  } catch (err) {
    console.error("Error seeding database: ", err);
  }
}
