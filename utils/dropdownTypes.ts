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
  | "Art_Deco";

export type roomType =
  | "Living_Room"
  | "Dining_Room"
  | "Bedroom"
  | "Bathroom"
  | "Office"
  | "Gaming_Room"
  | "Kitchen"
  | "Family_Room"
  | "Terrace"
  | "Study_Room"
  | "Prayer_Room"
  | "Laundry_Room"
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
  Art_Deco: "Art Deco",
};

export const roomTranslations: Record<roomType, string> = {
  Living_Room: "Ruang Tamu",
  Family_Room: "Ruang Keluarga",
  Dining_Room: "Ruang Makan",
  Kitchen: "Dapur",
  Bedroom: "Kamar Tidur",
  Bathroom: "Kamar Mandi",
  Study_Room: "Ruang Belajar",
  Office: "Kantor",
  Prayer_Room: "Musholla",
  Terrace: "Teras",
  Gaming_Room: "Ruang Gaming",
  Laundry_Room: "Ruang Laundry",
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
  return (entry?.[0] as roomType) || "Living_Room";
};
