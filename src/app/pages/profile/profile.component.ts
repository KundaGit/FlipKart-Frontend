import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
profile: any = {
  firstName: '',
  lastName: '',
  gender: '',
  email: '',
  mobile: ''
};


  constructor(private http:HttpClient){}

  ngOnInit() {
  this.loadProfile(); // ✅ only this
}


 saveProfile() {
  const userId = localStorage.getItem('userId');

  this.http.post(`http://localhost:5000/api/profile/update/${userId}`, this.profile)
    .subscribe(() => {
      alert('Saved ✅');
      this.loadProfile();
    });
    
}

loadProfile() {
  const userId = localStorage.getItem('userId');

  this.http.get<any>(`http://localhost:5000/api/profile/${userId}`)
    .subscribe(data => {

      this.profile = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        gender: data.gender || '',
        email: data.email || '',
        mobile: data.mobile || ''
      };

    });
}
}
