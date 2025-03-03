import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3 border-gray-500">
      <div className="flex space-x-4 text-gray-500 text-sm">
        <Link href="/privacy" className="hover:text-gray-300 transition">
          Kebijakan Privasi
        </Link>
        <a
          href="mailto:ideinteriorai@gmail.com"
          className="hover:text-gray-300 transition"
        >
          Bantuan
        </a>
      </div>
    </footer>
  );
}
