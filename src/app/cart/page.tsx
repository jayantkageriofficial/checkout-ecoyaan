import { CartData } from "@/types";
import CartClient from "./CartClient";

// Server Component — fetches cart data via SSR
async function getCartData(): Promise<CartData> {
  // In production this would be an absolute URL; for SSR in Next.js we inline the data
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/cart`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch cart data");
  return res.json();
}

export default async function CartPage() {
  const cartData = await getCartData();
  return <CartClient cartData={cartData} />;
}
