import Image from "next/image";
import { CartItem } from "@/types";

export default function CartItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.product_name}</p>
        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-gray-800">
          ₹{(item.product_price * item.quantity).toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-gray-400">
          ₹{item.product_price.toLocaleString("en-IN")} each
        </p>
      </div>
    </div>
  );
}
