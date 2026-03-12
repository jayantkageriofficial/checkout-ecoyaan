"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartData, ShippingAddress } from "@/types";

export type PaymentMethod = "online" | "cod";

interface CheckoutContextType {
  cartData: CartData | null;
  setCartData: (data: CartData) => void;
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  savedAddresses: ShippingAddress[];
  addSavedAddress: (address: ShippingAddress) => void;
  updateSavedAddress: (address: ShippingAddress) => void;
  removeSavedAddress: (id: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");

  function addSavedAddress(address: ShippingAddress) {
    setSavedAddresses((prev) => [...prev, address]);
  }

  function updateSavedAddress(address: ShippingAddress) {
    setSavedAddresses((prev) =>
      prev.map((a) => (a.id === address.id ? address : a))
    );
    if (shippingAddress?.id === address.id) {
      setShippingAddress(address);
    }
  }

  function removeSavedAddress(id: string) {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (shippingAddress?.id === id) {
      setShippingAddress(null as unknown as ShippingAddress);
    }
  }

  return (
    <CheckoutContext.Provider
      value={{
        cartData,
        setCartData,
        shippingAddress,
        setShippingAddress,
        savedAddresses,
        addSavedAddress,
        updateSavedAddress,
        removeSavedAddress,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
