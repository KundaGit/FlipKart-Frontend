import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
        alert("Address Updated ✏️");
        this.resetForm();
        this.loadAddresses();
      });

  } else {
    // ➕ ADD API
    this.http.post('http://localhost:5000/api/address/add', payload)
      .subscribe(() => {
        alert("Address Added ✅");
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
}
  deleteAddress(id: number) {
    this.http.delete(`http://localhost:5000/api/address/delete/${id}`)
      .subscribe(() => {
        this.loadAddresses();
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