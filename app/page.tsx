"use client";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";
import { CompareSlider } from "../components/CompareSlider";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:px-8 mt-10 sm:mt-20 background-gradient">
        {/* Hero Section with CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-normal text-gray-300">
            Transformasi Ruangan Anda dengan{" "}
            <span className="relative whitespace-nowrap text-blue-600">
              <SquigglyLines />
              <span className="relative">IDEInterior</span>
            </span>
          </h1>
          <h2 className="mx-auto mt-8 sm:mt-12 max-w-xl text-lg sm:text-xl text-gray-500 leading-7">
            Ubah ruangan biasa menjadi luar biasa dalam hitungan detik dengan
            AI. Desain interior profesional tanpa biaya mahal.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
            <Link
              className="bg-blue-600 rounded-xl text-white font-medium px-8 py-3 hover:bg-blue-500 transition text-lg w-full sm:w-auto"
              href="/desain"
            >
              Mulai Desain Gratis
            </Link>
            <Link
              className="border border-gray-600 rounded-xl text-gray-300 font-medium px-8 py-3 hover:bg-gray-800 transition text-lg w-full sm:w-auto"
              href="/paket"
            >
              Lihat Paket
            </Link>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full mt-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-12">
            Hasil Transformasi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Living Room */}
            <div className="space-y-4">
              <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/after_ruangtamu.png"
                  alt="Transformed Living Room"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Bedroom */}
            <div className="space-y-4">
              <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/after_kamar.png"
                  alt="Transformed Bedroom"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Kitchen */}
            <div className="space-y-4">
              <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/after_dapur.png"
                  alt="Transformed Kitchen"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full mt-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-12">
            Lihat Perbandingan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Living Room Comparison */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <CompareSlider
                  original={"/before_ruangtamu.jpeg"}
                  restored={"/after_ruangtamu.png"}
                  portrait={true}
                />
              </div>
            </div>

            {/* Bedroom Comparison */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <CompareSlider
                  original={"/before_kamar.jpeg"}
                  restored={"/after_kamar.png"}
                  portrait={true}
                />
              </div>
            </div>

            {/* Kitchen Comparison */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <CompareSlider
                  original={"/before_dapur.jpeg"}
                  restored={"/after_dapur.png"}
                  portrait={true}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full mt-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-12">
            Mengapa Memilih IDEInterior?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Cepat & Mudah
              </h3>
              <p className="text-gray-500">
                Dapatkan desain dalam hitungan detik. Cukup unggah foto ruangan
                Anda.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Berbagai Tema
              </h3>
              <p className="text-gray-500">
                Pilih dari puluhan tema desain interior yang terus diperbarui.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Hemat Biaya
              </h3>
              <p className="text-gray-500">
                Lebih terjangkau dibanding jasa desainer interior tradisional.
              </p>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-full mt-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-12">
            Cara Kerja
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4">
                <Image
                  src="/number-1-white.svg"
                  alt="Step 1"
                  width={40}
                  height={40}
                />
              </div>
              <div className="p-6 rounded-xl bg-gray-800/30 h-full">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Unggah Foto
                </h3>
                <p className="text-gray-500">
                  Ambil foto ruangan Anda dari sudut manapun
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4">
                <Image
                  src="/number-2-white.svg"
                  alt="Step 2"
                  width={40}
                  height={40}
                />
              </div>
              <div className="p-6 rounded-xl bg-gray-800/30 h-full">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Pilih Tema
                </h3>
                <p className="text-gray-500">
                  Tentukan tema desain yang Anda inginkan
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4">
                <Image
                  src="/number-3-white.svg"
                  alt="Step 3"
                  width={40}
                  height={40}
                />
              </div>
              <div className="p-6 rounded-xl bg-gray-800/30 h-full">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Lihat Hasilnya
                </h3>
                <p className="text-gray-500">
                  Dapatkan desain baru dalam hitungan detik
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="w-full mt-20 mb-20"
        >
          <div className="p-8 sm:p-12 rounded-2xl bg-blue-600/20 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-4">
              Siap Mengubah Ruangan Anda?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Mulai transformasi ruangan Anda hari ini. Coba gratis dan lihat
              bagaimana AI kami dapat mengubah ruangan Anda menjadi ruang
              impian.
            </p>
            <Link
              className="bg-blue-600 rounded-xl text-white font-medium px-8 py-3 hover:bg-blue-500 transition text-lg inline-block"
              href="/desain"
            >
              Mulai Desain Sekarang
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
