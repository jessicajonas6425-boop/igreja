export interface Member {
  id: string;
  name: string;
  age: number;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  joinedAt: string;
  phone?: string;
  email?: string;
  cellGroup?: string;
  ministry?: string;
  photoUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  category: string;
}

export interface DailyVerse {
  id: string;
  text: string;
  reference: string;
  dateString: string; // YYYY-MM-DD
}

export interface ChurchConfig {
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  logoUrl: string;
  introCeuUrl: string;
  gsText: string;
  gsVision: string;
}
