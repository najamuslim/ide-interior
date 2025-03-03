"use client";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";
import { CompareSlider } from "../components/CompareSlider";

export default function HomePage() {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:px-8 mt-10 sm:mt-20 background-gradient">
        <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-normal text-gray-300">
          Desain Ruang Impian Anda dengan{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <SquigglyLines />
            <span className="relative">IDEInterior</span>
          </span>
        </h1>
        <h2 className="mx-auto mt-8 sm:mt-12 max-w-xl text-base sm:text-lg text-gray-500 leading-7">
          Unggah foto ruang Anda, dan lihat transformasinya dalam berbagai tema.
          Desain ulang ruangan Anda kini lebih mudah!
        </h2>
        <Link
          className="bg-blue-600 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-6 hover:bg-blue-500 transition text-sm sm:text-base"
          href="/desain"
        >
          Mulai Sekarang!
        </Link>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-8 sm:space-y-10 mt-4 mb-16 w-full px-4 sm:px-0">
            <CompareSlider
              original={"/empty_bedroom.jpg"}
              restored={"/bedroom_ide.png"}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
