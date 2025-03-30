import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Core/Services/Company/category.service';
import { ProductService } from 'src/app/Core/Services/Products/product.service';
import Swal from 'sweetalert2';
// import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {

  showModal = false;
  productForm!: FormGroup;
  // Add or Update
  mode : boolean = false;

  // when click on button show
  showData : boolean = false;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  // limit: number = 10; // عدد المنتجات في كل صفحة
  visiblePages: number[] = [];

  allProducts : any = []

  trackById(index: number, Product: any): number {
    return Product.id;
  }


  editingIndex: number | null = null;

  constructor(private fb: FormBuilder , private _productService : ProductService , private _categoryService : CategoryService ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name1_en: ['', [Validators.required, Validators.minLength(3)]],
      name1_ar: ['', [Validators.required, Validators.minLength(3)]],
      name2_en: ['', [Validators.required, Validators.minLength(3)]],
      name2_ar: ['', [Validators.required, Validators.minLength(3)]],
      description_en: ['', [Validators.required, Validators.minLength(10)]],
      description_ar: ['', [Validators.required, Validators.minLength(10)]],
      newprice: ['', [Validators.required]],
      oldprice: ['', [Validators.required]],
      quantity_en: ['', [Validators.required, Validators.minLength(3)]],
      quantity_ar: ['', [Validators.required, Validators.minLength(3)]],
      country_en: ['', [Validators.required, Validators.minLength(3)]],
      country_ar: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', [Validators.required, Validators.minLength(3)]],
      image: this.fb.array([], [Validators.required])
    });

    // Get All Products
    this.getProducts(this.currentPage);
    // Get Category
    this.getCategory();

    // Pagination
    this.updateVisiblePages();

  }

  // Get All Products
  getProducts(page : number ): void {
    this._productService.getProducts(page).subscribe({
      next: (res) => {
        console.log(res);
        this.allProducts = res.data.products;
        this.currentPage = res.data.pagination.currentPage;
        this.totalPages = res.data.pagination.totalPages;
        this.totalProducts = res.data.pagination.totalProducts;
        // this.limit = res.pagination.limit;
        this.updateVisiblePages();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getProducts(page);
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

  // Get Category
  categories : any = [];
  getCategory(): void {
    this._categoryService.getCategories().subscribe({
      next: (res) => {
        if (res?.data?.categories) {

          this.categories = res.data.categories;
          console.log(this.categories);

        } else {
          console.error('Error fetching categories:', res);
        }
      },
      error: (err) => {
        console.error('Error :', err);
      }
    });
  }

  // Open the modal
  openAddModal() {
    this.productForm.enable();
    this.productForm.reset();
    this.editingIndex = null;
    this.showModal = true;
  }

  // Add or update an Product
  addOrUpdateProduct() {
    this.showData = false;
    console.log(this.productForm.value);

    if (this.productForm.invalid) {
      console.log('Invalid form' + this.productForm.value );
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields and upload images.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });

      return;
    }

    console.log( "new" + this.productForm.value);



    this.productForm.enable();

    const formData = new FormData();
    Object.keys(this.productForm.controls).forEach((key) => {
      formData.append(key, this.productForm.get(key)?.value);
    });

    this.selectedFiles.forEach((file, index) => {
      formData.append(`image`, file);
    });

    this.showModal = false;

    console.log( "form data" + formData);

    if(!this.mode) {
      this._productService.createProducts(formData).subscribe({
        next: (res) => {
          console.log( "done" + res);

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getProducts(this.currentPage);

            this.productForm.reset();
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
            this.showModal = true;
          });
        },
      });
    }else {
      this._productService.updateProducts(this.editingIndex, this.productForm.value).subscribe({
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
            this.getProducts(this.currentPage);
            this.productForm.reset();
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
            this.showModal = true;
          });
        },
      });
    }

  }

  // Images

  get imagesArray(): FormArray {
    return this.productForm.get('image') as FormArray;
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


  // Edit an Product
  editProduct(product: any) {
    this.mode = true;
    this.showModal = false;
    this.productForm.enable();
    this.productForm.patchValue({
      name1_en: product.name1.en,
      name1_ar: product.name1.ar,
      name2_en: product.name2.en,
      name2_ar: product.name2.ar,
      description_en: product.description.en,
      description_ar: product.description.ar,
      newprice: product.newprice,
      oldprice: product.oldprice,
      quantity_en: product.quantity.en,
      quantity_ar: product.quantity.ar,
      country_en: product.country.en,
      country_ar: product.country.ar,
      categoryId: product._id,
    });

    this.imagesArray.clear();
    product.image.forEach((img: any) => {
      this.imagesArray.push(this.fb.control(img.secure_url));
    });
    this.editingIndex = product._id;



    this.showModal = true;
  }

  // ShowData an Product
  showProduct(product: any) {
    this.showData = true;
    console.log(product);

    this.productForm.disable();
    this.productForm.patchValue({
      name1_en: product.name1.en,
      name1_ar: product.name1.ar,
      name2_en: product.name2.en,
      name2_ar: product.name2.ar,
      description_en: product.description.en,
      description_ar: product.description.ar,
      newprice: product.newprice,
      oldprice: product.oldprice,
      quantity_en: product.quantity.en,
      quantity_ar: product.quantity.ar,
      country_en: product.country.en,
      country_ar: product.country.ar,
      categoryId: product._id,
    });

    this.imagesArray.clear();
    product.image.forEach((img: any) => {
      this.imagesArray.push(this.fb.control(img.secure_url));
    });

    // this.editingIndex = product._id;
    this.showModal = true;
  }

  // Delete an Product
  deleteProduct(id: number | string | undefined) {
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
        this._productService.deleteProducts(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getProducts(this.currentPage);
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
    this.productForm.reset();
    this.editingIndex = null;
    this.showData = false;
  }




}
