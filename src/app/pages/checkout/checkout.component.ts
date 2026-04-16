import { CartService } from './../../services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {

  items: any[] = [];

  form: any = {
    payment: 'ONLINE',
    name: '',
    address: '',
    phone: '',
  };

  addresses: any[] = [];
  selectedAddress: any = null;

  constructor(
    private CartService: CartService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.items = this.CartService.getCart();
    this.loadAddress();
  }

  // 📦 Load Address
  loadAddress() {
    const userId = localStorage.getItem('userId');

    this.http.get<any[]>(`http://localhost:5000/api/address/${userId}`)
      .subscribe(res => {
        this.addresses = res;

        if (res.length > 0) {
          const defaultAddr = res.find(a => a.isDefault);
          this.selectedAddress = defaultAddr || res[0];

          this.setFormData(this.selectedAddress);
        }
      });
  }

  // 🧠 Set form data
  setFormData(addr: any) {
    this.form.name = addr?.name || '';
    this.form.phone = addr?.mobile || '';
    this.form.address =
      `${addr?.address}, ${addr?.city}, ${addr?.state} - ${addr?.pincode}`;
  }

  // 🚀 Select Address
  selectAddress(addr: any) {
    this.selectedAddress = addr;
    this.setFormData(addr);
  }

  // ✏️ Edit redirect
  goToEdit(addr: any) {
    localStorage.setItem("editAddress", JSON.stringify(addr));
    window.location.href = "/address";
  }

  // ➕ Add redirect
  goToAdd() {
    localStorage.removeItem("editAddress");
    window.location.href = "/address";
  }

  // 💰 Total
  getTotal() {
    return this.items.reduce((sum, item) => {
      return sum + item.price * (item.qty || 1);
    }, 0);
  }

  getMRP() {
    return this.items.reduce((sum, item) => {
      return sum + (item.originalPrice || item.price) * (item.qty || 1);
    }, 0);
  }

  getDiscount() {
    return this.getMRP() - this.getTotal();
  }

  // 🧾 Place Order (COD)
 placeOrder() {

  if (!this.form.name || !this.form.address) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Info',
      text: 'Please select delivery address!',
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Order Placed 🎉',
    text: 'Order placed successfully!',
    confirmButtonText: 'OK',
    confirmButtonColor: '#2874f0'
  }).then((result) => {

    if (result.isConfirmed) {
      localStorage.removeItem('cart');
      this.items = [];
      window.location.href = '/';
    }

  });
}
  // 💳 Continue
  onContinue() {
    if (this.form.payment === 'ONLINE') {
      this.payNow();
    } else {
      this.placeOrder();
    }
  }

  // 💳 Razorpay
  payNow() {

    if (!this.form.name || !this.form.address) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Info',
        text: 'Please select delivery address!',
      });
      return;
    }

    // 🔄 Loading
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: this.getTotal() }),
    })
      .then(res => res.json())
      .then(order => {

        Swal.close(); // close loader

        const options: any = {
          key: 'rzp_test_SOcymByDl314IL',
          amount: order.amount,
          currency: order.currency,
          name: 'Kundan ShopWare',
          description: 'Order Payment',
          order_id: order.id,

          handler: (response: any) => {

            fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
              .then(res => res.json())
              .then(data => {

                if (data.success) {

                  // Save order
                  fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: this.form.name,
                      phone: this.form.phone,
                      address: this.form.address,
                      paymentId: response.razorpay_payment_id,
                      amount: this.getTotal(),
                      items: this.items,
                    }),
                  });

                Swal.fire({
  icon: 'success',
  title: 'Payment Successful 🎉',
  text: 'Order placed successfully!',
  confirmButtonText: 'OK',
  confirmButtonColor: '#2874f0'
}).then((result) => {

  if (result.isConfirmed) {
    localStorage.removeItem('cart');
    this.items = [];
    window.location.href = '/';
  }

});
                }

              });
          },

          prefill: {
            name: this.form.name,
            contact: this.form.phone,
          },

          theme: { color: '#2874f0' },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });
  }
}