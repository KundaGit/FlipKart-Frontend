import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { SearchService } from './services/search.service';
import Swal from 'sweetalert2';

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

// logout
logout() {
  Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Logout 🚪',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff3d00',
    cancelButtonColor: '#2874f0'
  }).then((result) => {

    if (result.isConfirmed) {

      // 🔄 Loader (short time)
      Swal.fire({
        title: 'Logging out...',
        text: 'Please wait',
        allowOutsideClick: false,
        timer: 3000, // 👈 short rakho
        didOpen: () => {
          Swal.showLoading();
        }
      });

      setTimeout(() => {
        localStorage.clear();
        this.userName = null;

        this.router.navigate(['/']);
      }, 3000);

    }

  });
}
 @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!event.target.closest('.account-section')) {
      this.isDropdownOpen = false;
    }
  }
  // ✅ NEW (login ke baad UI update)
@HostListener('window:userChanged')
onUserChange() {
  this.loadUser(); // 🔥 navbar update
}
loadUser() {
  this.userName = localStorage.getItem('userName');
}


toggleDropdown(){
  this.isDropdownOpen=!this.isDropdownOpen;
}

}
