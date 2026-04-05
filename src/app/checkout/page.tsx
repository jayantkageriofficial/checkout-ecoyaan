"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCheckout, PaymentMethod } from "@/context/CheckoutContext";
import AddressListModal from "@/components/AddressListModal";
import { ShippingAddress } from "@/types";

function getMRP(price: number) {
  return Math.round(price * 1.35);
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

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartData,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod,
  } = useCheckout();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartData) router.replace("/cart");
  }, [cartData, router]);

  if (!cartData) return null;

  const subtotal = cartData.cartItems.reduce(
    (s, i) => s + i.product_price * i.quantity,
    0,
  );
  const shippingFee = cartData.shipping_fee;
  const onlineTotal = subtotal + shippingFee - cartData.discount_applied;
  const codTotal = onlineTotal + 49;
  const displayTotal = paymentMethod === "cod" ? codTotal : onlineTotal;

  async function handlePay() {
    if (!shippingAddress) {
      setShowAddressModal(true);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    router.push("/checkout/success");
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-28">
        {showAddressModal && (
          <AddressListModal
            onClose={() => setShowAddressModal(false)}
            onSelect={(address: ShippingAddress) => {
              setShippingAddress(address);
              setShowAddressModal(false);
            }}
          />
        )}

        <StepBar step={2} />

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ── Left ─────────────────────────────────────────── */}
          <div className="flex-1 w-full space-y-4">
            {/* Delivery address */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Delivery Address</h2>
              </div>

              {shippingAddress ? (
                <div className="flex items-start justify-between gap-3 bg-green-50 rounded-lg p-3.5 border border-green-100">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-700">
                        {shippingAddress.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {shippingAddress.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {shippingAddress.city}, {shippingAddress.state} —{" "}
                        {shippingAddress.pinCode}
                      </p>
                      <p className="text-xs text-gray-500">{shippingAddress.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-xs text-green-700 hover:text-green-800 font-semibold border border-green-200 bg-white px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors shrink-0"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-3 text-sm text-green-700 hover:text-green-800 font-medium border-2 border-dashed border-green-300 rounded-xl px-4 py-4 w-full hover:bg-green-50 active:bg-green-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-green-400 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Add Delivery Address</p>
                    <p className="text-xs text-green-600 mt-0.5">Choose or add a new address</p>
                  </div>
                </button>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Payment Method</h2>
              </div>

              <div className="space-y-2.5">
                {/* Pay Online */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online" as PaymentMethod)}
                    className="accent-green-700 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">Pay Online</span>
                      <span className="text-[10px] bg-green-600 text-white font-bold px-1.5 py-0.5 rounded-md">
                        SAVE ₹49
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">UPI · Cards · Net Banking · Wallets</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    ₹{onlineTotal.toLocaleString("en-IN")}
                  </span>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod" as PaymentMethod)}
                    className="accent-green-700 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">Cash on Delivery</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Extra ₹49 COD fee applies</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    ₹{codTotal.toLocaleString("en-IN")}
                  </span>
                </label>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                100% secure · SSL encrypted · PCI compliant
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ──────────────────────────── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-800">Order Summary</h2>
              </div>

              <div className="divide-y divide-gray-50">
                {cartData.cartItems.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3 px-4 py-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ₹{item.product_price} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 shrink-0">
                      ₹{(item.product_price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-4 border-t border-gray-100 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-700">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-700">₹{shippingFee}</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-amber-600">
                    <span>COD Fee</span>
                    <span className="font-medium">+₹49</span>
                  </div>
                )}
                {cartData.discount_applied > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>−₹{cartData.discount_applied}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
                  <span>You Pay</span>
                  <span className="text-green-700">₹{displayTotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Incl. approx. ₹{Math.round(displayTotal * 0.05)} in taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom action bar ──────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Cart</span>
            <span className="sm:hidden">Back</span>
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="flex-1 py-3 bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:bg-green-300 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing payment…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay Securely — ₹{displayTotal.toLocaleString("en-IN")}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
