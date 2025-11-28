"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BookingContextType {
  selectedPackage: string | null;
  setSelectedPackage: (pkg: string | null) => void;

  maxSessions: number;
  setMaxSessions: (n: number) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [maxSessions, setMaxSessions] = useState<number>(1);

  return (
    <BookingContext.Provider
      value={{
        selectedPackage,
        setSelectedPackage,
        maxSessions,
        setMaxSessions,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
