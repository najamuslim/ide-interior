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
        <SignedIn>
          <div className="px-2 sm:px-4 py-2 bg-blue-600 rounded-lg">
            <span className="text-white font-medium text-sm sm:text-base">
              Kuota: {credits}
            </span>
          </div>
        </SignedIn>
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
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="Desain"
                labelIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
                    />
                  </svg>
                }
                href="/desain"
              />
              <UserButton.Link
                label="Paket"
                labelIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                href="/paket"
              />
              <UserButton.Link
                label="Blog"
                labelIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                }
                href="https://blog.ideinteriorai.com"
              />
            </UserButton.MenuItems>
          </UserButton>
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
