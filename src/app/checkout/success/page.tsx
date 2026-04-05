"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const { cartData, shippingAddress, paymentMethod } = useCheckout();
  const [orderId] = useState(() => `ECO${Date.now().toString().slice(-8)}`);
  const [txnId] = useState(
    () => `TXN${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cartData || !shippingAddress) {
      router.replace("/cart");
      return;
    }
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [cartData, shippingAddress, router]);

  if (!cartData || !shippingAddress) return null;

  const subtotal = cartData.cartItems.reduce(
    (s, i) => s + i.product_price * i.quantity,
    0,
  );
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;
  const finalTotal = paymentMethod === "cod" ? total + 49 : total;

  const eta = new Date();
  eta.setDate(eta.getDate() + 5);
  const etaStr = eta.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8 bg-gray-50">
      <div
        className={`max-w-sm w-full bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Green top banner */}
        <div className="bg-linear-to-br from-green-600 to-green-700 px-6 pt-8 pb-10 text-center">
          <div
            className={`w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto mb-4 transition-all duration-500 delay-100 ${
              visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Order Placed!</h1>
          <p className="text-sm text-green-100 mt-1">
            Thank you, {shippingAddress.fullName.split(" ")[0]}!
          </p>
        </div>

        {/* Details */}
        <div className="px-5 py-5 space-y-4 -mt-4">
          {/* Order card */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-800 font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">
                {orderId}
              </span>
            </div>
            {paymentMethod === "online" && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-bold text-gray-800 font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">
                  {txnId}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment</span>
              <span
                className={`font-semibold text-xs px-2 py-1 rounded-md ${
                  paymentMethod === "online"
                    ? "text-green-700 bg-green-50"
                    : "text-amber-700 bg-amber-50"
                }`}
              >
                {paymentMethod === "online" ? "Paid Online" : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-green-700 text-base">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-500">Expected by</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold text-gray-800 text-sm">{etaStr}</span>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Delivering to</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{shippingAddress.fullName}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pinCode}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{shippingAddress.phone}</p>
          </div>

          <p className="text-center text-xs text-gray-400">
            Confirmation sent to{" "}
            <span className="text-gray-600 font-medium">{shippingAddress.email}</span>
          </p>

          <Link
            href="/cart"
            className="block w-full text-center py-3.5 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
