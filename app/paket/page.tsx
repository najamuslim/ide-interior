"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SquigglyLines from "../../components/SquigglyLines";
import LoadingDots from "../../components/LoadingDots";
import { useAuth } from "@clerk/nextjs";

// Add type for window.snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

const PaketPage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      name: "Starter",
      price: "Rp 49.000",
      credits: "30",
      features: [
        "30 kuota untuk desain interior",
        "Semua tipe ruangan",
        "Semua gaya desain",
      ],
      id: "starter",
    },
    {
      name: "Pro",
      price: "Rp 149.000",
      credits: "100",
      features: [
        "100 kuota untuk desain interior",
        "Semua tipe ruangan",
        "Semua gaya desain",
      ],
      popular: true,
      id: "pro",
    },
    {
      name: "Premium",
      price: "Rp 249.000",
      credits: "250",
      features: [
        "250 kuota untuk desain interior",
        "Semua tipe ruangan",
        "Semua gaya desain",
      ],
      id: "premium",
    },
  ];

  const handlePurchase = async (planId: string) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    try {
      setLoading(planId);
      setError(null);

      const response = await fetch("/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const { token } = await response.json();

      // Open Snap popup
      window.snap.pay(token, {
        onSuccess: async function (result: any) {
          // Show success message and redirect to desain page
          router.push("/desain");
        },
        onPending: function (result: any) {
          setError("Pembayaran dalam proses");
          setLoading(null);
        },
        onError: function (result: any) {
          console.error("Payment error:", result);
          setError("Pembayaran gagal");
          setLoading(null);
        },
        onClose: function () {
          setLoading(null);
        },
      });
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat memproses pembayaran");
      setLoading(null);
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 background-gradient">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
          Pilih Paket{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <SquigglyLines />
            <span className="relative">IDEInterior</span>
          </span>
        </h1>
        <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400 text-gray-500 leading-7">
          Transformasikan ruangan Anda dengan paket yang sesuai kebutuhan.
          Semakin banyak kuota, semakin hemat!
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8 max-w-md"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl px-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-2xl ${
                plan.popular
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-gray-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0">
                  <div className="mx-auto w-fit px-4 py-1 rounded-full bg-white text-blue-600 text-sm font-medium">
                    Paling Populer
                  </div>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-3xl font-bold tracking-tight">
                  {plan.name}
                </h3>
                <div className="mt-4 flex flex-col items-center">
                  <span
                    className={`text-4xl font-bold ${
                      plan.popular ? "text-white" : "text-blue-400"
                    }`}
                  >
                    {plan.credits}
                  </span>
                  <span
                    className={`text-lg mt-1 ${
                      plan.popular ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    kuota desain interior
                  </span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center justify-center gap-2"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transform transition duration-200 hover:scale-105 ${
                    plan.popular
                      ? "bg-white text-blue-600 hover:bg-gray-100"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {loading === plan.id ? (
                    <span className="flex justify-center">
                      <LoadingDots
                        color={plan.popular ? "blue" : "white"}
                        style="small"
                      />
                    </span>
                  ) : (
                    "Beli sekarang"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaketPage;
