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

const PricingPage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      name: "Starter",
      price: "Rp 25.000",
      credits: "5",
      features: [
        "5 Interior Design Credits",
        "All Room Types",
        "All Design Styles",
        "High-Quality Results",
        "24/7 Support",
      ],
      id: "starter",
    },
    {
      name: "Pro",
      price: "Rp 45.000",
      credits: "10",
      features: [
        "10 Interior Design Credits",
        "All Room Types",
        "All Design Styles",
        "High-Quality Results",
        "24/7 Support",
        "Priority Processing",
      ],
      popular: true,
      id: "pro",
    },
    {
      name: "Premium",
      price: "Rp 100.000",
      credits: "25",
      features: [
        "25 Interior Design Credits",
        "All Room Types",
        "All Design Styles",
        "High-Quality Results",
        "24/7 Support",
        "Priority Processing",
        "Bulk Generation",
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
          console.log("Payment success:", result);
          // Show success message and redirect to dream page
          router.push("/dream");
        },
        onPending: function (result: any) {
          console.log("Payment pending:", result);
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
            <span className="relative">Credits</span>
          </span>
        </h1>
        <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400 text-gray-500 leading-7">
          Transformasikan ruangan Anda dengan paket yang sesuai kebutuhan.
          Semakin banyak credits, semakin hemat!
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
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
                <p
                  className={`mt-2 ${
                    plan.popular ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {plan.credits} credits untuk desain interior
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        plan.popular ? "text-white" : "text-blue-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 px-4 rounded-xl font-medium ${
                  plan.popular
                    ? "bg-white text-blue-600 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                } transition`}
              >
                {loading === plan.id ? (
                  <span className="flex justify-center">
                    <LoadingDots
                      color={plan.popular ? "blue" : "white"}
                      style="small"
                    />
                  </span>
                ) : (
                  "Pilih Paket"
                )}
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
