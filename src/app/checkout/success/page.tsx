"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const { cartData, shippingAddress, paymentMethod } = useCheckout();
  const [orderId] = useState(() => `ECO${Date.now().toString().slice(-8)}`);
  const [txnId] = useState(() => `TXN${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cartData || !shippingAddress) { router.replace("/cart"); return; }
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [cartData, shippingAddress, router]);

  if (!cartData || !shippingAddress) return null;

  const subtotal = cartData.cartItems.reduce((s, i) => s + i.product_price * i.quantity, 0);
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;
  const finalTotal = paymentMethod === "cod" ? total + 49 : total;

  const eta = new Date();
  eta.setDate(eta.getDate() + 5);
  const etaStr = eta.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8">
      <div
        className={`max-w-sm w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Top checkmark */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5">
          <div
            className={`w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4 transition-all duration-500 delay-100 ${
              visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Order Placed!</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Thank you, {shippingAddress.fullName.split(" ")[0]}! Your eco-friendly order is confirmed.
          </p>
        </div>

        {/* Details */}
        <div className="px-5 pb-5 space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold text-gray-800 font-mono">{orderId}</span>
            </div>
            {paymentMethod === "online" && (
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-semibold text-gray-800 font-mono">{txnId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="font-semibold text-gray-800">
                {paymentMethod === "online" ? "Paid Online" : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-green-700">₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expected by</span>
              <span className="font-semibold text-gray-800">{etaStr}</span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg p-4 space-y-1">
            <p className="text-xs font-semibold text-gray-700">Delivering to</p>
            <p className="text-sm font-semibold text-gray-900">{shippingAddress.fullName}</p>
            <p className="text-xs text-gray-500">
              {shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pinCode}
            </p>
            <p className="text-xs text-gray-500">{shippingAddress.phone}</p>
          </div>

          <p className="text-center text-xs text-gray-400">
            Confirmation sent to{" "}
            <span className="text-gray-600">{shippingAddress.email}</span>
          </p>

          <Link
            href="/cart"
            className="block w-full text-center py-3 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
