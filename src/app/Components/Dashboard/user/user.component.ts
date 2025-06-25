import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Admin } from 'src/app/Core/interface/Admins/admin';
import { AdminService } from 'src/app/Core/Services/Admins/admin.service';
import { UserService } from 'src/app/Core/Services/user/user.service';
import Swal from 'sweetalert2';
// import Swal from 'sweetalert2';
// import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // search
  searchTerm: string = '';
  filterUser : any



  showModal = false;
  adminForm!: FormGroup;
  userForm!: FormGroup;
  showPassword : boolean = false;
  mode : boolean = false;
  selectId! : number
  hideInputpass = false ;
  Users :  any[] = []

  // edit Notification
  orderForm!: FormGroup;
  notification!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

    // Pagination
    currentPage: number = 1;
    totalPages: number = 1;
    totalProducts: number = 0;
    visiblePages: number[] = [];

  trackBy(index: number, admin: any): number {
    return admin.id;
  }

  editingIndex: number | null = null;

  constructor(  private _userService : UserService , private fb : FormBuilder) {
    this.userForm = this.fb.group({
      username: [''],
      Points: ['', [Validators.required, Validators.min(0)]]
    });

    this.orderForm = this.fb.group({
      email: [''],
      notificationId: ['', Validators.required],
      orderNumber: ['', Validators.required],
      ordervalue: ['', Validators.required],
      orderDate: ['', Validators.required],
      orderPaid: [''],
      remainingAmount: [''],
      orderStatus_en: ['', Validators.required],
      orderStatus_ar: ['', Validators.required],
      orderDetails_en: ['', Validators.required],
      orderDetails_ar: ['', Validators.required],
      image: [null] // سيتم رفعها عند الإرسال
    });

    this.notification = this.fb.group({
      userId: [''],
      title: [''],
      body: [''],
    });

  }

  // image
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.selectedFile = file;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
  }

  updateNotificationOrder(): void {
    if (this.orderForm.valid) {
      console.log(this.orderForm.value);

      // if( this.orderForm.get('orderPaid')?.value == 'null' || this.orderForm.get('orderPaid')?.value == null || this.orderForm.get('orderPaid')?.value == '' ) {
      //   this.orderForm.get('orderPaid')?.setValue(0);
      // }
      // if( this.orderForm.get('remainingAmount')?.value == 'null' || this.orderForm.get('remainingAmount')?.value == null || this.orderForm.get('remainingAmount')?.value == '' ) {
      //   this.orderForm.get('remainingAmount')?.setValue(0);
      // }

      const formData = new FormData();

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      else {
        formData.append('image', '');
      }

      Object.keys(this.orderForm.value).forEach(key => {
        const value = this.orderForm.get(key)?.value;

        if (key !== 'image' && value !== null && value !== '' && value !== 'null') {
            formData.append(key, value);
          }
      });

      console.log('Form Data:', formData);

      this._userService.updateNotification(formData).subscribe({
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
          this.getAllUsers(this.currentPage);
          this.orderForm.reset();
          this.formEditNotification = false;
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
        }).then(() => {
          this.showModal = false;
        });
      },
    });
    }
  }



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
        // this.filterUser = this.Users;
        this.currentPage = res.message.currentPage;
        this.totalPages = res.message.totalPages;
        this.totalProducts = res.message.totalUsers;
        this.updateVisiblePages();

        // this.admins = res.data.admins;
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

  // Search
  get filteredUsers() {
    return this.Users.filter((user: any) =>
      (user?.email?.toLowerCase() ?? '').includes(this.searchTerm.toLowerCase())
    );
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

  // editUser
  showModalUser : boolean = false ;
  editUserWithPoints(){
    if(this.userForm.valid){
      this._userService.updateUser(this.userForm.value).subscribe({
        next : (res) => {
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: res.message,
            confirmButtonColor: '#28a745',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getAllUsers(this.currentPage);
            this.showModalUser = false;
            this.userForm.reset();
          });
        },
        error : (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || 'Something went wrong',
            confirmButtonColor: '#d33',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
    }
  }

  editUser(user : any) : void {
    console.log(user);

    this.userForm.patchValue({
      username : user.username,
      Points : user.Points
    })

    // this.selectId = user.id;
    this.showModalUser = true

  }


  // Sendnotify
  showModalNotify : boolean = false ;
  notifyId! : number
  Sendnotify(id : number) {
    console.log(id);
    this.showModalNotify = true;
    this.notifyId = id;
    this.notification.get('userId')?.setValue(id);
  }

  sendnotification(){

    if(this.notification.get('userId')?.value === 'null' || this.notification.get('userId')?.value === null || this.notification.get('userId')?.value === '' ){
      this.notification.get('userId')?.setValue(this.notifyId);
    }
    console.log(this.notification.value);

    this._userService.sendNotify(this.notification.value).subscribe({
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
              this.showModalNotify = false;
              this.notification.reset();
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
              this.showModalNotify = true;
              this.notification.reset();
            });
          }
        });

  }

  closeModalNotify() {
    this.notification.reset();
    this.showModalNotify = false;
  }

  // Show an admin
  show : boolean = false ;
  selectedUser : any
  showUser(user: any) {
    this.showModal = true;
    this.selectedUser = user;
    console.log(user);

  }

  formEditNotification : boolean = false ;

  editNotification(notify: any , email: any) {
    this.showModal = false;
    this.formEditNotification = true;
    console.log("notify" + notify);
    this.orderForm.patchValue({
      notificationId : notify._id,
      email: email,
      orderNumber: notify.orderNumber,
      ordervalue: notify.ordervalue,
      orderDate: notify.orderDate,
      // orderPaid: notify.orderPaid,
      // remainingAmount: notify.remainingAmount,
      orderStatus_en: notify.orderStatus?.en || '',
      orderStatus_ar: notify.orderStatus?.ar || '',
      orderDetails_en: notify.orderDetails?.en || '',
      orderDetails_ar: notify.orderDetails?.ar || '',
    });

    for (let i = 0; i < notify.orderPaid.length; i++) {
      this.orderForm.get(`orderPaid`)?.patchValue(notify.orderPaid[i].amount);
    }

    for (let i = 0; i < notify.remainingAmount.length; i++) {
      this.orderForm.get(`remainingAmount`)?.patchValue(notify.remainingAmount[i].amount);
    }

    // تحميل الصورة إذا كانت موجودة
    if (notify.image?.secure_url) {
      this.imagePreview = notify.image.secure_url;
      this.selectedFile = null;
    } else {
      this.imagePreview = null;
      this.selectedFile = null;
    }

  }

  // deleteNotification(index: number) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to delete this notification?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.selectedUser.notifications.splice(index, 1);
  //       Swal.fire('Deleted!', 'Notification has been deleted.', 'success');
  //     }
  //   });
  // }

  // deleteUser
  deleteUser(id : number) : void {
      console.log(id);

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
            this._userService.deleteUser(id).subscribe({
              next: (res) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: res.message,
                  confirmButtonColor: '#28a745',
                  timer: 2000,
                  timerProgressBar: true,
                }).then(() => {
                  this.getAllUsers(this.currentPage);
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

  // Close the modal
  closeModal() {
    this.showModal = false;
    this.editingIndex = null;
    this.show = false;
    this.hideInputpass = false ;
    this.showModalUser = false;
    this.formEditNotification = false;
    this.orderForm.reset();
    this.userForm.reset();


  }

  formatWordsPerLine(text: string, wordsPerLine: number = 3): string {
    if (!text) return '';

    const words = text.split(' ');
    const lines: string[] = [];

    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }

    return lines.join('<br>');
  }



}
