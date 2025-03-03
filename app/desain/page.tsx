"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { UrlBuilder, UploadManager } from "@bytescale/sdk";
import { CompareSlider } from "../../components/CompareSlider";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LoadingDots from "../../components/LoadingDots";
import ResizablePanel from "../../components/ResizablePanel";
import Toggle from "../../components/Toggle";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import {
  roomType,
  rooms,
  themeType,
  themes,
  getIndonesianTheme,
  getIndonesianRoom,
  themeTranslations,
  roomTranslations,
} from "../../utils/dropdownTypes";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import imageCompression from "browser-image-compression";
import Link from "next/link";
import { fetchUserCredits, onCreditUpdate } from "../../utils/fetchUserCredits";
import { triggerCreditUpdate } from "../../utils/fetchUserCredits";

const uploadManager = new UploadManager({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});

// Add type for window.snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

// Create a wrapper component that uses searchParams
function DesainPageContent() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>(
    (searchParams?.get("theme")
      ? searchParams.get("theme")!
      : "Modern") as themeType
  );
  const [room, setRoom] = useState<roomType>(
    (searchParams?.get("room")
      ? searchParams.get("room")!
      : "Living_Room") as roomType
  );
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loadingCredits, setLoadingCredits] = useState<boolean>(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  // Modify the useEffect for credits
  useEffect(() => {
    const getCredits = async () => {
      try {
        setLoadingCredits(true);
        if (userId) {
          const userCredits = await fetchUserCredits(userId);
          setUserCredits(userCredits);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setLoadingCredits(false);
      }
    };

    // Initial fetch
    getCredits();

    // Register for credit updates
    const unsubscribe = onCreditUpdate((updatedUserId: string) => {
      if (updatedUserId === userId) {
        getCredits();
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [userId]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Compress image before upload
      const options = {
        maxSizeMB: 1, // Maksimal ukuran file setelah dikompresi (1MB)
        maxWidthOrHeight: 1024, // Tidak membatasi resolusi gambar
        useWebWorker: true, // Supaya kompresi lebih cepat
      };

      const compressedFile = await imageCompression(file, options);

      // Upload the compressed file to Bytescale
      const uploadedFile = await uploadManager.upload({ data: compressedFile });

      // Create the image URL using UrlBuilder
      const imageUrl = UrlBuilder.url({
        accountId: uploadedFile.accountId,
        filePath: uploadedFile.filePath,
      });

      // Set the states and generate photo
      setPhotoName(file.name);
      setOriginalPhoto(imageUrl);

      // Check if user has enough credits
      if (userCredits < 1) {
        setError(
          "Anda tidak memiliki kuota yang cukup. Silakan beli kuota terlebih dahulu."
        );
        setLoading(false);
        return;
      }

      generatePhoto(imageUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload image");
      setLoading(false);
    }
  };

  async function generatePhoto(fileUrl: string) {
    try {
      setLoading(true);
      setError(null);

      const generationResponse = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: fileUrl,
          theme,
          room,
          useCredits: true,
        }),
      });

      console.log(generationResponse);

      if (!generationResponse.ok) {
        const errorData = await generationResponse.json();
        if (errorData.error === "insufficient_credits") {
          setError(
            "Anda tidak memiliki kuota yang cukup. Silakan beli kuota terlebih dahulu."
          );
          return;
        }
        throw new Error("Failed to generate image");
      }

      const generatedImage = await generationResponse.json();
      console.log(generatedImage);
      setRestoredImage(generatedImage);

      triggerCreditUpdate(userId!);
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menghasilkan gambar");
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setRestoredImage(null);
    setRestoredLoaded(false);
    setError(null);
    setOriginalPhoto(null);
    setTheme("Modern" as themeType);
    setRoom("Living_Room" as roomType);

    // Clear URL params
    router.replace("/desain");
  };

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          Desain ruang <span className="text-blue-600">impian</span> anda
        </h1>

        {/* Credits display */}
        <div className="mb-8 text-center">
          {loadingCredits ? (
            <p className="text-gray-400">Memuat credits...</p>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xl">
                <span className="font-bold text-blue-500">{userCredits}</span>{" "}
                kuota tersisa
              </p>
              {userCredits < 1 && (
                <Link
                  href="/paket"
                  className="mt-2 text-blue-500 hover:text-blue-400 underline"
                >
                  Beli kuota sekarang
                </Link>
              )}
            </div>
          )}
        </div>

        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              {!restoredImage && (
                <>
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="flex mt-3 items-center space-x-3">
                      <Image
                        src="/number-1-white.svg"
                        width={30}
                        height={30}
                        alt="1 icon"
                      />
                      <p className="text-left font-medium">
                        Pilih tema ruangan Anda
                      </p>
                    </div>
                    <div className="relative z-[31]">
                      <DropDown
                        theme={theme}
                        setTheme={(newTheme) =>
                          setTheme(newTheme as typeof theme)
                        }
                        themes={themes as themeType[]}
                        translations={themeTranslations}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 w-full max-w-sm mt-8">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/number-2-white.svg"
                        width={30}
                        height={30}
                        alt="1 icon"
                      />
                      <p className="text-left font-medium">
                        Pilih tipe ruangan Anda
                      </p>
                    </div>
                    <div className="relative z-[30]">
                      <DropDown
                        theme={room}
                        setTheme={(newRoom) => setRoom(newRoom as typeof room)}
                        themes={rooms as roomType[]}
                        translations={roomTranslations}
                      />
                    </div>
                  </div>
                  <div className="mt-8 w-full max-w-sm">
                    <div className="flex items-center space-x-3 relative z-[29]">
                      <Image
                        src="/number-3-white.svg"
                        width={30}
                        height={30}
                        alt="1 icon"
                      />
                      <p className="text-left font-medium">
                        Unggah foto ruangan Anda
                      </p>
                    </div>
                  </div>
                </>
              )}
              {restoredImage && (
                <div>
                  Inilah ruangan <b>{getIndonesianRoom(room)}</b> yang telah
                  direnovasi dalam tema <b>{getIndonesianTheme(theme)}</b>
                </div>
              )}
              <div
                className={`${
                  restoredLoaded ? "visible mt-6 -ml-8" : "invisible"
                }`}
              >
                <Toggle
                  className={`${restoredLoaded ? "visible mb-6" : "invisible"}`}
                  sideBySide={sideBySide}
                  setSideBySide={(newVal) => setSideBySide(newVal)}
                />
              </div>
              {restoredLoaded && sideBySide && originalPhoto && (
                <CompareSlider
                  original={originalPhoto}
                  restored={restoredImage!}
                />
              )}
              {!originalPhoto && !loading && !restoredImage && (
                <div className="space-y-4">
                  {/* Desktop File Input */}
                  <div className="hidden sm:block">
                    <input
                      className="h-48"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={userCredits < 1}
                    />
                  </div>

                  {/* Mobile Controls */}
                  <div className="flex flex-col space-y-4 sm:hidden">
                    <button
                      onClick={() => {
                        if (userCredits < 1) return;
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.capture = "environment";
                        input.onchange = (e) => handleFileChange(e as any);
                        input.click();
                      }}
                      className={`rounded-xl font-medium px-4 py-3 transition ${
                        userCredits < 1
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-500"
                      }`}
                      disabled={userCredits < 1}
                    >
                      Ambil Foto
                    </button>

                    <button
                      onClick={() => {
                        if (userCredits < 1) return;
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => handleFileChange(e as any);
                        input.click();
                      }}
                      className={`rounded-xl font-medium px-4 py-3 transition ${
                        userCredits < 1
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-gray-600 text-white hover:bg-gray-500"
                      }`}
                      disabled={userCredits < 1}
                    >
                      Pilih dari Galeri
                    </button>
                  </div>

                  <p className="text-sm text-gray-400">
                    {userCredits < 1
                      ? "Anda membutuhkan minimal 1 credit untuk menghasilkan gambar"
                      : "Anda dapat mengambil foto baru atau memilih dari galeri"}
                  </p>

                  {userCredits < 1 && (
                    <Link
                      href="/paket"
                      className="block mt-4 bg-blue-600 rounded-xl text-white font-medium px-4 py-3 hover:bg-blue-500 transition"
                    >
                      Beli kuota sekarang
                    </Link>
                  )}
                </div>
              )}
              {originalPhoto && !restoredImage && !loading && (
                <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-2xl h-96"
                  width={475}
                  height={475}
                />
              )}
              {restoredImage && originalPhoto && !sideBySide && (
                <div className="flex sm:space-x-4 sm:flex-row flex-col">
                  <div>
                    <h2 className="mb-1 font-medium text-lg">Sebelum</h2>
                    <Image
                      alt="original photo"
                      src={originalPhoto}
                      className="rounded-2xl relative w-full h-96"
                      width={475}
                      height={475}
                    />
                  </div>
                  <div className="sm:mt-0 mt-8">
                    <h2 className="mb-1 font-medium text-lg">Sesudah</h2>
                    <a href={restoredImage} target="_blank" rel="noreferrer">
                      <Image
                        alt="restored photo"
                        src={restoredImage}
                        className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in w-full h-96"
                        width={475}
                        height={475}
                        onLoadingComplete={() => setRestoredLoaded(true)}
                      />
                    </a>
                  </div>
                </div>
              )}
              {loading && (
                <button
                  disabled
                  className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                >
                  <span className="pt-4">
                    <LoadingDots color="white" style="large" />
                  </span>
                </button>
              )}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                  {error.includes("credits") && (
                    <Link
                      href="/paket"
                      className="block mt-2 text-red-700 font-medium hover:underline"
                    >
                      Beli Kuota Sekarang
                    </Link>
                  )}
                </div>
              )}
              <div className="flex space-x-2 justify-center">
                {(restoredImage || error) && !loading && (
                  <button
                    onClick={() => {
                      if (error) {
                        window.location.reload();
                      } else {
                        handleReset();
                      }
                    }}
                    className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
                  >
                    {error ? "Coba lagi" : "Desain ruangan baru"}
                  </button>
                )}
                {restoredLoaded && (
                  <button
                    onClick={() => {
                      downloadPhoto(
                        restoredImage!,
                        appendNewToName(photoName!)
                      );
                    }}
                    className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                  >
                    Unduh hasil ruangan
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
}

// Create a loading component
function DesainPageLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingDots color="white" style="large" />
    </div>
  );
}

// Main component with Suspense
export default function DesainPage() {
  return (
    <Suspense fallback={<DesainPageLoading />}>
      <DesainPageContent />
    </Suspense>
  );
}
