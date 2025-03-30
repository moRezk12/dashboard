import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from 'src/app/Core/Services/Branch/branch.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  showModal = false;
  branchForm!: FormGroup;
  showPassword : boolean = false;
  mode : boolean = false;
  selectId! : number
  branches : any[] = []

  trackBy(index: number, branche: any): number {
    return branche.id;
  }

  editingIndex: number | null = null;

  constructor(private fb: FormBuilder , private _branchservice : BranchService ) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      name1: this.fb.group({
        en: ['', [Validators.required, Validators.minLength(3)]],
        ar: ['', [Validators.required, Validators.minLength(3)]]
      }),
      name2: this.fb.group({
        en: ['', [Validators.required, Validators.minLength(3)]],
        ar: ['', [Validators.required, Validators.minLength(3)]]
      }),
      address: this.fb.group({
        en: ['', [Validators.required, Validators.minLength(3)]],
        ar: ['', [Validators.required, Validators.minLength(3)]]
      }),
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],  // يسمح فقط بالأرقام
      locationLink: ['', [Validators.required, Validators.pattern(/https?:\/\/.*/)]]
    });

    // Check if the value is a phone number
    this.branchForm.get('phone')?.valueChanges.subscribe(value => {
    if (this.isPhoneNumber(value)) {
      if (!value.startsWith('+966')) {
        this.branchForm.patchValue({ phone: `+966${value}` }, { emitEvent: false });
      }
    }
  });

    // Get All Admins
    this.getAllBranches();

  }

    // Check if the value is a phone number
    isPhoneNumber(value: string): boolean {
      return /^[0-9]{10,}$/.test(value);
    }

  // Get All Admins
  getAllBranches() : void {
    this._branchservice.getBranches().subscribe({
      next : (res) => {
        this.branches = res.data.branches;

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
  }

  // Show password
  showIcon() {
    this.showPassword = !this.showPassword;
  }

  // Open the modal
  openAddModal() {
    this.branchForm.enable();
    this.branchForm.reset();
    this.editingIndex = null;
    this.showModal = true;
  }

  // Add or update an admin
  addBranche() {
    this.showModal = false;
    this.branchForm.enable();
    if (!this.branchForm.valid) {
      return
    }

    const adminData = this.branchForm.value;
    if(!this.mode) {
      this._branchservice.createBranch(adminData).subscribe({
        next : (res) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getAllBranches();
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

  // Show an admin
  show : boolean = false ;
  showBranche(branch: any) {

    this.show = true;
    this.branchForm.disable();

    this.branchForm.patchValue({
      name1: {
        en: branch.name1.en,
        ar: branch.name1.ar
      },
      name2: {
        en: branch.name2.en,
        ar: branch.name2.ar
      },
      address: {
        en: branch.address.en,
        ar: branch.address.ar
      },
      phone: branch.phone,
      locationLink: branch.locationLink
    });
    this.selectId = branch.id;
    this.showModal = true;
  }

  // Delete an admin
  deleteBranche(id: number) {
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
        this._branchservice.deleteBranch(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getAllBranches(); // تحديث القائمة بعد الحذف
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
    this.branchForm.reset();
    this.editingIndex = null;
    this.show = false;
  }


}
