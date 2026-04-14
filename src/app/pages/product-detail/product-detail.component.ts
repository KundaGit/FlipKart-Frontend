import { routes } from './../../app.routes';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
product: any;
showCartPopup = false;
popupProduct: any 
products: any[] = [];
zoomImage: string ='';
lensStyle:any={display:'none'};

constructor(private route: ActivatedRoute, private http: HttpClient, private router:Router, private cartService:CartService){}
ngOnInit() {
   const id = this.route.snapshot.params['id'];

    this.http.get(`http://localhost:5000/api/products/${id}`)
      .subscribe((res: any) => {
        this.product = res;
      });

    this.http.get(`http://localhost:5000/api/products`)
      .subscribe((res: any) => {
        this.products = res;
      });

      this.cartService.cartPopup$.subscribe((product) => {
    this.popupProduct = product;
    this.showCartPopup = true;

    setTimeout(() => {
      this.showCartPopup = true;
    }, 3000);
  });
  }

  getSuggestedProducts(){
    if(!this.product||!this.products) return [];
     return this.products
    .filter(p => 
      p.category === this.product.category && p.id !== this.product.id
    )
    .slice(0, 3);
  }

  addToCart(product: any) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // 🔍 check product already exists or not
  let existingProduct = cart.find((item: any) => item.id === product.id);

  if (existingProduct) {
    // ✅ quantity increase
    existingProduct.qty = (existingProduct.qty || 1) + 1;
  } else {
    // ✅ new product add with qty = 1
    product.qty = 1;
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // alert("Cart Updated ✅");
    this.cartService.cartPopup$.next(product);
}
buyNow(product: any) {
  this.addToCart(product);
  this.router.navigate(['/cart']);
}
goToCart() {
  this.router.navigate(['/cart']);  
}

// Magnifier code
onMouseMove(event: MouseEvent) {
  const container = (event.target as HTMLElement).getBoundingClientRect();

  const x = event.clientX - container.left;
  const y = event.clientY - container.top;

  const percentX = (x / container.width) * 100;
  const percentY = (y / container.height) * 100;

  this.zoomImage = `${percentX}% ${percentY}%`;

  // 🔥 lens position
  this.lensStyle = {
    left: x - 50 + 'px',
    top: y - 50 + 'px'
  };
}
// on mouse leave hide lens
onMouseLeave() {
  this.zoomImage = '';
  this.lensStyle = { display: 'none' };
}

}

