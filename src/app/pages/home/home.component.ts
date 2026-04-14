import { SearchService } from './../../services/search.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
products : any[]=[];
message: string = '';
searchText: string = '';
categories = [
  
  {
    name: 'Mobile',
    image: 'https://tiimg.tistatic.com/fp/1/008/199/32-64-gb-storage-6-inches-android-mobile-phone-658.jpg'
  },
  {
    name: 'Clothing',
    image: 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100'
  },
  {
    name: 'Electronics',
    image: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100'
  },
  {
    name: 'Home',
    image: 'data:image/jpeg;base64,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'
  },
  // {
  //   name: 'Appliances',
  //   image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png'
  // }
];

banners = [
  {
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1600',
    title: 'BIG SALE 🔥',
    subtitle: 'Up to 50% OFF on Electronics'
  },
  {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600',
    title: 'FASHION DEALS 👗',
    subtitle: 'Trendy styles starting ₹299'
  },
  {
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600',
    title: 'SMART GADGETS ⚡',
    subtitle: 'Best prices on latest tech'
  },
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600',
    title: 'HOME ESSENTIALS 🏠',
    subtitle: 'Upgrade your home today'
  }
];

currentIndex = 0;


constructor(private api:ApiService ,private router: Router,private searchService:SearchService){
} 

  ngOnInit(){
    this.api.getProducts().subscribe((res:any)=>{
      this.products = res;

      console.log("hello dear",this.products);
    })
    this.searchService.searchText$.subscribe(text => {
      this.searchText = text;
    });
  this.startSlider();

}
startSlider() {
  setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }, 3000); // 3 sec me change
}


goToDetail(id: number) {
  this.router.navigate(['/product', id]);
}

selectedCategory:string = '';

filterByCategory(cat: string) {
  this.selectedCategory = cat;
}
// filter products based on search text
getFilteredProducts() {
  
  return this.products.filter(p => {

    const matchSearch = p.name.toLowerCase().includes(this.searchText.toLowerCase())||p.category.toLowerCase().includes(this.searchText.toLowerCase());;

    const matchCategory = this.selectedCategory
      ? p.category === this.selectedCategory
      : true;

    return matchSearch && matchCategory;
  });
}
// add product to cart
// addToCart(product: any) {
//   let cart = JSON.parse(localStorage.getItem('cart') || '[]');

//   const index = cart.findIndex((item: any) => item.name === product.name);

//   if (index > -1) {
//     cart[index].qty += 1;
//   } else {
//     cart.push({ ...product, qty: 1 });
//   }

//   localStorage.setItem('cart', JSON.stringify(cart));
//   this.message = 'Added to cart!';
//   setTimeout(() => this.message = '', 2000);
// }
addToCart(product: any) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const index = cart.findIndex((item: any) => item.name === product.name);

  if (index > -1) {
    cart[index].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  this.message = 'Item added to cart 🛒';

  setTimeout(() => {
    this.message = '';
  }, 3000);
}
}

