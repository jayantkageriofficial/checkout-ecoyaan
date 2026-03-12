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

export default function CartClient({ cartData }: { cartData: CartData }) {
  const router = useRouter();
  const { setCartData } = useCheckout();
  const [items, setItems] = useState<CartItem[]>(cartData.cartItems);
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(cartData.cartItems.map((i) => [i.product_id, i.quantity]))
  );

  useEffect(() => {
    setCartData(cartData);
  }, [cartData, setCartData]);

  const subtotal = items.reduce(
    (s, i) => s + i.product_price * quantities[i.product_id],
    0
  );
  const totalSavings = items.reduce(
    (s, i) => s + itemSaving(i, quantities[i.product_id]),
    0
  );
  const grandTotal = subtotal + cartData.shipping_fee - cartData.discount_applied;

  function changeQty(id: number, delta: number) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }));
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* ── Items list ───────────────────────────────────── */}
        <div className="flex-1 w-full">
          {/* Savings banner */}
          {totalSavings > 0 && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 mb-4">
              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700 font-medium">
                You&apos;re saving <span className="font-bold">₹{totalSavings.toLocaleString("en-IN")}</span> on this order!
              </p>
            </div>
          )}

          {items.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-100 p-10 text-center text-gray-400 text-sm">
              Your cart is empty.
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
            {items.map((item) => {
              const mrp = getMRP(item.product_price);
              const qty = quantities[item.product_id];
              const saving = itemSaving(item, qty);
              return (
                <div key={item.product_id} className="flex items-start gap-4 p-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" unoptimized />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{item.product_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{item.product_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{mrp.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Save ₹{saving.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <button
                          onClick={() => changeQty(item.product_id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                          {qty}
                        </span>
                        <button
                          onClick={() => changeQty(item.product_id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-xs text-gray-400 hover:text-red-400 transition-colors ml-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Total price */}
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

        {/* ── Order summary ─────────────────────────────────── */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-lg border border-gray-100 p-5 sticky top-20">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>₹{cartData.shipping_fee}</span>
              </div>
              {cartData.discount_applied > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−₹{cartData.discount_applied}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={items.length === 0}
              className="mt-5 w-full py-2.5 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Proceed to Checkout →
            </button>

            <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
