import { makeAutoObservable } from 'mobx';
import { Product, CartItem } from './types';

class CartStore {
  items: CartItem[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadCart();
  }

  addToCart(product: Product) {
    const existingItem = this.items.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    const existingItem = this.items.find((item) => item.id === productId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        this.items = this.items.filter((item) => item.id !== productId);
      }
      this.saveCart();
    }
  }

  removeItem(productId: number) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const existingItem = this.items.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        existingItem.quantity = quantity;
      }
      this.saveCart();
    }
  }

  getItemQuantity(productId: number): number {
    return this.items.find((item) => item.id === productId)?.quantity || 0;
  }

  get totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get taxAmount(): number {
    return this.totalPrice * 0.08;
  }

  get grandTotal(): number {
    return this.totalPrice + this.taxAmount;
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.items = parsed.map((item: any) => ({
            ...item,
            quantity: typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 1,
            price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0,
          }));
        } else {
          this.items = [];
        }
      } catch (e) {
        this.items = [];
      }
    }
  }
}

export const cartStore = new CartStore();
