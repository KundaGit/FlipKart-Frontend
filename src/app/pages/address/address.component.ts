import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit {

  addresses: any[] = [];
  newAddress: any = {};
  editMode=false;
  editId:number | null=null;
  constructor(private http: HttpClient) {}

  // ✅ FIX 1
  ngOnInit() {
    this.loadAddresses();
    const editData = localStorage.getItem("editAddress");

  if (editData) {
    this.newAddress = JSON.parse(editData);
    this.editMode = true;
    this.editId = this.newAddress.id;
  }
  }

  loadAddresses() {
    const userId = localStorage.getItem('userId');

    this.http.get(`http://localhost:5000/api/address/${userId}`)
      .subscribe((res: any) => {
        this.addresses = res;
      });
  }

  // addAddress() {
  //   const userId = localStorage.getItem('userId');

  //   const payload = {
  //     ...this.newAddress,
  //     userId
  //   };

  //   this.http.post('http://localhost:5000/api/address/add', payload)
  //     .subscribe(() => {
  //       alert("Address Added ✅");
  //       this.newAddress = {};
  //       this.loadAddresses();
  //     });
  // }

  // ✅ FIX 2
 
// SAVE (Add + Update)
saveAddress() {
  const userId = localStorage.getItem('userId');

  const payload = {
    ...this.newAddress,
    userId
  };

  if (this.editMode) {
    // 🔥 UPDATE API
    this.http.put(`http://localhost:5000/api/address/update/${this.editId}`, payload)
      .subscribe(() => {
        Swal.fire({
  icon: 'success',
  title: 'Updated!',
  text: 'Address updated successfully ✏️',
  showConfirmButton: false,
  timer: 1800
});
        localStorage.removeItem("editAddress");
        this.resetForm();
        this.loadAddresses();
      });

  } else {
    // ➕ ADD API
    this.http.post('http://localhost:5000/api/address/add', payload)
      .subscribe(() => {
       Swal.fire({
  icon: 'success',
  title: 'Added!',
  text: 'New address saved 📍',
  showConfirmButton: false,
  timer: 1800
});
        this.resetForm();
        this.loadAddresses();
      });
  }
}


// ✏️ EDIT CLICK
editAddress(address: any) {
  this.newAddress = { ...address };
  this.editMode = true;
  this.editId = address.id;
}


// 🔄 RESET FORM
resetForm() {
  this.newAddress = {};
  this.editMode = false;
  this.editId = null;
  localStorage.removeItem("editAddress");
}

deleteAddress(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This address will be deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {

      this.http.delete(`http://localhost:5000/api/address/delete/${id}`)
        .subscribe(() => {
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Address removed 🗑️',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadAddresses();
        });

    }
  });
}

  // defaulyt address
  setDefaultAddress(selected: any) {
  this.addresses = this.addresses.map(addr => ({
    ...addr,
    isDefault: addr.id === selected.id
  }));
}
}