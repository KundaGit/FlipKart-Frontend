import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'flipcart-Frontend';
  searchText: string = '';
  userName: any = localStorage.getItem('userName');
  isDropdownOpen: boolean = false;
  userEmail: any = localStorage.getItem('userEmail');

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
    
  }

  // 🔍 SEARCH
  onSearch() {
    this.searchService.setSearch(this.searchText);
  }

  // 🛒 CART COUNT
  getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.length;
  }

  // 🔥 NAVIGATION (NO NGZONE)
  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // 🚪 LOGOUT
  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Logout 🚪',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff3d00',
      cancelButtonColor: '#2874f0',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.userName = null;
        this.router.navigate(['/']); // ✅ simple navigation
      }
    });
  }

  @HostListener('document:click', ['$event'])
handleClickOutside(event: Event) {
  const clickedElement = event.target as HTMLElement;

  // agar click dropdown ya account section ke andar nahi hua
  if (!clickedElement.closest('.account-section')) {
    this.isDropdownOpen = false;
  }
}

  // 🔄 USER CHANGE LISTENER
  @HostListener('window:userChanged')
  onUserChange() {
    this.loadUser();
  }

  loadUser() {
    this.userName = localStorage.getItem('userName');
  }

  // 👇 DROPDOWN
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}