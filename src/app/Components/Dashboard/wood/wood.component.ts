import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Core/Services/Category/category.service';
import { DepartmentService } from 'src/app/Core/Services/department/department.service';
import { ProductService } from 'src/app/Core/Services/Products/product.service';
import { WoodService } from 'src/app/Core/Services/Wood/wood.service';
import Swal from 'sweetalert2';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-wood',
  templateUrl: './wood.component.html',
  styleUrls: ['./wood.component.css']
})
export class WoodComponent implements OnInit {

  showModal = false;
  productForm!: FormGroup;
  // Add or Update
  mode : boolean = false;

  // when click on button show
  showData : boolean = false;

  // Images

  selectedFiles: File[] = [];
  selectedFilesTwo: File[] = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  itemsPerPage: number = 10;
  visiblePages: number[] = [];
  // limit: number = 10; // عدد المنتجات في كل صفحة

  allProducts : any = []

  trackById(index: number, Product: any): number {
    return Product.id;
  }

  editingIndex: number | null = null;

  constructor(private fb: FormBuilder , private _woodService : WoodService ,
    private _categoryService : CategoryService,
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name1_en: [''],
      name1_ar: [''],
      name2_en: [''],
      name2_ar: [''],
      oldprice: ['' , Validators.required],
      newprice: ['' , Validators.required],
      description_en: [''],
      description_ar: [''],
      stoargecondition_en: [''],
      stoargecondition_ar: [''],
      quantity_en: [''],
      quantity_ar: [''],
      country_en: [''],
      country_ar: [''],
      image: this.fb.array([]),
      logo: this.fb.array([]),
      tableData: this.fb.array([]),
    });

    // Get All Products
    this.getProducts(this.currentPage);


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


  // Get All Products
  getProducts(page : number): void {
    this._woodService.getWoods(page).subscribe({
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

    this._woodService.updateProductOrder(orderedProducts).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Order Saved!',
          text: 'Product order has been updated successfully.',
          timer: 2000
        }).then(() => {
          this.getProducts(this.currentPage);
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

  // Images

  get imagesArray(): FormArray {
    return this.productForm.get('image') as FormArray;
  }

  get imagesArrayTwo(): FormArray {
    return this.productForm.get('logo') as FormArray;
  }

  allowedExtensions : string[] = ['jpg', 'jpeg', 'png', 'gif'];
  onFileSelected(event: any): void {
    const files = event.target.files;

    if (files) {
      // Check total number of selected + existing files
      const totalFiles = this.selectedFiles.length + files.length;

      if (totalFiles > 3) {
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

        if (file.size > 2 * 1024 * 1024) {
          Swal.fire({
            icon: 'warning',
            title: 'Limit Exceeded!',
            text: 'Image size must be less than 2 MB.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        }
      }

      for (let file of files) {
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

        if (this.imagesArray.length < 3) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagesArray.push(this.fb.control(e.target.result));
            this.selectedFiles.push(file);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }


  onFileSelectedTwo(event: any): void {
    const files = event.target.files;
    if (files) {

      const totalFiles = this.selectedFilesTwo.length + files.length;

      if (totalFiles > 1) {
        console.error('يمكنك رفع صوره واحده فقط');
        Swal.fire({
          icon: 'warning',
          title: 'Limit Exceeded!',
          text: 'يمكنك رفع صوره واحده فقط',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        })
        return;
      }

      for (let file of files) {
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
        if (this.imagesArrayTwo.length < 1) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagesArrayTwo.push(this.fb.control(e.target.result));
            this.selectedFilesTwo.push(file);
          };
          reader.readAsDataURL(file);
        }
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

  clearDateForImages(){
    this.selectedFiles = [];
    this.selectedFilesTwo = [];
    this.imagesArray.clear();
    this.imagesArrayTwo.clear();
  }

  // Open the modal
  openAddModal() {
    this.mode = false;
    this.productForm.enable();
    this.productForm.reset();
    const tableDataFormArray = this.productForm.get('tableData') as FormArray;
    tableDataFormArray.clear();

    this.clearDateForImages();

    console.log(this.imagesArray);
    console.log(this.imagesArrayTwo);
    console.log(this.selectedFiles);
    console.log(this.selectedFilesTwo);




    this.editingIndex = null;
    this.showModal = true;
  }





  // Add or update an Product
  addOrUpdateProduct() {




    this.showData = false;


    console.log("this.productForm.value");
    console.log(this.productForm.value);

    console.log(this.selectedFiles);
    console.log(this.selectedFilesTwo);


    if (this.selectedFiles.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please Select Wood Image',
        confirmButtonColor: '#d33',
        timerProgressBar: true,
      }).then(() => {
        this.showModal = true;
      });
      return;
    }


    let newPriceRaw = this.productForm.get('newprice')?.value;
    let oldPriceRaw = this.productForm.get('oldprice')?.value;

    const newPrice = typeof newPriceRaw === 'string' ? newPriceRaw.trim() : newPriceRaw?.toString().trim();
    const oldPrice = typeof oldPriceRaw === 'string' ? oldPriceRaw.trim() : oldPriceRaw?.toString().trim();

    this.productForm.get('newprice')?.setValue(newPrice);

    console.log(`New Price: "${newPrice}"`);

    console.log(this.productForm.get('oldprice')?.value);



    console.log(`Old Price: "${oldPrice}"`);



    if (!newPrice) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please Enter New Price',
        confirmButtonColor: '#d33',
        timerProgressBar: true,
      }).then(() => {
        this.showModal = true;
      });
      return;
    }


    if (!this.productForm.get('newprice')?.value ) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text:  'Please Enter New Price ',
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


    this.productForm.enable();
    const formData = new FormData();

    Object.keys(this.productForm.controls).forEach((key) => {
      const value = this.productForm.get(key)?.value;

      if (key === 'tableData' || key === 'animalTypes') {
        formData.append(key, JSON.stringify(value));
      } else if (key !== 'image'  && key !== 'logo') {
        formData.append(key, value);
      }
    });

    // if(this.productForm.get('oldprice')?.value === null || this.productForm.get('oldprice')?.value === '' || this.productForm.get('oldprice')?.value === undefined){
    //   formData.append('oldprice', '0');
    // }

    this.selectedFiles.forEach((file: File) => {
      formData.append('image', file);
    });

    if (this.selectedFilesTwo.length === 0){
      const logoEmpty = '';
      console.log("logo is empty" +logoEmpty);

      formData.append('logo', logoEmpty);
    }else {
      this.selectedFilesTwo.forEach((file: File) => {
        formData.append('logo', file);
      });
    }

    (formData as any).forEach?.((value: any, key: any) => {
      console.log(`${key}:`, value);
    });


    this.showModal = false;

    if(!this.mode) {
      this._woodService.createWoods(formData).subscribe({
        next: (res) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            // timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getProducts(this.currentPage);
            this.clearDateForImages();

            this.productForm.reset();
          });
        },
        error: (err) => {
          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || "Server Error",
            confirmButtonColor: '#d33',
            // timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.showModal = true;
          });
        },
      });
    }else {

      this._woodService.updateWoods(this.editingIndex, formData).subscribe({
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
            this.clearDateForImages();

            this.productForm.reset();
          });
        },
        error: (err) => {
          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || "Server Error",
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






  // Edit an Product

  editdata : boolean = false;
  editProduct(product: any) {
    console.log(product);

    // Clear existing images and logos
    this.clearDateForImages();


    this.mode = true;
    this.showModal = false;
    this.showData = false;
    this.productForm.enable();

    this.productForm.patchValue({
      name1_en: product.name1.en,
      name1_ar: product.name1.ar,
      name2_en: product.name2.en,
      name2_ar: product.name2.ar,
      oldprice: product.oldprice,
      newprice: product.newprice,
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
    product.image?.forEach(async (img: any) => {
      const file = await this.urlToFile(img.secure_url, 'dummy.jpg');
      this.selectedFiles.push(file);
      this.imagesArray.push(this.fb.control(img.secure_url));
    });


    product.logo?.forEach(async (img: any) => {
      const file = await this.urlToFile(img.secure_url, 'dummy.jpg');
      this.selectedFilesTwo.push(file);
      this.imagesArrayTwo.push(this.fb.control(img.secure_url));
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
    this.editdata = tableDataFormArray.length === 0 ;

    this.editingIndex = product._id;
    console.log('editingIndex:', this.editingIndex);
    console.log("product " + JSON.stringify(product)) ;

    this.showModal = true;
  }

  async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
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
      oldprice: product.oldprice,
      newprice: product.newprice,
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
        this._woodService.deleteWoods(id).subscribe({
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


