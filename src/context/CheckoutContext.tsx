"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartData, ShippingAddress } from "@/types";

export type PaymentMethod = "online" | "cod";

interface CheckoutContextType {
  cartData: CartData | null;
  setCartData: (data: CartData) => void;
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress | null) => void;
  savedAddresses: ShippingAddress[];
  addSavedAddress: (address: ShippingAddress) => void;
  updateSavedAddress: (address: ShippingAddress) => void;
  removeSavedAddress: (id: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartDataState] = useState<CartData | null>(() =>
    readStorage<CartData | null>("eco_cart", null),
  );
  const [shippingAddress, setShippingAddressState] =
    useState<ShippingAddress | null>(() =>
      readStorage<ShippingAddress | null>("eco_shipping_addr", null),
    );
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>(() =>
    readStorage<ShippingAddress[]>("eco_saved_addrs", []),
  );
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>(() =>
    readStorage<PaymentMethod>("eco_payment_method", "online"),
  );

  useEffect(() => {
    if (cartData) localStorage.setItem("eco_cart", JSON.stringify(cartData));
  }, [cartData]);

  useEffect(() => {
    localStorage.setItem("eco_shipping_addr", JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem("eco_saved_addrs", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem("eco_payment_method", paymentMethod);
  }, [paymentMethod]);

  function setCartData(data: CartData) {
    setCartDataState(data);
  }

  function setShippingAddress(address: ShippingAddress | null) {
    setShippingAddressState(address);
  }

  function setPaymentMethod(m: PaymentMethod) {
    setPaymentMethodState(m);
  }

  function addSavedAddress(address: ShippingAddress) {
    setSavedAddresses((prev) => [...prev, address]);
  }

  function updateSavedAddress(address: ShippingAddress) {
    setSavedAddresses((prev) =>
      prev.map((a) => (a.id === address.id ? address : a)),
    );
    if (shippingAddress?.id === address.id) setShippingAddressState(address);
  }

  function removeSavedAddress(id: string) {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (shippingAddress?.id === id) setShippingAddressState(null);
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
