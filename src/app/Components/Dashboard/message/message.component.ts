import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Admin } from 'src/app/Core/interface/Admins/admin';
import { MessageService } from 'src/app/Core/Services/Messages/message.service';


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
        console.log(res);

        this.messages = res.data;

        // this.admins = res.data.admins;
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  // Delete Message
  deleteMessage(id : any) {
    this._messageService.deleteMessage(id).subscribe({
      next : (res) => {
        console.log(res);
        this.getAllMessage();
      },
      error : (err) => {
        console.log(err);
      }
    })
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
    console.log(message);
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
