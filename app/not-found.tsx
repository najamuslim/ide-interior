import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Link
          href="/"
          className="bg-blue-600 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-blue-500 transition"
        >
          Kembali ke Beranda
        </Link>
      </main>
      <Footer />
    </div>
  );
}
