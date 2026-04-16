import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
isLogin: boolean = true;
name='';
  email='';
  password='';
 confirmPassword='';
showPassword: boolean = false;
showConfirmPassword: boolean = false;
userName: any;

constructor(private http:HttpClient , private router: Router){}

ngOnInit() {
  this.loadUserDetails();
}

login() {
  this.http.post('http://localhost:5000/api/auth/login', {
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res: any) => {

      const fullName = res.user.name || '';
      const nameParts = fullName.split(' ');

      localStorage.setItem('token', res.token);  
      localStorage.setItem('userId', res.user.id);
      localStorage.setItem('userName', nameParts[0]);
      localStorage.setItem('userEmail', res.user.email);

      // ✅ SUCCESS POPUP
      Swal.fire({
        icon: 'success',
        title: 'Login Successful 🎉',
        text: `Welcome ${nameParts[0]} 👋`,
        confirmButtonColor: '#2874f0'
      }).then(() => {
        this.resetForm();
         window.dispatchEvent(new Event('userChanged'));

        this.router.navigate(['/profile']);
        // window.location.reload();
      });

    },

    error: (err) => {

      // ❌ ERROR POPUP
      Swal.fire({
        icon: 'error',
        title: 'Login Failed ❌',
        text: err.error.message || 'Invalid email or password',
      });

    }
  });
}

register() {

  // ❌ empty check
  if (!this.name || !this.email || !this.password || !this.confirmPassword) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill all the fields',
    });
    return;
  }

  // ❌ password mismatch
  if (this.password !== this.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Password Mismatch',
      text: 'Password and Confirm Password must match',
    });
    return;
  }

  this.http.post('http://localhost:5000/api/auth/register', { 
    name: this.name,
    email: this.email,
    password: this.password
  }).subscribe((res: any) => {

    // ✅ SUCCESS POPUP
    Swal.fire({
      icon: 'success',
      title: 'Registration Successful 🎉',
      text: 'Now login to continue',
      confirmButtonColor: '#fb641b'
    }).then(() => {

      this.isLogin = true;
      this.resetForm();

    });

  }, (err) => {

    // ❌ ERROR
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed ❌',
      text: err.error.message || 'Something went wrong',
    });

  });
}
submit(){
  if(this.isLogin){
    this.login();
  }else{
    this.register();
  }
    
}
resetForm(){
  this.name='';
  this.email='';
  this.password='';
  this.confirmPassword='';
}
  toggleMode() {
    this.isLogin=!this.isLogin
    this.resetForm();
  }

  // load user details on init
  loadUserDetails() {
    this.userName = localStorage.getItem('userName');
  }
  
}
