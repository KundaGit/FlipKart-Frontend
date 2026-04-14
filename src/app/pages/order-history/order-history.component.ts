import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent {
  orders: any[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/orders').subscribe((res: any) => {
      this.orders = res;
      console.log('Orders:', res);
    });
  }
downloadInvoice(order: any) {

  const element = document.getElementById(`invoice-${order.id}`);

  if (!element) return;

  // 🔥 TEMP SHOW
  element.style.display = "block";

  html2canvas(element).then(canvas => {

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    pdf.save(`invoice_${order.id}.pdf`);

    // 🔥 AGAIN HIDE
    element.style.display = "none";

  });

}
}
