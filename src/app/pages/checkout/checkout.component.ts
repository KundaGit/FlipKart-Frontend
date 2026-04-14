import { CartService } from './../../services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  selectedAddress: any= null;
  deliveryAddress: any = null;
  constructor(private CartService: CartService,private http: HttpClient) {}

  ngOnInit() {
    this.items = this.CartService.getCart();
    console.log('checkout items', this.items);
    this.loadAddress(); // 🏠 load address on init
  }

  // added for address display in checkout
//   loadAddress() {
//   const userId = localStorage.getItem('userId');

//   this.http.get<any[]>(`http://localhost:5000/api/address/${userId}`)
//     .subscribe(res => {
//       this.addresses = res;
//       if (res.length > 0) {
//         this.selectedAddress = res[0]; // 👈 first address
//       }
//     });
// }

loadAddress() {
  const userId = localStorage.getItem('userId');

  this.http.get<any[]>(`http://localhost:5000/api/address/${userId}`)
    .subscribe(res => {
      this.addresses = res;

      if (res.length > 0) {
        const defaultAddr = res.find(a => a.isDefault);
        this.selectedAddress = defaultAddr || res[0];

        // ✅ SAFE ACCESS (optional chaining)
        this.form.name = this.selectedAddress?.name || '';
        this.form.phone = this.selectedAddress?.mobile || '';
        this.form.address =
          `${this.selectedAddress?.address}, ${this.selectedAddress?.city}, ${this.selectedAddress?.state} - ${this.selectedAddress?.pincode}`;
      }
    });
}
// radio select
onAddressChange(addr: any) {
  this.selectedAddress = addr;

  this.form.name = addr.name;
  this.form.phone = addr.mobile;
  this.form.address =
    `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
}

// redirect to add address page
// 🚀 select address
selectAddress(addr: any) {
  this.selectedAddress = addr;

  this.form.name = addr.name;
  this.form.phone = addr.mobile;
  this.form.address =
    `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
}


// ✏️ edit redirect
goToEdit(addr: any) {
  localStorage.setItem("editAddress", JSON.stringify(addr));
  window.location.href = "/address";
}


// ➕ add redirect
goToAdd() {
  localStorage.removeItem("editAddress");
  window.location.href = "/address";
}

  getTotal() {
    return this.items.reduce((sum, item) => {
      return sum + item.price * (item.qty || 1);
    }, 0);
  }
  placeOrder() {
    if (this.form.name || this.form.address) {
      localStorage.removeItem('cart');
      return;
    }
    alert('Order placed successfully!');
    //  clear cart
    localStorage.removeItem('cart');
    window.location.href = '/';
  }

  //
  onContinue() {
    console.log('Selected Payment:', this.form.payment);

    if (this.form.payment === 'ONLINE') {
      this.payNow(); // 💳 Razorpay
    } else {
      this.placeOrder(); // 🧾 COD
    }
  }

  // razorpay integration

  payNow() {
    console.log('🔥 PAY NOW TRIGGERED');
    // 🔥 STEP 1: backend se order create
    fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: this.getTotal(),
      }),
    })
      .then((res) => res.json())
      .then((order) => {
        // 🔥 STEP 2: Razorpay open
        const options: any = {
          key: 'rzp_test_SOcymByDl314IL', // 🔥 apna key_id
          amount: order.amount,
          currency: order.currency,
          name: 'Kundan ShopWare',
          description: 'Order Payment',
          order_id: order.id, // 🔥 VERY IMPORTANT

          handler: (response: any) => {
            // 🔥 STEP 3: verify payment
            fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(response),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  // 🔥 ORDER SAVE API
                  fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: this.form.name,
                      phone: this.form.phone,
                      address: this.form.address,
                      paymentId: response.razorpay_payment_id,
                      amount: this.getTotal(),
                      items: this.items,
                    }),
                  });
                  console.log("Order saved:", order);

                  alert('Order Received ✅🎉');

                  localStorage.removeItem('cart');
                  this.items = [];

                  window.location.href = '/';
                }
              });
          },

          prefill: {
            name: this.form.name,
            contact: this.form.phone,
          },

          theme: {
            color: '#2874f0',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });
  }

  getMRP() {
    return this.items.reduce((sum, item) => {
      return sum + (item.originalPrice || item.price) * (item.qty || 1);
    }, 0);
  }
  getDiscount() {
    return this.getMRP() - this.getTotal();
  }
}
