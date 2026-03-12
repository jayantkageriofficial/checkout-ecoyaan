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
    <div className="max-w-5xl mx-auto px-4 py-6">
      {showAddressModal && (
        <AddressListModal
          onClose={() => setShowAddressModal(false)}
          onSelect={(address: ShippingAddress) => {
            setShippingAddress(address);
            setShowAddressModal(false);
          }}
        />
      )}

      <h1 className="text-xl font-bold text-gray-800 mb-5">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* ── Left ────────────────────────────────────────── */}
        <div className="flex-1 w-full space-y-4">
          {/* Delivery address */}
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Delivery Address
            </h2>

            {shippingAddress ? (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {shippingAddress.fullName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {shippingAddress.city}, {shippingAddress.state} —{" "}
                    {shippingAddress.pinCode}
                  </p>
                  <p className="text-xs text-gray-500">
                    {shippingAddress.phone}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs text-green-700 hover:text-green-800 font-medium border border-green-200 px-3 py-1 rounded-full hover:bg-green-50 transition-colors shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium border border-dashed border-green-300 rounded-lg px-4 py-3 w-full hover:bg-green-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Delivery Address
              </button>
            )}
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Payment Method
            </h2>

            <div className="space-y-2">
              {/* Pay Online */}
              <label
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === "online"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online" as PaymentMethod)}
                  className="accent-green-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">
                      Pay Online
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded">
                      SAVE ₹49
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    UPI · Cards · Net Banking
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  ₹{onlineTotal.toLocaleString("en-IN")}
                </span>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === "cod"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod" as PaymentMethod)}
                  className="accent-green-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">
                      Cash on Delivery
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Extra ₹49 COD fee applies
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  ₹{codTotal.toLocaleString("en-IN")}
                </span>
              </label>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="mt-4 w-full py-3 bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing payment…
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Pay Securely — ₹{displayTotal.toLocaleString("en-IN")}
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2">
              🔒 100% secure • Encrypted payment
            </p>
          </div>
        </div>

        {/* ── Right: Order Summary ─────────────────────────── */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden sticky top-20">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">Order Summary</h2>
            </div>

            <div className="divide-y divide-gray-50">
              {cartData.cartItems.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-3 px-4 py-3"
                >
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
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ₹{item.product_price} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 shrink-0">
                    ₹
                    {(item.product_price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>₹{shippingFee}</span>
              </div>
              <div
                className={`flex justify-between ${paymentMethod === "cod" ? "text-gray-500" : "invisible"}`}
              >
                <span>COD Fee</span>
                <span>{paymentMethod === "cod" ? "₹49" : ""}</span>
              </div>
              {cartData.discount_applied > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−₹{cartData.discount_applied}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                <span>You Pay</span>
                <span>₹{displayTotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Incl. approx. ₹{Math.round(displayTotal * 0.05)} in taxes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
