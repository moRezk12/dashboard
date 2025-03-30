import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AdvertisementService } from 'src/app/Core/Services/Advertisement/advertisement.service';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {

  showModal = false;
  adminForm!: FormGroup;
  showPassword : boolean = false;
  mode : boolean = false;
  selectId! : number
  hideInputpass = false ;
  advertise : any[] = []

  trackBy(index: number, admin: any): number {
    return admin.id;
  }

  editingIndex: number | null = null;

  constructor(private fb: FormBuilder , private _advService : AdvertisementService ) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      image: this.fb.array([], [Validators.required])
    });

    // Get All Admins
    this.getAllAdvertise();

  }


  // Get All Admins
  getAllAdvertise() : void {
    this._advService.getAdv().subscribe({
      next : (res) => {

        this.advertise = res.data.images ;
      },
      error : (err) => {
        Swal.fire({
          icon: 'error',
          title: err.error?.message,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    })
  }

   // Images

    get imagesArray(): FormArray {
      return this.adminForm.get('image') as FormArray;
    }

    selectedFiles: File[] = [];
    images: string[] = [];

    onFileSelected(event: any) {
      const files: FileList = event.target.files;

      // تحقق من الحد الأقصى للصور
      if (files.length + this.imagesArray.length > 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Limit Exceeded!',
          text: 'You can upload up to 3 images only!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (this.imagesArray.length < 3 && !this.imagesArray.value.includes(e.target.result)) {
            this.imagesArray.push(this.fb.control(e.target.result)); // حفظ Base64 للعرض
            this.selectedFiles.push(file); // حفظ الملف الفعلي
          }
        };
        reader.readAsDataURL(file);
      }
    }

    // حذف الصورة
    removeImage(index: number) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Image deleted successfully',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        // this.getProducts();
        this.imagesArray.removeAt(index);
        this.selectedFiles.splice(index, 1);
      });
    }


  // Open the modal
  openAddModal() {
    this.adminForm.enable();
    this.adminForm.reset();
    this.editingIndex = null;
    this.showModal = true;
  }

  // Add or update an admin
  addAdv() {
    this.showModal = false;
    this.adminForm.enable();
    if (!this.adminForm.valid) {
      return
    }

    const formData = new FormData();
    Object.keys(this.adminForm.controls).forEach((key) => {
      formData.append(key, this.adminForm.get(key)?.value);
    });

    this.selectedFiles.forEach((file, index) => {
      formData.append(`image`, file);
    });

    this.showModal = false;


    if(!this.mode) {
      this._advService.createAdv(formData).subscribe({
        next : (res) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getAllAdvertise();
            this.showPassword = false ;
            this.mode = false ;
          });
        },
        error : (err) => {
          Swal.fire({
            icon: 'error',
            title: err.error?.message,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
    }

  }


  // Delete an admin
  deleteImage(id : any) {

    const image = {
      imageId : id
    }


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
        this._advService.deleteAdv(image).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getAllAdvertise();
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
    this.adminForm.reset();
    this.editingIndex = null;
    this.hideInputpass = false ;
  }


}
