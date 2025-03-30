import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Core/Services/Company/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  selectedLang: string = 'ar';
  showModal = false;
  adminForm!: FormGroup;

  selectId! : number
  mode : boolean = false;

  constructor(private fb: FormBuilder , private _categoryService : CategoryService) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      name_en: ['', [Validators.required, Validators.minLength(3)]],
      name_ar: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required]],
    });

    // Get Categories
    this.getCompany();

  }

  // Get Categories
  categories : any = [];
  getCompany(): void {
    this._categoryService.getCategories().subscribe({
      next: (res) => {
        if (res?.data?.categories) {

          this.categories = res.data.categories;

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.message,
            confirmButtonColor: '#d33',
            timer: 2000,
            timerProgressBar: true,
          })
        }
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
      this.getCompany();
    }
  }

  // Open the modal
  openAddModal() {
    this.adminForm.enable();
    this.adminForm.reset();
    // this.editingIndex = null;
    this.showModal = true;
  }

  // Add or update an admin
  addorUpdateCategory() {
    if (this.adminForm.invalid) {
      return;
    }


    this.adminForm.enable();

    const formData = new FormData();
    formData.append('name_en', this.adminForm.value.name_en);
    formData.append('name_ar', this.adminForm.value.name_ar);

    if (this.adminForm.value.image) {
      formData.append('image', this.adminForm.value.image);
    }

    if(!this.mode) {
      this._categoryService.createCategory(formData).subscribe({
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
            this.getCompany();
            this.showModal = false;
            this.adminForm.reset();
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
    }else {
      // Update Category
      this._categoryService.updateCategory(this.selectId, formData).subscribe({
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
            this.getCompany();
            this.showModal = false;
            this.adminForm.reset();
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
  }

  // Edit an admin
  editCategory(category: any) {
    this.mode = true;
    this.showModal = false;
    this.adminForm.enable();
    this.adminForm.patchValue({
      name_en: category.name.en,
      name_ar: category.name.ar,
      image: category.image.secure_url,
    });
    this.imagePreview = category.image.secure_url;
    this.selectId = category._id;
    this.showModal = true;
  }

  // Show an admin
  show : boolean = false ;

  showCategory(categoryId: any) {
    this.show = true;
    this.adminForm.disable();

    const selectedCategory = this.categories.find((cat : any ) => cat._id === categoryId);

      if (selectedCategory) {
        this.adminForm.patchValue({
          name_en: selectedCategory.name.en,
          name_ar: selectedCategory.name.ar,
          image: selectedCategory.image.secure_url,
        });
      }
      this.imagePreview = selectedCategory.image.secure_url;

    this.showModal = true;
  }


  // Delete an admin
  deleteCategory(id: string) {
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
        this._categoryService.deleteCategory(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getCompany(); // تحديث القائمة بعد الحذف
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
    // this.editingIndex = null;
    this.show = false;
  }

  // Image

  imagePreview: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.adminForm.patchValue({ image: file });
      this.adminForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.adminForm.patchValue({ image: null });
    this.adminForm.get('image')?.updateValueAndValidity();
  }

}
