import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'flipcart-Frontend';
searchText: string = '';
// userName:string |null=null;
 userName: any = localStorage.getItem('userName');
isDropdownOpen: boolean = false;
userEmail: any = localStorage.getItem('userEmail');


  constructor(private router: Router,private searchService: SearchService) {}

  ngOnInit() {
  this.userName=localStorage.getItem('userEmail');
   this.userName= localStorage.getItem('userName');
   console.log(this.userName);
  }

  onSearch(){
    this.searchService.setSearch(this.searchText);
  }
   getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.length;

    
  }
  goToCart() {
  this.router.navigate(['/cart']);
}
goToLogin() {
  this.router.navigate(['/login']);
}
logout(){
  localStorage.clear();
  this.userName=null;
  this.router.navigate(['/']);
  alert("Logged out successfully ✅");
}
 @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!event.target.closest('.account-section')) {
      this.isDropdownOpen = false;
    }
  }

toggleDropdown(){
  this.isDropdownOpen=!this.isDropdownOpen;
}

}
