"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchUserCredits } from "../utils/fetchUserCredits";

interface CreditsContextType {
  credits: number;
  loading: boolean;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType>({
  credits: 0,
  loading: true,
  refreshCredits: async () => {},
});

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCredits = async () => {
    if (userId) {
      try {
        setLoading(true);
        const userCredits = await fetchUserCredits(userId);
        setCredits(userCredits);
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshCredits();
  }, [userId]);

  return (
    <CreditsContext.Provider value={{ credits, loading, refreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => useContext(CreditsContext);
