export type themeType =
  | "Modern"
  | "Minimalist"
  | "Professional"
  | "Tropical"
  | "Industrial"
  | "Scandinavian"
  | "Classic"
  | "Contemporary"
  | "Japandi"
  | "Bohemian"
  | "Rustic"
  | "Art Deco";

export type roomType =
  | "Living Room"
  | "Dining Room"
  | "Bedroom"
  | "Bathroom"
  | "Office"
  | "Gaming Room"
  | "Kitchen"
  | "Family Room"
  | "Terrace"
  | "Study Room"
  | "Prayer Room"
  | "Laundry Room"
  | "Library"
  | "Balcony";

export const themeTranslations: Record<themeType, string> = {
  Modern: "Modern",
  Minimalist: "Minimalis",
  Professional: "Profesional",
  Tropical: "Tropis",
  Industrial: "Industrial",
  Scandinavian: "Skandinavia",
  Classic: "Klasik",
  Contemporary: "Kontemporer",
  Japandi: "Japandi",
  Bohemian: "Bohemian",
  Rustic: "Rustic",
  "Art Deco": "Art Deco",
};

export const roomTranslations: Record<roomType, string> = {
  "Living Room": "Ruang Tamu",
  "Family Room": "Ruang Keluarga",
  "Dining Room": "Ruang Makan",
  Kitchen: "Dapur",
  Bedroom: "Kamar Tidur",
  Bathroom: "Kamar Mandi",
  "Study Room": "Ruang Belajar",
  Office: "Kantor",
  "Prayer Room": "Musholla",
  Terrace: "Teras",
  "Gaming Room": "Ruang Gaming",
  "Laundry Room": "Ruang Laundry",
  Library: "Perpustakaan",
  Balcony: "Balkon",
};

export const themes: themeType[] = Object.keys(
  themeTranslations
) as themeType[];
export const rooms: roomType[] = Object.keys(roomTranslations) as roomType[];

export const getIndonesianTheme = (englishTheme: themeType): string => {
  return themeTranslations[englishTheme] || "Modern";
};

export const getIndonesianRoom = (englishRoom: roomType): string => {
  return roomTranslations[englishRoom] || "Ruang Tamu";
};

export const getEnglishTheme = (indonesianTheme: string): themeType => {
  const entry = Object.entries(themeTranslations).find(
    ([_, indo]) => indo === indonesianTheme
  );
  return (entry?.[0] as themeType) || "Modern";
};

export const getEnglishRoom = (indonesianRoom: string): roomType => {
  const entry = Object.entries(roomTranslations).find(
    ([_, indo]) => indo === indonesianRoom
  );
  return (entry?.[0] as roomType) || "Living Room";
};
