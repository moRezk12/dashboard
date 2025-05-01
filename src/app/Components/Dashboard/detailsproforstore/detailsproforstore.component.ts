import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/Core/Services/Store/store.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detailsproforstore',
  templateUrl: './detailsproforstore.component.html',
  styleUrls: ['./detailsproforstore.component.css']
})
export class DetailsproforstoreComponent {

  categoryId: string | null = null;
  showModale : boolean = false;
  editproductForm!: FormGroup;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  itemsPerPage: number = 10;
  visiblePages: number[] = [];

  constructor(private fb: FormBuilder , private http: HttpClient ,private route: ActivatedRoute , private _storeServices : StoreService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      console.log('Category ID:', this.categoryId);
    });

    this.getallproduct();

    this.editproductForm = this.fb.group({
      newprice: [''],
      oldprice: [''],
      quantity: this.fb.group({
        en: [''],
        ar: ['']
      })
    });

    // const testBody = {
    //   productId: "68137ee05891a40ce64b3ed0",
    //   mostawdaaId: "68110c40e7d7f677af22db2e",
    //   newIndex: 1
    // };

    // this.http.post(`${environment.apiUrl}/product/reorderProductInWarehouse`, testBody).subscribe({
    //   next: (res) => console.log("Worked", res),
    //   error: (err) => console.error("Failed", err)
    // });

    // Pagination
    this.updateVisiblePages();
  }

  allProducts : any = []
  getallproduct(page ?: number) {
    this._storeServices.getallproductForoneStore(this.categoryId , page  ).subscribe({
      next: (res) => {
        this.allProducts = res.data.products ;
        this.currentPage = res.data.currentPage;
        this.totalPages = res.data.totalPages;
        this.totalProducts = res.data.totalProducts;
        console.log(res);
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
      this.getallproduct(page);
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
    console.log( "234243"+ JSON.stringify(movedProduct));

    if (movedProduct && fromGlobalIndex !== toGlobalIndex) {
      this.saveOrder(movedProduct.Product._id, toGlobalIndex);
    }
  }


  saveOrder(productId: string, newIndex: number): void {

    const orderedProducts : any =  {
      productId:productId,
      mostawdaaId :this.categoryId,
      newIndex:newIndex
    };



    console.log(orderedProducts);

    this._storeServices.updateProductOrder(orderedProducts).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Order Saved!',
          text: 'Product order has been updated successfully.',
          timer: 2000
        }).then(() => {
          this.getallproduct(this.currentPage);
        });
      },
      error: (err) => {
        console.log(err);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.error?.message,
          timer: 2000
        });
      }
    });
  }

  selectIdForProduct !: number
  showModaleditProduct : boolean = false
  editProductForStore(product  :any){
    console.log(product);
    this.selectIdForProduct = product._id

    this.editproductForm.patchValue({
      newprice: product.newprice,
      oldprice: product.oldprice,
      quantity: {
        en: product.quantity.en,
        ar: product.quantity.ar
      }
    })
    this.showModaleditProduct = true;
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

  closeEditproduct(){
    this.showModaleditProduct = false;
  }


  deleteProductForStore(id : string){
    console.log(id);
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

  showData : any ;
  showProductForStore(product : any){
    this.showModale = true;
    this.showData = product;
    console.log(this.showData );
  }
  closemodel(){
    this.showModale = false
  }


}
