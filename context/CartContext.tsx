
import React, { createContext, useContext, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  meal_type: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev =>
      prev.find(i => i.id === item.id)
        ? prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
        : [...prev, item]
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setCart(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
