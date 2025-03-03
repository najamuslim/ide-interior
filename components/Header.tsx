"use client";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchUserCredits, onCreditUpdate } from "../utils/fetchUserCredits";

export default function Header() {
  const { userId } = useAuth();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const getCredits = async () => {
      if (userId) {
        const userCredits = await fetchUserCredits(userId);
        setCredits(userCredits);
      }
    };

    // Initial fetch
    getCredits();

    // Register for credit updates
    const unsubscribe = onCreditUpdate((updatedUserId) => {
      if (updatedUserId === userId) {
        getCredits();
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [userId]);

  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/ideinteriorlogo.svg"
          className="sm:w-10 sm:h-10 w-8 h-8"
          width={24}
          height={24}
        />
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight text-white">
          IDEInterior
        </h1>
      </Link>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="px-2 sm:px-4 py-2 bg-blue-600 rounded-lg">
          <span className="text-white font-medium text-sm sm:text-base">
            Kuota: {credits}
          </span>
        </div>
        <Link
          href="/desain"
          className="hidden sm:block text-white hover:text-blue-400 hover:bg-[#1F2937] px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base"
        >
          Desain
        </Link>
        <Link
          href="/paket"
          className="hidden sm:block text-white hover:text-blue-400 hover:bg-[#1F2937] px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base"
        >
          Paket
        </Link>
        <Link
          href="https://blog.ideinteriorai.com"
          className="hidden sm:block text-white hover:text-blue-400 hover:bg-[#1F2937] px-4 py-2 rounded-lg transition-all duration-200 font-medium"
        >
          Blog
        </Link>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonBox: "hover:bg-[#1F2937]",
                userButtonTrigger: "text-white",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-white hover:text-gray-300 text-sm sm:text-base">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
