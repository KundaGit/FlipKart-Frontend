import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  constructor(private http:HttpClient , private router: Router){}
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
      console.log(res.user);

      alert("Login Success 🔥");
      this.resetForm(); 
      this.router.navigate(['/profile'])
      window.location.reload();
    },
    error: (err) => {
      alert(err.error.message || "Login Failed ❌");
    }
  });
  
}
register(){
  // empty field check
  if(!this.name|| !this.email||!this.password || !this.confirmPassword){
    alert("Please fill all the fields ❌");
    return;
  }
  // password match check
  if(this.password!==this.confirmPassword){
    alert("Password and Confirm Password must match ❌");
    return;
  }
  this.http.post('http://localhost:5000/api/auth/register', { 
  name:this.name,
  email:this.email,
  password:this.password
 }).subscribe((res:any)=>{
  alert("Registration Success ✅");
  this.isLogin=true;
  this.resetForm();
  this.login();

  }) 
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
}
