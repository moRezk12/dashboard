import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  editproductForm!: FormGroup;


  selectedLang: string = 'ar';
  showModal = false;
  showData : boolean = false;
  showModalAddProduct : boolean = false;

  allProducts : any = []

  showOneStore : boolean = false;
  selectId! : number
  mode : boolean = false;

  constructor(private fb: FormBuilder , private _productService : ProductService , private _storeServices : StoreService) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      image: ['', [Validators.required]],
      Watsapp: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      workdate_en: ['', [Validators.required]],
      workdate_ar: ['', [Validators.required]],
      owner_en: ['', [Validators.required]],
      owner_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      name_ar: ['', [Validators.required]],
      location1_en: ['', [Validators.required]],
      location1_ar: ['', [Validators.required]],
      location2_en: ['', [Validators.required]],
      location2_ar: ['', [Validators.required]],
    });

    this.addproductForm = this.fb.group({
      Mostawdaa: [''],
      Product: [''],
      newprice: [''],
      oldprice: [''],
      quantity_en: [''],
      quantity_ar: [''],
    });

    this.editproductForm = this.fb.group({
      newprice: [''],
      oldprice: [''],
      quantity: this.fb.group({
        en: [''],
        ar: ['']
      })
    });



    // Get stores
    this.getStore();

    // Get All product

  }

   // Image

  image: string | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return;

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
  editStore(category: any) {
    this.mode = true;
    this.showModal = false;
    this.adminForm.enable();
    console.log(category);


    this.adminForm.patchValue({
      Watsapp: category.watsapp || '',
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

  showStore(categoryId: any) {
    this.showOneStore = true;
    this.storeData = categoryId;
    this.prodId = categoryId._id;
    this.getallproduct();
  }

  // Get All Product
  getallproduct(){
    this._storeServices.getallproductForoneStore( this.prodId).subscribe({
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


  selectIdForProduct !: number ;
  editProductForStore(product  :any){
    this.showModaleditProduct = true;
    console.log(product);
    this.showOneStore = false;
    this.selectIdForProduct = product._id

    this.editproductForm.patchValue({
      newprice: product.newprice,
      oldprice: product.oldprice,
      quantity: {
        en: product.quantity.en,
        ar: product.quantity.ar
      }
    })

  }

  editNewpriceForProduct(){
    console.log(this.editproductForm.value);

    this._storeServices.updateProduct(this.selectIdForProduct , this.editproductForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: res.message,
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.showModaleditProduct = false ;
          this.getallproduct();
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

  deleteProductForStore(id : string){
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
        this._storeServices.deleteProduct(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getallproduct();
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

  closeModalproduct(){
    this.showModalAddProduct = false;
    this.addproductForm.reset();
  }
  showModaleditProduct : boolean = false ;
  closeEditproduct(){
    this.showModaleditProduct = false;
  }

}
