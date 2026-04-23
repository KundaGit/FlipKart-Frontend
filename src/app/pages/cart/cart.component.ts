import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
 items: any[] = [];

  ngOnInit() {
    this.items = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  

  increaseQty(i: number) {
  this.items[i].qty++;
  localStorage.setItem('cart', JSON.stringify(this.items));
}

decreaseQty(i: number) {
  if (this.items[i].qty > 1) {
    this.items[i].qty--;
  } else {
    this.removeItem(i);
  }
  localStorage.setItem('cart', JSON.stringify(this.items));
}
getTotal() {
  return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

  removeItem(index: number) {
    this.items.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  clearCart() {
  this.items = [];
  localStorage.removeItem('cart'); // ya clear() bhi use kar sakta hai
}
}