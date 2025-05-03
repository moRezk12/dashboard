import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Core/Services/Category/category.service';
import { DepartmentService } from 'src/app/Core/Services/department/department.service';
import { ProductService } from 'src/app/Core/Services/Products/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  showModal = false;
  productForm!: FormGroup;
  mode: boolean = false;
  editingIndex: string | null = null;
  editdata = false;
  selectedFiles: File[] = [];
  selectedFilesTwo: File[] = [];

  showData: boolean = false;

  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  itemsPerPage: number = 10;
  visiblePages: number[] = [];

  allProducts: any = [];

  trackById(index: number, Product: any): number {
    return Product.id;
  }

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name1_en: ['', Validators.required],
      name1_ar: ['', Validators.required],
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
      departmentId: ['', Validators.required],
      image: this.fb.array([]),
      logo: this.fb.array([]),
      tableData: this.fb.array([]),
      animalTypes: this.fb.array([])
    });

    this.getProducts();
    this.getCategory();
    this.getDepartment();
    this.updateVisiblePages();
  }

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
      text: "You won't be able to undo this!",
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

  get animalTypesArray(): FormArray {
    return this.productForm.get('animalTypes') as FormArray;
  }

  addAnimal(): void {
    this.animalTypesArray.push(this.fb.group({
      ar: [''],
      en: ['']
    }));
  }

  removeAnimal(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.animalTypesArray && this.animalTypesArray.length > index) {
          this.animalTypesArray.removeAt(index);
          Swal.fire('Deleted!', 'The row has been removed.', 'success');
        } else {
          Swal.fire('Error!', 'Invalid index.', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'The row was not deleted.', 'info');
      }
    });
  }

  getProducts(): void {
    this._productService.getProducts().subscribe({
      next: (res) => {
        this.allProducts = res.data.products;
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
        });
      }
    });
  }

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

  getGlobalIndex(localIndex: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + localIndex;
  }

  changeOrderGlobal(fromLocalIndex: number, toGlobalIndex: number): void {
    const fromGlobalIndex = this.getGlobalIndex(fromLocalIndex);
    const movedProduct = this.allProducts[fromLocalIndex];
    if (movedProduct && fromGlobalIndex !== toGlobalIndex) {
      this.saveOrder(movedProduct._id, toGlobalIndex);
    }
  }

  saveOrder(productId: string, newIndex: number): void {
    const orderedProducts = {
      productId: productId,
      newIndex: newIndex
    };
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

  categories: any = [];
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
          });
        }
      },
      error: (err) => {
        console.error('Error :', err);
      }
    });
  }

  departments: any = [];
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
          });
        }
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

  get imagesArray(): FormArray {
    return this.productForm.get('image') as FormArray;
  }

  get imagesArrayTwo(): FormArray {
    return this.productForm.get('logo') as FormArray;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length && this.imagesArray.length < 3; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagesArray.push(this.fb.control(e.target.result));
          this.selectedFiles.push(file);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onFileSelectedTwo(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length && this.imagesArrayTwo.length < 3; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagesArrayTwo.push(this.fb.control(e.target.result));
          this.selectedFilesTwo.push(file);
        };
        reader.readAsDataURL(file);
      }
    }
  }

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
      this.imagesArray.removeAt(index);
      this.selectedFiles.splice(index, 1);
    });
  }

  removeImageTwo(index: number) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Image deleted successfully',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      this.imagesArrayTwo.removeAt(index);
      this.selectedFilesTwo.splice(index, 1);
    });
  }

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
    const imageFormArrayTwo = this.productForm.get('logo') as FormArray;
    imageFormArrayTwo.clear();
    this.selectedFiles = [];
    this.selectedFilesTwo = [];
    this.editingIndex = null;
    this.showModal = true;
  }

  addOrUpdateProduct() {
    if (this.selectedFiles.length === 0 && !this.mode) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please Select Product Image',
        confirmButtonColor: '#d33',
        timerProgressBar: true,
      }).then(() => {
        this.showModal = true;
      });
      return;
    }

    if (!this.mode) {
      if (!this.productForm.get('departmentId')?.value) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Please Select Department',
          confirmButtonColor: '#d33',
          timerProgressBar: true,
        }).then(() => {
          this.showModal = true;
        });
        return;
      } else if (!this.productForm.get('name1_en')?.value || !this.productForm.get('name1_ar')?.value) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: this.productForm.get('name1_ar')?.value ? 'Please Enter Name in English' : 'Please Enter Name in Arabic',
          confirmButtonColor: '#d33',
          timerProgressBar: true,
        }).then(() => {
          this.showModal = true;
        });
        return;
      }
    }

    this.showData = false;
    this.productForm.enable();
    const formData = new FormData();

    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      if (key === 'tableData' || key === 'animalTypes') {
        formData.append(key, JSON.stringify(control?.value));
      } else if (key !== 'image' && key !== 'logo') {
        formData.append(key, control?.value || '');
      }
    });

    // Append new image files
    this.selectedFiles.forEach((file: File) => {
      formData.append('image', file);
    });

    // Append new logo files
    this.selectedFilesTwo.forEach((file: File) => {
      formData.append('logo', file);
    });

    // If editing, append existing image URLs that weren't replaced
    if (this.mode) {
      this.imagesArray.value.forEach((url: string, index: number) => {
        if (!this.selectedFiles[index]) {
          formData.append('existingImages', url);
        }
      });
      this.imagesArrayTwo.value.forEach((url: string, index: number) => {
        if (!this.selectedFilesTwo[index]) {
          formData.append('existingLogos', url);
        }
      });
    }

    this.showModal = false;

    if (!this.mode) {
      this._productService.createProducts(formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timerProgressBar: true,
          }).then(() => {
            this.getProducts();
            this.imagesArray.clear();
            this.imagesArrayTwo.clear();
            this.selectedFiles = [];
            this.selectedFilesTwo = [];
            this.productForm.reset();
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message,
            confirmButtonColor: '#d33',
            timerProgressBar: true,
          }).then(() => {
            this.showModal = true;
          });
        },
      });
    } else {
      this._productService.updateProducts(this.editingIndex, formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timerProgressBar: true,
          }).then(() => {
            this.getProducts();
            this.productForm.reset();
            this.selectedFiles = [];
            this.selectedFilesTwo = [];
            this.imagesArray.clear();
            this.imagesArrayTwo.clear();
            this.mode = false;
            this.editingIndex = null;
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message,
            confirmButtonColor: '#d33',
            timerProgressBar: true,
          }).then(() => {
            this.showModal = true;
          });
        },
      });
    }
  }

  editProduct(product: any) {
    this.mode = true;
    this.showModal = false;
    this.showData = false;
    this.productForm.enable();

    // Clear existing images and logos
    this.imagesArray.clear();
    this.imagesArrayTwo.clear();
    this.selectedFiles = [];
    this.selectedFilesTwo = [];

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

    // Handle images
    if (product.image && product.image.length > 0) {
      product.image.forEach((img: any) => {
        this.imagesArray.push(this.fb.control(img.secure_url));
      });
    }

    // Handle logos
    if (product.logo && product.logo.length > 0) {
      product.logo.forEach((img: any) => {
        this.imagesArrayTwo.push(this.fb.control(img.secure_url));
      });
    }

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

    this.editdata = tableDataFormArray.length === 0 || animalTypesFormArray.length === 0;
    this.editingIndex = product._id;
    this.showModal = true;
  }

  showProduct(product: any) {
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

    this.imagesArrayTwo.clear();
    product.logo.forEach((img: any) => {
      this.imagesArrayTwo.push(this.fb.control(img.secure_url));
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

  deleteProduct(id: number | string | undefined) {
    Swal.fire({
      title: 'Are you sure want to delete ?',
      text: '',
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

  closeModal() {
    this.showModal = false;
    this.productForm.reset();
    this.editingIndex = null;
    this.showData = false;
  }
}
