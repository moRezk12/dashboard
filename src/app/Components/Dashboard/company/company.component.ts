import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/Core/Services/Category/category.service';
import { ProductService } from 'src/app/Core/Services/Products/product.service';
import { StoreService } from 'src/app/Core/Services/Store/store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  adminForm!: FormGroup;
  addproductForm!: FormGroup;

  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  itemsPerPage: number = 10;
  visiblePages: number[] = [];

  selectedLang: string = 'ar';
  showModal = false;
  showData : boolean = false;
  showModalAddProduct : boolean = false;

  allProducts : any = []

  showOneStore : boolean = false;
  selectId! : number
  mode : boolean = false;

  constructor(private fb: FormBuilder ,
    private _router : Router,
    private _productService : ProductService , private _storeServices : StoreService) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      image: ['', [Validators.required]],
      watsapp: [''],
      phone: [''],
      workdate_en: [''],
      workdate_ar: [''],
      owner_en: [''],
      owner_ar: [''],
      name_en: ['', [Validators.required]],
      name_ar: ['', [Validators.required]],
      location1_en: [''],
      location1_ar: [''],
      location2_en: [''],
      location2_ar: [''],
    });

    this.addproductForm = this.fb.group({
      Mostawdaa: ['', [Validators.required]],
      Product: ['' , [Validators.required] ],
      newprice: ['' ],
      oldprice: ['' ],
      quantity_en: ['' ],
      quantity_ar: ['' ],
    });



    // Get stores
    this.getStore();

    // Get All product

  }

   // Image

  image: string | null = null;
  selectedFile: File | null = null;
  allowedExtensions : string[] = ['jpg', 'jpeg', 'png', 'gif'];

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !this.allowedExtensions.includes(fileExtension)) {
      Swal.fire({
        icon: 'error',
        title: 'تنبيه!',
        text: ' فقط .jpg أو .jpeg أو .png أو .gif الرجاء اختيار صورة بصيغة  ',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = e.target.result;
      this.selectedFile = file;
      this.adminForm.get('image')?.setValue(this.image);
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Image deleted successfully',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      this.image = null;
      this.selectedFile = null;
      this.adminForm.get('image')?.setValue(null);
    });
  }



  // Get stores
  stores : any = [];
  getStore(): void {
    this._storeServices.getStore().subscribe({
      next: (res) => {
        console.log(res);

        if(res?.data.length > 0){

          this.stores = res.data;
          console.log(this.stores);
        }


      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          // text: res.message,
          confirmButtonColor: '#d33',
          timer: 2000,
          timerProgressBar: true,
        })
      }
    });
  }

  changeLanguage(event: any) {
    if (event.target && event.target.value) {
      const value = event.target.value;
      this.selectedLang = value;
      this.getStore();
    }
  }

  // Open the modal
  openAddModal() {
    this.show = false;
    this.mode = false;
    this.adminForm.enable();
    this.adminForm.reset();
    this.showModal = true;
  }

  // Add or update an admin
  addorUpdateCategory() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    console.log(this.adminForm.value);
    const formData = new FormData();
    Object.keys(this.adminForm.controls).forEach(key => {
      console.log(key + ' : ' + this.adminForm.get(key)?.value);

      if (key !== 'image') {
        formData.append(key, this.adminForm.get(key)?.value);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminForm.enable();

    if(!this.mode) {
      this._storeServices.createStore(formData).subscribe({
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
            this.getStore();
            this.showModal = false;
            this.clearFormAndImage();
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

      this._storeServices.updateStore(this.selectId, formData).subscribe({
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
            this.getStore();
            this.showModal = false;
            this.clearFormAndImage();
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

  clearFormAndImage() {
    this.adminForm.reset(); // إعادة تعيين النموذج
    this.image = null; // مسح مسار الصورة
    this.selectedFile = null; // إزالة الملف المحدد
    this.adminForm.get('image')?.setValue(null); // إعادة تعيين قيمة الصورة في النموذج
  }

  // Edit an admin
  editStore(category: any) {
    this.mode = true;
    this.showModal = false;
    this.adminForm.enable();
    console.log(category);


    this.adminForm.patchValue({
      watsapp: category.watsapp || '',
      phone: category.phone || '',
      workdate_en: category.workdate.en || '',
      workdate_ar: category.workdate.ar || '',
      owner_en: category.owner.en || '',
      owner_ar: category.owner.ar || '',
      name_en: category.name.en || '',
      name_ar: category.name.ar || '',
      location1_en: category.location1.en || '',
      location1_ar: category.location1.ar || '',
      location2_en: category.location2.en || '',
      location2_ar: category.location2.ar || '',
    });

    this.image = category.image.secure_url;
    this.adminForm.get('image')?.setValue(this.image);

    this.selectedFile = null;
    this.selectId = category._id;
    this.showModal = true;
  }

  // Show an admin
  show : boolean = false ;
  storeData : any ;
  prodId! : number

  showStore(category: any) {

    this._router.navigate([`/details/${category._id}`]);

  }

  // Get All Product
  getallproduct(){
    this._storeServices.getallproductForoneStore(this.currentPage , this.prodId).subscribe({
      next: (res) => {
        this.allProducts = res.data.products ;
        console.log(this.allProducts);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  // Delete an admin
  deleteStore(id: string) {
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
        this._storeServices.deleteStore(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getStore();
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
    this.mode = false;
    this.showModal = false;
    this.clearFormAndImage();
    this.adminForm.reset();
    this.show = false;
  }
  closeOneStore(){
    this.showOneStore = false;
  }

  // addNewProduct
  modeProduct : boolean = false ;
  addNewProduct(id : number ){
    console.log(id);
    this.addproductForm.get('Mostawdaa')?.setValue(id);
    this._productService.getProducts().subscribe({
      next: (res) => {
        if(res?.data?.products?.length > 0){
          this.allProducts = res.data.products;
          // console.log(this.allProducts);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.showModalAddProduct = true;
    this.modeProduct = false ;
  }
  addProduct(){


    this._storeServices.createProduct(this.addproductForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message,
          // text: 'Product Added successfully',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.getStore();
          this.showModalAddProduct = false;
          this.addproductForm.reset();
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
          this.showModalAddProduct = true;
        });
      }
    });

  }


  closeModalproduct(){
    this.showModalAddProduct = false;
    this.addproductForm.reset();
  }

}
