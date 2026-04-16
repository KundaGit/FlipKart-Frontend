import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';

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

  const fullName = this.profile.firstName + ' ' + this.profile.lastName;

  this.http.post(`http://localhost:5000/api/profile/update/${userId}`, {
    ...this.profile,
    name: fullName // 🔥 ADD THIS
  })
  .subscribe(() => {

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Profile updated successfully ✏️',
      timer: 2000,
      showConfirmButton: false
    });

    this.loadProfile();
  });
}

loadProfile() {
  const userId = localStorage.getItem('userId');

  this.http.get<any>(`http://localhost:5000/api/profile/${userId}`)
    .subscribe(data => {

      // 🔥 FIX HERE
      const fullName = data.name || '';
      const nameParts = fullName.split(' ');

      this.profile = {
        firstName: data.firstName || nameParts[0] || '',
        lastName: data.lastName || nameParts.slice(1).join(' ') || '',
        gender: data.gender || '',
        email: data.email || '',
        mobile: data.mobile || ''
      };

    });
}

}
