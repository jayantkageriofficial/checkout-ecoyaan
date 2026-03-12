import { CartData } from "@/types";

export default function PriceSummary({ cartData }: { cartData: CartData }) {
  const subtotal = cartData.cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;

  return (
    <div className="border-t border-gray-100 pt-4 space-y-2 mt-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>₹{subtotal.toLocaleString("en-IN")}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Shipping</span>
        <span>₹{cartData.shipping_fee.toLocaleString("en-IN")}</span>
      </div>
      {cartData.discount_applied > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>−₹{cartData.discount_applied.toLocaleString("en-IN")}</span>
        </div>
      )}
      <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1">
        <span>Total</span>
        <span>₹{total.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
