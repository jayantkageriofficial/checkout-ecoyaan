export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface CartData {
  cartItems: CartItem[];
  shipping_fee: number;
  discount_applied: number;
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface CheckoutState {
  cartData: CartData | null;
  shippingAddress: ShippingAddress | null;
}
