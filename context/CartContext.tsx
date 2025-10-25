import React, { createContext, useState, useContext } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type CartContextType = {
  cart: Product[];
  favorites: Product[];
  addToCart: (item: Product) => void;
  addToFavorite: (item: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const addToCart = (item: Product) => setCart((prev) => [...prev, item]);
  const addToFavorite = (item: Product) => setFavorites((prev) => [...prev, item]);

  return (
    <CartContext.Provider value={{ cart, favorites, addToCart, addToFavorite }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

