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

export const themesList = [
  {
    id: "Modern" as themeType,
    name: "Modern",
    description: "Desain minimalis dengan sentuhan kontemporer",
    preview: "/themes/modern.png",
  },
  {
    id: "Minimalist" as themeType,
    name: "Minimalis",
    description: "Simpel, bersih, dan fungsional",
    preview: "/themes/minimalist.png",
  },
  {
    id: "Professional" as themeType,
    name: "Profesional",
    description: "Elegan dan formal untuk ruang kerja",
    preview: "/themes/profesional.png",
  },
  {
    id: "Tropical" as themeType,
    name: "Tropis",
    description: "Nuansa alam dengan sentuhan tropis",
    preview: "/themes/tropis.png",
  },
  {
    id: "Industrial" as themeType,
    name: "Industrial",
    description: "Gaya urban dengan sentuhan industrial",
    preview: "/themes/industrial.png",
  },
  {
    id: "Scandinavian" as themeType,
    name: "Skandinavia",
    description: "Desain cerah dengan unsur kayu natural",
    preview: "/themes/skandinavian.png",
  },
  {
    id: "Classic" as themeType,
    name: "Klasik",
    description: "Mewah dengan detail klasik",
    preview: "/themes/klasik.png",
  },
  {
    id: "Contemporary" as themeType,
    name: "Kontemporer",
    description: "Modern dengan sentuhan artistik",
    preview: "/themes/kontemporer.png",
  },
  {
    id: "Japandi" as themeType,
    name: "Japandi",
    description: "Perpaduan gaya Jepang dan Skandinavia",
    preview: "/themes/japandi.png",
  },
  {
    id: "Bohemian" as themeType,
    name: "Bohemian",
    description: "Artistik dengan warna-warna cerah",
    preview: "/themes/bohemian.png",
  },
  {
    id: "Rustic" as themeType,
    name: "Rustic",
    description: "Hangat dengan unsur alami",
    preview: "/themes/rustic.png",
  },
  {
    id: "Art_Deco" as themeType,
    name: "Art Deco",
    description: "Glamor dengan detail geometris",
    preview: "/themes/artdeco.png",
  },
];

export const roomsList = [
  {
    id: "Living_Room" as roomType,
    name: "Ruang Tamu",
    description: "Ruang untuk menerima tamu dan bersantai bersama keluarga",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 12V8a2 2 0 00-2-2h-4V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2H4a2 2 0 00-2 2v4m18 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m18 0H2"
        />
      </svg>
    ),
  },
  {
    id: "Family_Room" as roomType,
    name: "Ruang Keluarga",
    description: "Ruang nyaman untuk berkumpul dan bersantai dengan keluarga",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: "Dining_Room" as roomType,
    name: "Ruang Makan",
    description: "Ruang untuk menikmati hidangan bersama keluarga",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "Kitchen" as roomType,
    name: "Dapur",
    description: "Ruang untuk memasak dan menyiapkan makanan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    id: "Bedroom" as roomType,
    name: "Kamar Tidur",
    description: "Ruang pribadi untuk beristirahat dengan nyaman",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: "Bathroom" as roomType,
    name: "Kamar Mandi",
    description: "Ruang untuk membersihkan diri dan relaksasi",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"
        />
      </svg>
    ),
  },
  {
    id: "Study_Room" as roomType,
    name: "Ruang Belajar",
    description: "Ruang khusus untuk belajar dan berkonsentrasi",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: "Office" as roomType,
    name: "Kantor",
    description: "Ruang kerja profesional di rumah",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "Prayer_Room" as roomType,
    name: "Musholla",
    description: "Ruang khusus untuk beribadah dengan tenang",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    id: "Gaming_Room" as roomType,
    name: "Ruang Gaming",
    description: "Ruang khusus untuk bermain game dan hiburan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>
    ),
  },
  {
    id: "Terrace" as roomType,
    name: "Teras",
    description: "Ruang terbuka untuk bersantai dan menikmati udara segar",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: "Laundry_Room" as roomType,
    name: "Ruang Laundry",
    description: "Ruang khusus untuk mencuci dan menata pakaian",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    id: "Library" as roomType,
    name: "Perpustakaan",
    description: "Ruang untuk membaca dan menyimpan koleksi buku",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: "Balcony" as roomType,
    name: "Balkon",
    description: "Ruang terbuka untuk menikmati pemandangan dan udara segar",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
];
