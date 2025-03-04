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
import {
  roomType,
  themeType,
  getIndonesianTheme,
  getIndonesianRoom,
  themeTranslations,
  themesList,
  roomsList,
} from "../../utils/dropdownTypes";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import imageCompression from "browser-image-compression";
import Link from "next/link";
import { useCredits } from "../../contexts/CreditsContext";

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
  const { credits, loading: loadingCredits, refreshCredits } = useCredits();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      // Show compression message
      setPhotoName("Mengompres foto...");

      // Compress image before upload
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // Show upload message
      setPhotoName("Mengunggah foto...");

      // Upload the compressed file to Bytescale
      const uploadedFile = await uploadManager.upload({ data: compressedFile });

      // Create the image URL using UrlBuilder
      const imageUrl = UrlBuilder.url({
        accountId: uploadedFile.accountId,
        filePath: uploadedFile.filePath,
      });

      // Set the states but don't generate photo
      setPhotoName(file.name);
      setOriginalPhoto(imageUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Gagal mengunggah foto");
    } finally {
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
      setRestoredImage(generatedImage);
      refreshCredits();
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

  const ThemeCard = ({
    theme,
    isSelected,
    onClick,
  }: {
    theme: (typeof themesList)[0];
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 ${
        isSelected
          ? "ring-4 ring-blue-500 scale-[1.02]"
          : "hover:scale-[1.01] hover:ring-2 hover:ring-blue-400"
      }`}
    >
      <div className="relative h-48">
        <Image
          src={theme.preview}
          alt={theme.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 bg-gray-900 bg-opacity-70">
        <h3 className="text-lg font-semibold text-gray-200">
          {themeTranslations[theme.id]}
        </h3>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          Desain Ruangan hanya dalam hitungan{" "}
          <span className="text-blue-600">detik</span>
        </h1>
        <p className="mx-auto max-w-xl text-gray-300 text-lg mb-10">
          Transformasi ruangan Anda menjadi lebih indah dengan bantuan AI. Cukup
          unggah foto, pilih gaya, dan lihat hasilnya dalam hitungan detik.
        </p>

        {/* Credits display */}
        <div className="mb-8 text-center bg-gray-800 px-6 py-4 rounded-xl border border-gray-700">
          {loadingCredits ? (
            <p className="text-gray-400">Memuat credits...</p>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-medium text-gray-200 mb-2">
                Saldo Kuota Anda
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-500">
                  {credits}
                </span>
                <span className="text-gray-400">desain tersisa</span>
              </div>
              {credits < 1 && (
                <Link
                  href="/paket"
                  className="mt-4 text-blue-500 hover:text-blue-400 underline"
                >
                  Beli kuota untuk mulai mendesain
                </Link>
              )}
            </div>
          )}
        </div>

        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              <div className="space-y-16 w-full max-w-4xl">
                {/* Step 1: Upload */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                      1
                    </div>
                    <h2 className="text-left text-xl font-medium text-gray-200">
                      Unggah Foto Ruangan Anda
                    </h2>
                  </div>
                  <p className="text-gray-400 text-left">
                    Ambil foto ruangan dari sudut terbaik untuk hasil yang
                    maksimal
                  </p>

                  {!originalPhoto && (
                    <div className="bg-gray-800 p-8 rounded-xl border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors duration-300">
                      <div className="space-y-4">
                        {/* Desktop File Input */}
                        <div className="hidden sm:block text-center">
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={credits < 1 || loading}
                          />
                          <label
                            htmlFor="file-upload"
                            className={`cursor-pointer flex flex-col items-center justify-center ${
                              credits < 1 || loading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {loading ? (
                              <>
                                <LoadingDots color="white" style="large" />
                                <span className="text-gray-300 text-lg mt-4">
                                  {photoName || "Memproses..."}
                                </span>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-12 w-12 text-gray-400 mb-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-gray-300 text-lg mb-2">
                                  Tarik & letakkan foto di sini
                                </span>
                                <span className="text-gray-400">
                                  atau klik untuk memilih foto
                                </span>
                              </>
                            )}
                          </label>
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex flex-col space-y-4 sm:hidden">
                          <button
                            onClick={() => {
                              if (credits < 1 || loading) return;
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.capture = "environment";
                              input.style.display = "none";
                              document.body.appendChild(input);

                              input.onchange = async (e) => {
                                try {
                                  await handleFileChange(e as any);
                                } catch (error: any) {
                                  setError(
                                    `Error: ${error.message || "Unknown error"}`
                                  );
                                } finally {
                                  document.body.removeChild(input);
                                }
                              };

                              input.click();
                            }}
                            className={`rounded-xl font-medium px-6 py-4 transition flex items-center justify-center space-x-2 ${
                              credits < 1 || loading
                                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-500"
                            }`}
                            disabled={credits < 1 || loading}
                          >
                            {loading ? (
                              <LoadingDots color="white" style="large" />
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>Ambil Foto</span>
                              </>
                            )}
                          </button>

                          {!loading && (
                            <button
                              onClick={() => {
                                if (credits < 1 || loading) return;
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.style.display = "none";
                                document.body.appendChild(input);

                                input.onchange = async (e) => {
                                  try {
                                    await handleFileChange(e as any);
                                  } catch (error: any) {
                                    setError(
                                      `Error: ${
                                        error.message || "Unknown error"
                                      }`
                                    );
                                  } finally {
                                    document.body.removeChild(input);
                                  }
                                };

                                input.click();
                              }}
                              className={`rounded-xl font-medium px-6 py-4 transition flex items-center justify-center space-x-2 ${
                                credits < 1
                                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                                  : "bg-gray-700 text-white hover:bg-gray-600"
                              }`}
                              disabled={credits < 1}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>Pilih dari Galeri</span>
                            </button>
                          )}
                        </div>

                        <p className="text-sm text-gray-400 text-center">
                          {credits < 1
                            ? "Anda membutuhkan minimal 1 credit untuk menghasilkan gambar"
                            : "Format yang didukung: JPG, PNG (Maks. 10MB)"}
                        </p>

                        {credits < 1 && (
                          <Link
                            href="/paket"
                            className="block mt-4 bg-blue-600 rounded-xl text-white font-medium px-6 py-4 hover:bg-blue-500 transition text-center"
                          >
                            Beli kuota sekarang
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {originalPhoto && (
                    <div className="mt-4 relative w-full max-w-3xl mx-auto">
                      <div className="aspect-[4/3] relative w-full">
                        <Image
                          alt="original photo"
                          src={originalPhoto}
                          className="rounded-2xl"
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Room Type */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                      2
                    </div>
                    <h2 className="text-left text-xl font-medium text-gray-200">
                      Pilih Tipe Ruangan
                    </h2>
                  </div>
                  <p className="text-gray-400 text-left">
                    Tentukan jenis ruangan untuk hasil yang lebih akurat dan
                    sesuai fungsi
                  </p>

                  <div className="relative w-full">
                    <select
                      value={room}
                      onChange={(e) => setRoom(e.target.value as roomType)}
                      className="w-full px-12 py-4 rounded-xl bg-gray-800 text-gray-100 appearance-none cursor-pointer border-2 border-gray-700 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-colors text-base"
                    >
                      {roomsList.map((roomItem) => (
                        <option key={roomItem.id} value={roomItem.id}>
                          {roomItem.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
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
                    </div>
                  </div>
                </div>

                {/* Step 3: Theme */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                      3
                    </div>
                    <h2 className="text-left text-xl font-medium text-gray-200">
                      Pilih Gaya Desain
                    </h2>
                  </div>
                  <p className="text-gray-400 text-left">
                    Eksplorasi berbagai gaya desain untuk menemukan yang sesuai
                    dengan selera Anda
                  </p>

                  {/* Mobile Theme Scroll View */}
                  <div className="grid grid-cols-2 sm:hidden gap-4 px-4">
                    {themesList.map((themeItem) => (
                      <ThemeCard
                        key={themeItem.id}
                        theme={themeItem}
                        isSelected={theme === themeItem.id}
                        onClick={() => setTheme(themeItem.id)}
                      />
                    ))}
                  </div>
                  {/* Desktop Grid View */}
                  <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {themesList.map((themeItem) => (
                      <ThemeCard
                        key={themeItem.id}
                        theme={themeItem}
                        isSelected={theme === themeItem.id}
                        onClick={() => setTheme(themeItem.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <button
                    onClick={() =>
                      originalPhoto && generatePhoto(originalPhoto)
                    }
                    disabled={!originalPhoto || loading || credits < 1}
                    className={`px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
                      !originalPhoto || loading || credits < 1
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-500"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <LoadingDots color="white" style="large" />
                      </span>
                    ) : (
                      "Transformasi Ruangan"
                    )}
                  </button>
                  {!originalPhoto && (
                    <p className="mt-2 text-sm text-gray-400">
                      Unggah foto untuk memulai transformasi
                    </p>
                  )}
                </div>
              </div>

              {/* Rest of the code for results display */}
              {restoredImage && (
                <div className="m-6">
                  Inilah ruangan <b>{getIndonesianRoom(room)}</b> yang telah
                  direnovasi dalam tema <b>{getIndonesianTheme(theme)}</b>
                </div>
              )}
              {restoredImage && originalPhoto && !sideBySide && (
                <div className="flex sm:space-x-8 sm:flex-row flex-col max-w-6xl w-full">
                  <div className="flex-1">
                    <h2 className="mb-1 font-medium text-lg">Sebelum</h2>
                    <div className="aspect-[4/3] relative w-full">
                      <Image
                        alt="original photo"
                        src={originalPhoto}
                        className="rounded-2xl"
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="(max-width: 768px) 100vw, 800px"
                        priority
                      />
                    </div>
                  </div>
                  <div className="flex-1 sm:mt-0 mt-8">
                    <h2 className="mb-1 font-medium text-lg">Sesudah</h2>
                    <a href={restoredImage} target="_blank" rel="noreferrer">
                      <div className="aspect-[4/3] relative w-full">
                        <Image
                          alt="restored photo"
                          src={restoredImage}
                          className="rounded-2xl cursor-zoom-in"
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority
                          onLoadingComplete={() => setRestoredLoaded(true)}
                        />
                      </div>
                    </a>
                  </div>
                </div>
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
