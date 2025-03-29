import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Admin } from 'src/app/Core/interface/Admins/admin';
import { AdminService } from 'src/app/Core/Services/Admins/admin.service';
import { UserService } from 'src/app/Core/Services/user/user.service';
// import Swal from 'sweetalert2';
// import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  showModal = false;
  adminForm!: FormGroup;
  showPassword : boolean = false;
  mode : boolean = false;
  selectId! : number
  hideInputpass = false ;
  Users :  any[] = []

    // Pagination
    currentPage: number = 1;
    totalPages: number = 1;
    totalProducts: number = 0;
    visiblePages: number[] = [];

  trackBy(index: number, admin: any): number {
    return admin.id;
  }

  editingIndex: number | null = null;

  constructor(  private _userService : UserService ) {}

  ngOnInit(): void {

    // Get All Users
    this.getAllUsers(this.currentPage);
    this.updateVisiblePages();


  }

    // Check if the value is a phone number
    isPhoneNumber(value: string): boolean {
      return /^[0-9]{10,}$/.test(value);
    }

  // Get All Admins
  getAllUsers(page : number) : void {
    this._userService.getUsers(page).subscribe({
      next : (res) => {
        console.log(res);

        this.Users = res.message.users;
        this.currentPage = res.message.currentPage;
        this.totalPages = res.message.totalPages;
        this.totalProducts = res.message.totalUsers;
        this.updateVisiblePages();

        // this.admins = res.data.admins;
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllUsers(page);
    }
  }

  updateVisiblePages() {
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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
  showUser(category: Admin) {
    console.log(category);

    this.hideInputpass = true;
    this.show = true;
    this.adminForm.disable();
    const fullname = category.username;
    console.log("full" + fullname);

    const [firstName, lastName] = fullname.split(' ');
    this.adminForm.get('firstName')?.setValue(firstName);
    this.adminForm.get('lastName')?.setValue(lastName);
    console.log("full" + firstName + " " + lastName);

    this.adminForm.patchValue({
      email: category.email,
      firstName: firstName,
      lastName: lastName,
      mobileNumber: category.mobileNumber,
      city : category.city
    });
    this.selectId = category.id;
    this.showModal = true;
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
