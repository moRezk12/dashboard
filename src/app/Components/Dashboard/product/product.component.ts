import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Core/Services/Category/category.service';
import { DepartmentService } from 'src/app/Core/Services/department/department.service';
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
  itemsPerPage: number = 10;
  // limit: number = 10; // عدد المنتجات في كل صفحة
  visiblePages: number[] = [];

  allProducts : any = []

  trackById(index: number, Product: any): number {
    return Product.id;
  }

  editingIndex: number | null = null;

  constructor(private fb: FormBuilder , private _productService : ProductService ,
    private _categoryService : CategoryService,
    private _departmentService : DepartmentService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name1_en: [''],
      name1_ar: [''],
      name2_en: [''],
      name2_ar: [''],
      description_en: [''],
      description_ar: [''],
      quantity_en: [''],
      quantity_ar: [''],
      country_en: [''],
      country_ar: [''],
      stoargecondition_en: [''],
      stoargecondition_ar: [''],
      categoryId: [''],
      departmentId: [''],
      image: this.fb.array([]),
      tableData: this.fb.array([]),
      animalTypes: this.fb.array([])

    });

    // Get All Products
    this.getProducts();
    // Get Category
    this.getCategory();
    // Get Department
    this.getDepartment();

    // Pagination
    this.updateVisiblePages();

  }

  // Table Data
  get tableData(): FormArray {
    return this.productForm.get('tableData') as FormArray;
  }

  addAttribute(): void {
    const attributeGroup = this.fb.group({
      name_en: [''],
      name_ar: [''],
      value_en: [''],
      value_ar: ['']
    });

    this.tableData.push(attributeGroup);
  }

  removeAttribute(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to undo this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tableData && this.tableData.length > index) {
          this.tableData.removeAt(index);
          Swal.fire('Deleted!', 'The row has been removed.', 'success');
        } else {
          Swal.fire('Error!', 'Invalid index.', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'The row was not deleted.', 'info');
      }
    });
  }


  // Animal Types
  get animalTypesArray(): FormArray {
    return this.productForm.get('animalTypes') as FormArray;
  }

  // Add new animal input
  addAnimal(): void {
    this.animalTypesArray.push(this.fb.group({
      ar: [''],
      en: ['']
    }));
  }

  // Remove specific animal input
  removeAnimal(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to undo this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // التأكد من أن الـ FormArray موجود وصالح
        if (this.animalTypesArray && this.animalTypesArray.length > index) {
          this.animalTypesArray.removeAt(index); // إزالة العنصر
          Swal.fire('Deleted!', 'The row has been removed.', 'success');
        } else {
          Swal.fire('Error!', 'Invalid index.', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'The row was not deleted.', 'info');
      }
    });
  }


  // Get All Products
  getProducts( ): void {
    this._productService.getProducts().subscribe({
      next: (res) => {
        console.log(res);

        this.allProducts = res.data.products;
        this.currentPage = res.data.pagination.currentPage;
        this.totalPages = res.data.pagination.totalPages;
        this.totalProducts = res.data.pagination.totalProducts;
        // this.itemsPerPage = res.pagination.limit;
        this.updateVisiblePages();
      },
      error: (err) => {
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

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      // this.getProducts(page);
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

  // Drag and Drop

  getGlobalIndex(localIndex: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + localIndex;
  }

  changeOrderGlobal(fromLocalIndex: number, toGlobalIndex: number): void {
    const fromGlobalIndex = this.getGlobalIndex(fromLocalIndex);

    // Call the API to reorder
    const movedProduct = this.allProducts[fromLocalIndex];

    if (movedProduct && fromGlobalIndex !== toGlobalIndex) {
      this.saveOrder(movedProduct._id, toGlobalIndex);
    }
  }


  saveOrder(productId: string, newIndex: number): void {

    const orderedProducts =  {
      productId: productId,
      newIndex: newIndex
    };

    console.log(orderedProducts);

    this._productService.updateProductOrder(orderedProducts).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Order Saved!',
          text: 'Product order has been updated successfully.',
          timer: 2000
        }).then(() => {
          this.getProducts();
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update order.',
          timer: 2000
        });
      }
    });
  }


  // Get Category
  categories : any = [];
  getCategory(): void {
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
  // Get Department
  departments : any = [];
  getDepartment(): void {
    this._departmentService.getDepartment().subscribe({
      next: (res) => {
        console.log(res);

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
    this.mode = false;
    this.productForm.addControl('categoryId', this.fb.control('', Validators.required));
    this.productForm.addControl('departmentId', this.fb.control('', Validators.required));
    this.productForm.enable();
    this.productForm.reset();
    const tableDataFormArray = this.productForm.get('tableData') as FormArray;
    tableDataFormArray.clear();

    const animalTypesFormArray = this.productForm.get('animalTypes') as FormArray;
    animalTypesFormArray.clear();

    const imageFormArray = this.productForm.get('image') as FormArray;
    imageFormArray.clear();
    // imagesArray

    this.editingIndex = null;
    this.showModal = true;
  }





  // Add or update an Product
  addOrUpdateProduct() {
    this.showData = false;

    if( this.productForm.get('oldprice')?.value == 'null' || this.productForm.get('oldprice')?.value == null || this.productForm.get('oldprice')?.value == '' ) {
      this.productForm.get('oldprice')?.setValue(0);

    }

    if (this.productForm.invalid) {
      console.log(this.productForm.value);

      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields and upload images.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });

      return;
    }

    this.productForm.enable();
    const formData = new FormData();

    Object.keys(this.productForm.controls).forEach((key) => {
      const value = this.productForm.get(key)?.value;

      if (key === 'tableData' || key === 'animalTypes') {
        formData.append(key, JSON.stringify(value));
      } else if (key !== 'image') {
        formData.append(key, value);
      }
    });


    this.selectedFiles.forEach((file: File) => {
      formData.append('image', file);
    });

    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });



    this.showModal = false;

    console.log( "new   "+  JSON.stringify(formData));

    if(!this.mode) {
      this._productService.createProducts(formData).subscribe({
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
            this.getProducts();

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

      this._productService.updateProducts(this.editingIndex, formData).subscribe({
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
            this.getProducts();
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

  editdata : boolean = false;
  editProduct(product: any) {
    console.log(product);

    this.mode = true;
    this.showModal = false;
    this.showData = false;
    this.productForm.enable();

    this.productForm.removeControl('categoryId');
    this.productForm.removeControl('departmentId');

    this.productForm.patchValue({
      name1_en: product.name1.en,
      name1_ar: product.name1.ar,
      name2_en: product.name2.en,
      name2_ar: product.name2.ar,
      description_en: product.description.en,
      description_ar: product.description.ar,
      quantity_en: product.quantity.en,
      quantity_ar: product.quantity.ar,
      country_en: product.country.en,
      country_ar: product.country.ar,
      stoargecondition_en: product.stoargecondition?.en || '',
      stoargecondition_ar: product.stoargecondition?.ar || '',
    });

    // Image
    this.imagesArray.clear();
    product.image.forEach((img: any) => {
      this.imagesArray.push(this.fb.control(img.secure_url));
    });

    const animalTypesFormArray = this.productForm.get('animalTypes') as FormArray;
    animalTypesFormArray.clear();
    product.animalTypes.forEach((item: any) => {
      animalTypesFormArray.push(this.fb.group({
        en: [item.en],
        ar: [item.ar],
      }));
    });



    // Table Data
    const tableDataFormArray = this.productForm.get('tableData') as FormArray;
    tableDataFormArray.clear();
    if (product.tableData && product.tableData.length > 0) {
      product.tableData.forEach((item: any) => {
        tableDataFormArray.push(
          this.fb.group({
            name_en: [item.name.en],
            name_ar: [item.name.ar],
            value_en: [item.value.en],
            value_ar: [item.value.ar],
          })
        );
      });
    }

    // تحديد هل هنخفي الجدولين أثناء التعديل
    this.editdata = tableDataFormArray.length === 0 || animalTypesFormArray.length === 0;

    this.editingIndex = product._id;
    console.log('editingIndex:', this.editingIndex);
    console.log("product " + JSON.stringify(product)) ;

    this.showModal = true;
  }




  // ShowData an Product
  categoryName: string = '';
  showProduct(product: any) {
    console.log(product);

    this.mode = true;
    this.showData = true;

    this.productForm.disable();
    this.productForm.patchValue({
      name1_en: product.name1.en,
      name1_ar: product.name1.ar,
      name2_en: product.name2.en,
      name2_ar: product.name2.ar,
      description_en: product.description.en,
      description_ar: product.description.ar,
      quantity_en: product.quantity.en,
      quantity_ar: product.quantity.ar,
      country_en: product.country.en,
      country_ar: product.country.ar,
      stoargecondition_en: product.stoargecondition?.en || '',
      stoargecondition_ar: product.stoargecondition?.ar || '',
    });


    this.imagesArray.clear();
    product.image.forEach((img: any) => {
      this.imagesArray.push(this.fb.control(img.secure_url));
    });

    const animalTypesFormArray = this.productForm.get('animalTypes') as FormArray;
    animalTypesFormArray.clear();
    product.animalTypes.forEach((item: any) => {
      animalTypesFormArray.push(this.fb.group({
        en: [item.en],
        ar: [item.ar],
      }));
    });

    const tableDataFormArray = this.productForm.get('tableData') as FormArray;
    tableDataFormArray.clear();
    console.log('tableData:', product.tableData);
    product.tableData.forEach((item: any) => {
      tableDataFormArray.push(
        this.fb.group({
          name_en: [item.name.en],
          name_ar: [item.name.ar],
          value_en: [item.value.en],
          value_ar: [item.value.ar],
        })
      );
    });
    this.showModal = true;
  }

  // Delete an Product
  deleteProduct(id: number | string | undefined) {

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
              this.getProducts();
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
