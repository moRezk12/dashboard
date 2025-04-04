import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Core/Services/Company/category.service';
import { DepartmentService } from 'src/app/Core/Services/department/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  showModal = false;
  departmentForm!: FormGroup;

  selectId! : number
  mode : boolean = false;

  constructor(private fb: FormBuilder , private _departmentService : DepartmentService) {}

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      name_en: ['', [Validators.required, Validators.minLength(3)]],
      name_ar: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Get Departments
    this.getDepartment();

  }

  // Get departments
  departments : any = [];
  getDepartment(): void {
    this._departmentService.getDepartment().subscribe({
      next: (res) => {
        if (res?.data?.department) {

          this.departments = res.data.department;

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


    if(!this.mode) {
      this._departmentService.createDepartment(data).subscribe({
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
    }else {
      // Update Category
      this._departmentService.updateDepartment(this.selectId, data).subscribe({
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
  }

  // Edit an Department
  editDepartment(depatment: any) {
    this.mode = true;
    this.showModal = false;
    this.departmentForm.enable();
    this.departmentForm.patchValue({
      name_en: depatment.name.en,
      name_ar: depatment.name.ar,
    });
    this.selectId = depatment._id;
    this.showModal = true;
  }

  // Show an admin
  // show : boolean = false ;

  // showCategory(categoryId: any) {
  //   this.show = true;
  //   this.departmentForm.disable();

  //   const selectedCategory = this.departments.find((cat : any ) => cat._id === categoryId);

  //     if (selectedCategory) {
  //       this.departmentForm.patchValue({
  //         name_en: selectedCategory.name.en,
  //         name_ar: selectedCategory.name.ar,
  //         image: selectedCategory.image.secure_url,
  //       });
  //     }
  //     this.imagePreview = selectedCategory.image.secure_url;

  //   this.showModal = true;
  // }


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
        this._departmentService.deleteDepartment(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getDepartment(); // تحديث القائمة بعد الحذف
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
    this.departmentForm.reset();
  }


}
