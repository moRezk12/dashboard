import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/Core/Services/Order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor( private _orderservice : OrderService , private fb : FormBuilder ) {}

  searchTerm: string = '';
  showModal : boolean = false;
  orders : any = []
  selectOneOrder : any ;
  showModalSend : boolean = false ;
  sendMessageForm! : FormGroup ;

  trackBy(index: number, category: any): number {
    return category.id;
  }

  ngOnInit(): void {

    this.filterOrders = this.orders ;
    this.getOrder();

    this.sendMessageForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      messageEn: ['', Validators.required],
      messageAr: ['', Validators.required],
    });

  }

  // Close Modal Send Message
  closeModalSend() {
    this.showModalSend = false;
  }

  sendMessageToUser() {
    if (this.sendMessageForm.valid) {
      const data = this.sendMessageForm.value;
      this._orderservice.sendToUser(this.sendMessageForm.value).subscribe({
        next : (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: res.message,
            confirmButtonColor: '#28a745',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.showModalSend = false;
          });
        },
        error : (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message,
            confirmButtonColor: '#d33',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill all fields',
        confirmButtonColor: '#d33',
        timer: 2000,
        timerProgressBar: true,
      })
    }
  }

  // Get Order
  getOrder() : void {
    this._orderservice.getOrder().subscribe({
      next : (res) => {
        this.orders = res.data.orders;
      },
      error : (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.error?.message,
          confirmButtonColor: '#d33',
          timer: 2000,
          timerProgressBar: true,
        })
      }
    })
  }

  filterOrders : any
  get filteredCategories() {
    return this.orders.filter((order: any) =>
      (order.user?.email?.toLowerCase() ?? '').includes(this.searchTerm.toLowerCase()) ||
      (order.user?.username?.toLowerCase() ?? '').includes(this.searchTerm.toLowerCase())
    );
  }

  // Show order
  showOrder(order: any) {
    this.selectOneOrder = order;

    this.showModal = true;
  }

  deleteOrder(id: string) {

    Swal.fire({
      title: 'Are you sure want to delete ?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._orderservice.deleteOrder(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getOrder();
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: err.error?.message,
              confirmButtonColor: '#d33',
              timer: 2000,
              timerProgressBar: true,
            });
          }
        });
      }
    });

  }

  // send Message
  sendMessage(order: any) {
    // this.selectOneOrder = order;
    this.sendMessageForm.get('email')?.setValue(order.user.email);

    this.showModalSend = true;
  }
    // Close the modal
  closeModal() {
    this.showModal = false;
  }

}
