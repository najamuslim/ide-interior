"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef, Suspense } from "react";
import { UrlBuilder, UploadManager } from "@bytescale/sdk";
import { UploadWidgetConfig } from "@bytescale/upload-widget";
import { UploadDropzone } from "@bytescale/upload-widget-react";
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
  getEnglishTheme,
  getEnglishRoom,
  getIndonesianTheme,
  getIndonesianRoom,
  themeTranslations,
  roomTranslations,
} from "../../utils/dropdownTypes";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

const options: UploadWidgetConfig = {
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#2563EB",
      error: "#d23f4d",
      shade100: "#fff",
      shade200: "#fffe",
      shade300: "#fffd",
      shade400: "#fffc",
      shade500: "#fff9",
      shade600: "#fff7",
      shade700: "#fff2",
      shade800: "#fff1",
      shade900: "#ffff",
    },
  },
  locale: {
    customValidationFailed: "Gagal memvalidasi file.",
    orDragDropFile: "...atau drag dan drop file.",
    orDragDropImage: "...atau drag dan drop gambar.",
    processingFile: "Mengolah file...",
    addAnotherFile: "Tambahkan file lain.",
    addAnotherImage: "Tambahkan gambar lain.",
    cancel: "Batal",
    cancelInPreviewWindow: "Batal dalam jendela pratinjau",
    unsupportedFileType: "Tipe file tidak didukung.",
    uploadImage: "Unggah Gambar",
    "cancelled!": "dibatalkan",
    "error!": "kesalahan",
    "removed!": "dihapus",
    continue: "lanjutkan",
    crop: "potong",
    done: "selesai",
    finish: "selesai",
    finishIcon: true,
    image: "gambar",
    maxFilesReached: "jumlah file maksimum telah tercapai",
    maxImagesReached: "jumlah gambar maksimum telah tercapai",
    maxSize: "ukuran maksimum",
    next: "berikutnya",
    of: "dari",
    orDragDropFiles: "...atau drag dan drop file",
    orDragDropImages: "...atau drag dan drop gambar",
    pleaseWait: "tolong tunggu",
    remove: "hapus",
    skip: "lewati",
    uploadFile: "unggah file",
    uploadFiles: "unggah file",
    uploadImages: "unggah gambar",
  },
};

const uploadManager = new UploadManager({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free"
});

// Create a wrapper component that uses searchParams
function DreamPageContent() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>(
    (searchParams?.get("theme") as themeType) || "Modern"
  );
  const [room, setRoom] = useState<roomType>(
    (searchParams?.get("room") as roomType) || "Living Room"
  );
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const processedInvoiceRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/sign-in');
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const checkInvoice = async () => {
      const status = searchParams.get("status");
      const invoiceId = searchParams.get("invoice");

      if (
        !invoiceId ||
        status !== "success" ||
        processedInvoiceRef.current === invoiceId
      ) {
        return;
      }

      processedInvoiceRef.current = invoiceId;
      let isSubscribed = true;

      try {
        setLoading(true);
        setError(null);

        // Get invoice data first
        const response = await fetch(`/check-invoice?id=${invoiceId}`);
        const data = await response.json();

        if (!isSubscribed) return;

        if (response.ok && data.status === "PAID" && data.metadata) {
          // Set states from metadata immediately
          setTheme(data.metadata.theme as themeType);
          setRoom(data.metadata.room as roomType);
          setOriginalPhoto(data.metadata.originalPhoto);

          // Generate image
          const generationResponse = await fetch("/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageUrl: data.metadata.originalPhoto,
              theme: data.metadata.theme,
              room: data.metadata.room,
              invoiceId,
            }),
          });

          if (!isSubscribed) return;

          const generatedImage = await generationResponse.json();
          if (generationResponse.ok) {
            setRestoredImage(generatedImage[1]);
          } else {
            setError(generatedImage.error || "Gagal generate gambar");
          }
        } else {
          setError(data.error || "Pembayaran belum selesai");
        }
      } catch (error) {
        console.error("Error:", error);
        if (isSubscribed) {
          setError("Gagal memuat data pembayaran");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }

      return () => {
        isSubscribed = false;
      };
    };

    checkInvoice();
  }, [searchParams]);

  const UploadDropZone = () => (
    <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: "preset",
              transformationPreset: "thumbnail",
            },
          });
          setPhotoName(imageName);
          setOriginalPhoto(imageUrl);
          generatePhoto(imageUrl);
        }
      }}
      width="400px"
      height="250px"
    />
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload the file to Bytescale
      const uploadedFile = await uploadManager.upload({data: file});

      // Create the image URL using UrlBuilder
      const imageUrl = UrlBuilder.url({
        accountId: uploadedFile.accountId,
        filePath: uploadedFile.filePath,
        options: {
          transformation: "preset",
          transformationPreset: "thumbnail-square",
        },
      });

      // Set the states and generate photo
      setPhotoName(file.name);
      setOriginalPhoto(imageUrl);
      generatePhoto(imageUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload image");
    }
  };

  async function generatePhoto(fileUrl: string) {
    try {
      setLoading(true);
      setError(null);

      const paymentResponse = await fetch("/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPhoto: fileUrl,
          theme: theme,
          room: room,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to create invoice");
      }

      const paymentJson = await paymentResponse.json();
      if (!paymentJson.invoiceUrl) {
        setError("Failed to create invoice");
        return;
      }

      // Redirect to payment
      window.location.href = paymentJson.invoiceUrl;
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan");
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
    setRoom("Living Room" as roomType);

    // Clear URL params
    router.replace("/dream");
  };

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          Desain ruang <span className="text-blue-600">impian</span> anda
        </h1>
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
                        setTheme={(newTheme) => setTheme(newTheme as typeof theme)}
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
                <input
                  className="h-48"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
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
                </div>
              )}
              <div className="flex space-x-2 justify-center">
                {(restoredImage || error) && !loading && (
                  <button
                    onClick={handleReset}
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
function DreamPageLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingDots color="white" style="large" />
    </div>
  );
}

// Main component with Suspense
export default function DreamPage() {
  return (
    <Suspense fallback={<DreamPageLoading />}>
      <DreamPageContent />
    </Suspense>
  );
}
