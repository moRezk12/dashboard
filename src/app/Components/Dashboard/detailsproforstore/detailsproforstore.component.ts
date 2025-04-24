import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/Core/Services/Store/store.service';
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

  constructor(private fb: FormBuilder ,private route: ActivatedRoute , private _storeServices : StoreService) {}

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

  }

  allProducts : any = []
  getallproduct(){
    this._storeServices.getallproductForoneStore( this.categoryId).subscribe({
      next: (res) => {
        this.allProducts = res.data.products ;
        console.log(this.allProducts);
      },
      error: (err) => {
        console.log(err);
      }
    })
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
