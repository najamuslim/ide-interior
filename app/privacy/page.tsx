import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          Kebijakan Privasi
        </h1>
        <div className="max-w-xl mx-auto text-left text-slate-200 space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p>
              Kami mengumpulkan informasi berikut saat Anda menggunakan layanan
              kami:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Gambar yang Anda unggah untuk transformasi</li>
              <li>Informasi pembayaran (diproses melalui Midtrans)</li>
              <li>Email dan nama (jika Anda masuk menggunakan akun)</li>
              <li>Data penggunaan dan preferensi tema/ruangan</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">2. Penggunaan Informasi</h2>
            <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Memproses dan menghasilkan desain ruangan Anda</li>
              <li>Memproses pembayaran melalui Midtrans</li>
              <li>Meningkatkan layanan dan pengalaman pengguna</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">3. Keamanan</h2>
            <p>
              Kami menggunakan langkah-langkah keamanan yang sesuai untuk
              melindungi informasi Anda dari akses yang tidak sah dan kebocoran
              data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">4. Hak Pengguna</h2>
            <p>Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Mengakses data pribadi Anda yang kami simpan</li>
              <li>Meminta penghapusan data Anda</li>
              <li>Menarik persetujuan penggunaan data Anda</li>
              <li>Mengajukan keluhan tentang penggunaan data Anda</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">5. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi kami atau
              penggunaan data Anda, silakan hubungi kami melalui email di:{" "}
              <a
                href="mailto:privacy@roomgpt.com"
                className="text-blue-500 hover:text-blue-600"
              >
                ideinteriorai@gmail.com
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">6. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu.
              Perubahan akan diumumkan di halaman ini dengan tanggal efektif
              yang diperbarui.
            </p>
            <p className="text-sm text-slate-400">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
