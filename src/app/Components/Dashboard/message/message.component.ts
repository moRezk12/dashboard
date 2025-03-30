import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Admin } from 'src/app/Core/interface/Admins/admin';
import { MessageService } from 'src/app/Core/Services/Messages/message.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  showModal = false;
  adminForm!: FormGroup;
  showPassword : boolean = false;
  mode : boolean = false;
  selectId! : number
  hideInputpass = false ;
  messages :  any[] = []

    // Pagination
    currentPage: number = 1;
    totalPages: number = 1;
    totalProducts: number = 0;
    visiblePages: number[] = [];

  trackBy(index: number, admin: any): number {
    return admin.id;
  }

  editingIndex: number | null = null;

  constructor( private _messageService : MessageService ) {}

  ngOnInit(): void {

    // Get All Message
    this.getAllMessage();


  }

    // Check if the value is a phone number
    isPhoneNumber(value: string): boolean {
      return /^[0-9]{10,}$/.test(value);
    }

  // Get All Admins
  getAllMessage() : void {
    this._messageService.getMessage().subscribe({
      next : (res) => {

        this.messages = res.data;

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

  // Delete Message
  deleteMessage(id : any) {

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
            this._messageService.deleteMessage(id).subscribe({
              next: (res) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: res.message,
                  confirmButtonColor: '#28a745',
                  timer: 2000,
                  timerProgressBar: true,
                }).then(() => {
                  this.getAllMessage();
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

  // Open the modal
  openAddModal() {
    this.adminForm.enable();
    this.adminForm.reset();
    this.editingIndex = null;
    this.showModal = true;
  }


  // Show an admin
  show : boolean = false ;
  message : any
  showMessage(message : any) {
    this.message = message ;

    // this.selectId = category.id;
    this.show = true;
  }

  closePopupShowData(){
    this.show = false;
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
    this.adminForm.reset();
    this.editingIndex = null;
    this.show = false;
    this.hideInputpass = false ;
  }



}
