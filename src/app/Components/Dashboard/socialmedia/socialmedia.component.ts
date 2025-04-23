import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialService } from 'src/app/Core/Services/Social Media/social.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent implements OnInit {

  selectedLang: string = 'ar';
  showModal = false;
  socialForm!: FormGroup;
  editModal : boolean = false;
  selectId! : number
  mode : boolean = false;

  constructor(private fb: FormBuilder , private _socialmediaService : SocialService) {}

  ngOnInit(): void {
    this.socialForm = this.fb.group({
      phone: ['', [Validators.required]],
      whatsapp: ['', [Validators.required]],
      facebook: ['', [Validators.required, Validators.pattern('https?://.+')]],
      twitter: ['', [Validators.required, Validators.pattern('https?://.+')]],
      instagram: ['', [Validators.required, Validators.pattern('https?://.+')]],
      tiktok: ['', [Validators.required, Validators.pattern('https?://.+')]],
      youtupe: ['', [Validators.required, Validators.pattern('https?://.+')]],
      snapchat: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    // Get Categories
    this.getSocial();

  }

  // Get Categories
  socials : any = [];
  getSocial(): void {
    this._socialmediaService.getSocial().subscribe({
      next: (res) => {
        this.socials = res.data.socialMedia        ;
        console.log(this.socials);

        // if (res?.data?.socialMedia) {


        // } else {
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Error!',
        //     text: res.message,
        //     confirmButtonColor: '#d33',
        //     timer: 2000,
        //     timerProgressBar: true,
        //   })
        // }
      },
      error: (err) => {
        console.error('Error :', err);
      }
    });
  }

  changeLanguage(event: any) {
    if (event.target && event.target.value) {
      const value = event.target.value;
      this.selectedLang = value;
      this.getSocial();
    }
  }

  // Open the modal
  openAddModal() {
    this.mode = false;
    this.socialForm.enable();
    this.socialForm.reset();
    // this.editingIndex = null;
    this.editModal = true;
  }

  // Add or update an admin
  addorUpdateCategory() {
    if (this.socialForm.invalid) {
      return;
    }


    this.socialForm.enable();

    const formData = new FormData();
    formData.append('name_en', this.socialForm.value.name_en);
    formData.append('name_ar', this.socialForm.value.name_ar);

    if (this.socialForm.value.image) {
      formData.append('image', this.socialForm.value.image);
    }

    if(!this.mode) {
      this._socialmediaService.createSocial(formData).subscribe({
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
            this.getSocial();
            this.showModal = false;
            this.socialForm.reset();
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
            this.editModal = false;
          });
        }
      });
    }else {
      // Update Category
      console.log(this.socialForm.value);

      this._socialmediaService.updateSocial(this.socialForm.value).subscribe({
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
            this.getSocial();
            this.editModal = false;
            this.socialForm.reset();
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
            this.editModal = false;
          });
        }
      });
    }
  }

  // Edit an admin
  editCategory(category: any) {
    this.mode = true;
    this.editModal = true;
    this.socialForm.patchValue(category);
  }

  // Show an admin
  show : boolean = false ;

  showCategory() {
    this.show = true;
    this.showModal = true;
  }


  // Delete an admin
  // deleteCategory(id: string) {
  //   Swal.fire({
  //     title: 'Are you sure want to delete ?',
  //     text: "",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'Cancel'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this._socialmediaService.deleteCategory(id).subscribe({
  //         next: (res) => {
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Deleted!',
  //             text: res.message,
  //             confirmButtonColor: '#28a745',
  //             timer: 2000,
  //             timerProgressBar: true,
  //           }).then(() => {
  //             this.getSocial(); // تحديث القائمة بعد الحذف
  //           });
  //         },
  //         error: (err) => {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error!',
  //             text: err.error?.message,
  //             confirmButtonColor: '#d33',
  //             timer: 2000,
  //             timerProgressBar: true,
  //           });
  //         }
  //       });
  //     }
  //   });
  // }


  // Close the modal
  closeModal() {
    this.showModal = false;
    this.socialForm.reset();
    // this.editingIndex = null;
    this.show = false;
    this.editModal = false;

  }

  // Image

  imagePreview: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.socialForm.patchValue({ image: file });
      this.socialForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.socialForm.patchValue({ image: null });
    this.socialForm.get('image')?.updateValueAndValidity();
  }

}
