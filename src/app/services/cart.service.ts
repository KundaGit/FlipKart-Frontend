
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartPopup$=new Subject<any>()
  constructor() {}

  // ✅ Get cart from localStorage
  getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  // ✅ Save cart
  saveCart(cart: any[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // 🔥 Add to cart (NO duplicate + qty increase)
  addToCart(product: any) {
    let cart = this.getCart();

    let existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      product.qty = 1;
      cart.push(product);
    }

    this.saveCart(cart);
    this.cartPopup$.next(product);
  }

  // ✅ Total (correct)
  getTotal() {
    let cart = this.getCart();
    return cart.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
  }

  // ✅ Remove item
  removeItem(id: number) {
    let cart = this.getCart();
    cart = cart.filter((item: any) => item.id !== id);
    this.saveCart(cart);
  }
}