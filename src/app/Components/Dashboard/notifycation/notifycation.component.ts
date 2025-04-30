import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/Core/Services/department/department.service';
import { NotifyService } from 'src/app/Core/Services/Notify/notify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifycation',
  templateUrl: './notifycation.component.html',
  styleUrls: ['./notifycation.component.css']
})
export class NotifycationComponent implements OnInit {

  showModal = false;
  departmentForm!: FormGroup;

  selectId! : number
  mode : boolean = false;

  constructor(private fb: FormBuilder , private _notify : NotifyService ) {}

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      title: [''],
      body: [''],
    });

    // Get Departments
    this.getDepartment();

  }

  // Get departments
  notifications : any = [];
  getDepartment(): void {
    this._notify.getNotif().subscribe({
      next: (res) => {
        console.log(res);

        this.notifications = res.notifications;
        const unreadCount = this.notifications.filter((n : any) => !n.isRead).length;
        this._notify.getCounter(unreadCount);
      },
      error: (err) => {
        console.error('Error :', err);
      }
    });
  }

  // Open the modal
  openAddModal() {
    this.showModal = true;
    this.departmentForm.enable();
    this.departmentForm.reset();
    // this.editingIndex = null;
  }

  // Add or update an admin
  addorUpdateDepatment() {
    if (this.departmentForm.invalid) {
      return;
    }


    this.departmentForm.enable();

    const data = this.departmentForm.value;
    console.log(data);


    this._notify.sendNotify(data).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message,
          confirmButtonColor: '#28a745',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.getDepartment();
          this.showModal = false;
          this.departmentForm.reset();
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: err.error?.message,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.showModal = true;
        });
      }
    });
  }

  // Delete an Department
  deleteDepartment(id: string) {
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
        // this._departmentService.deleteDepartment(id).subscribe({
        //   next: (res) => {
        //     Swal.fire({
        //       icon: 'success',
        //       title: 'Deleted!',
        //       text: res.message,
        //       confirmButtonColor: '#28a745',
        //       timer: 2000,
        //       timerProgressBar: true,
        //     }).then(() => {
        //       this.getDepartment(); // تحديث القائمة بعد الحذف
        //     });
        //   },
        //   error: (err) => {
        //     Swal.fire({
        //       icon: 'error',
        //       title: 'Error!',
        //       text: err.error?.message,
        //       confirmButtonColor: '#d33',
        //       timer: 2000,
        //       timerProgressBar: true,
        //     });
        // }
        // });
      }
    });
  }


  // Close the modal
  closeModal() {
    this.showModal = false;
    this.departmentForm.reset();
  }

}
