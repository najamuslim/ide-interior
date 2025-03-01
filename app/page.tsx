import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";

export default function HomePage() {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 background-gradient">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
          Desain Ruang Impian Anda dengan{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <SquigglyLines />
            <span className="relative">IDEInterior</span>
          </span>
        </h1>
        <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7">
          Unggah foto ruang Anda, dan lihat transformasinya dalam berbagai tema.
          Desain ulang ruangan Anda kini lebih mudah!
        </h2>
        <Link
          className="bg-blue-600 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-blue-500 transition"
          href="/dream"
        >
          Mulai Sekarang!
        </Link>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            {/* Pasangan Foto 1 */}
            <div className="flex sm:space-x-8 sm:flex-row flex-col">
              <div className="sm:w-1/2">
                <h3 className="mb-1 font-medium text-lg">Sebelum</h3>
                <Image
                  alt="Original photo of a room 1"
                  src="/empty_bedroom.jpg"
                  className="w-full object-cover h-64 rounded-2xl"
                  width={300}
                  height={300}
                />
              </div>
              <div className="sm:w-1/2 sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">
                  Sesudah - Minimalis
                </h3>
                <Image
                  alt="Generated photo of a room 1"
                  width={300}
                  height={300}
                  src="/bedroom_ide.png"
                  className="w-full object-cover h-64 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>

            {/* Pasangan Foto 2 */}
            <div className="flex sm:space-x-8 sm:flex-row flex-col">
              <div className="sm:w-1/2">
                <h3 className="mb-1 font-medium text-lg">Sebelum</h3>
                <Image
                  alt="Original photo of a room 2"
                  src="/ruang-kosong.jpg"
                  className="w-full object-cover h-64 rounded-2xl"
                  width={300}
                  height={300}
                />
              </div>
              <div className="sm:w-1/2 sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">
                  Sesudah - Scandinavian
                </h3>
                <Image
                  alt="Generated photo of a room 2"
                  width={300}
                  height={300}
                  src="/ruang-belajar-skandanavia.jpg"
                  className="w-full object-cover h-64 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>

            {/* Pasangan Foto 3 */}
            <div className="flex sm:space-x-8 sm:flex-row flex-col">
              <div className="sm:w-1/2">
                <h3 className="mb-1 font-medium text-lg">Sebelum</h3>
                <Image
                  alt="Original photo of a room 3"
                  src="/ruang-keluarga.jpg"
                  className="w-full object-cover h-64 rounded-2xl"
                  width={300}
                  height={300}
                />
              </div>
              <div className="sm:w-1/2 sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">
                  Sesudah - Industrial
                </h3>
                <Image
                  alt="Generated photo of a room 3"
                  width={300}
                  height={300}
                  src="/ruang-keluarga-industrial.png"
                  className="w-full object-cover h-64 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
