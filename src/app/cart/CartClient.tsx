"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CartData, CartItem } from "@/types";
import { useCheckout } from "@/context/CheckoutContext";

function getMRP(price: number) {
  return Math.round(price * 1.35);
}

function itemSaving(item: CartItem, qty: number) {
  return (getMRP(item.product_price) - item.product_price) * qty;
}

function StepBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Cart", "Checkout", "Confirm"];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-green-600 text-white"
                    : active
                      ? "bg-green-700 text-white ring-4 ring-green-100"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${active ? "text-green-700" : done ? "text-green-600" : "text-gray-400"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mb-4 mx-1 ${num < step ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CartClient({ cartData }: { cartData: CartData }) {
  const router = useRouter();
  const { setCartData } = useCheckout();
  const [items, setItems] = useState<CartItem[]>(cartData.cartItems);
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(cartData.cartItems.map((i) => [i.product_id, i.quantity])),
  );

  useEffect(() => {
    setCartData(cartData);
  }, [cartData, setCartData]);

  const subtotal = items.reduce(
    (s, i) => s + i.product_price * quantities[i.product_id],
    0,
  );
  const totalSavings = items.reduce(
    (s, i) => s + itemSaving(i, quantities[i.product_id]),
    0,
  );
  const grandTotal =
    subtotal + cartData.shipping_fee - cartData.discount_applied;

  function changeQty(id: number, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.product_id !== id));
  }

  function handleProceed() {
    const updated: CartData = {
      ...cartData,
      cartItems: items.map((i) => ({ ...i, quantity: quantities[i.product_id] })),
    };
    setCartData(updated);
    router.push("/checkout");
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-28">
        <StepBar step={1} />

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ── Items list ─────────────────────────────────── */}
          <div className="flex-1 w-full">
            {totalSavings > 0 && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-green-700 font-medium">
                  You&apos;re saving{" "}
                  <span className="font-bold">
                    ₹{totalSavings.toLocaleString("en-IN")}
                  </span>{" "}
                  on this order!
                </p>
              </div>
            )}

            {items.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some eco-friendly products!</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {items.map((item) => {
                const mrp = getMRP(item.product_price);
                const qty = quantities[item.product_id];
                const saving = itemSaving(item, qty);
                return (
                  <div key={item.product_id} className="flex items-start gap-4 p-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-snug">
                        {item.product_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{item.product_price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{mrp.toLocaleString("en-IN")}
                        </span>
                        {saving > 0 && (
                          <span className="text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded-md">
                            Save ₹{saving.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => changeQty(item.product_id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors text-base font-medium"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-gray-800 border-x border-gray-200">
                            {qty}
                          </span>
                          <button
                            onClick={() => changeQty(item.product_id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors text-base font-medium"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{(item.product_price * qty).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Order summary ───────────────────────────────── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>
                    Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                  </span>
                  <span className="font-medium text-gray-700">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className="font-medium text-gray-700">₹{cartData.shipping_fee}</span>
                </div>
                {cartData.discount_applied > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>−₹{cartData.discount_applied}</span>
                  </div>
                )}
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>You save</span>
                    <span>−₹{totalSavings.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 justify-center">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure &amp; encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom action bar ──────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Continue Shopping</span>
            <span className="sm:hidden">Back</span>
          </a>
          <button
            onClick={handleProceed}
            disabled={items.length === 0}
            className="flex-1 py-3 bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
