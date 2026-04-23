import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

   method = 'upi';
  upiId = '';
  total = 0;

  card = {
    number: '',
    expiry: '',
    cvv: ''
  };
  constructor(private route:Router) {}
    ngOnInit() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    this.total = cart.reduce((sum: number, item: any) => {
      return sum + item.price * (item.qty || 1);
    }, 0);
  }

  selectMethod(type: string) {
    this.method = type;
  }

  placeOrder() {

    if (this.method === 'upi' && !this.upiId) {
      alert("Enter UPI ID ❌");
      return;
    }

    if (this.method === 'card' && !this.card.number) {
      alert("Enter card details ❌");
      return;
    }

    alert("Order Placed Successfully ✅");

    localStorage.removeItem('cart');

    this.route.navigate(['/']);
  }
}
