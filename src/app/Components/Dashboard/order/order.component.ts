import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/Core/Services/Order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor( private _orderservice : OrderService , private fb : FormBuilder ) {}

  searchTerm: string = '';
  showModal : boolean = false;
  orders : any = []
  selectOneOrder : any ;
  showModalSend : boolean = false ;
  sendMessageForm! : FormGroup ;
  statusForm! : FormGroup ;

  trackBy(index: number, category: any): number {
    return category.id;
  }

  ngOnInit(): void {

    this.filterOrders = this.orders ;
    this.getOrder();

    this.statusForm = this.fb.group({
      status: ['', [Validators.required]]
    });

    this.sendMessageForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      image: ['', Validators.required],
      orderStatus_en: ['', Validators.required],
      orderStatus_ar: ['', Validators.required],
      orderDetails_en: ['', Validators.required],
      orderDetails_ar: ['', Validators.required],
      orderPaid: ['', [Validators.required, Validators.min(0)]],
      remainingAmount: ['', [Validators.required, Validators.min(0)]],
      orderDate: ['', Validators.required],
      orderNumber: ['', Validators.required]
    });

  }

  // image
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) return;

    if (this.imagePreview) {
      Swal.fire({
        icon: 'warning',
        title: 'Only one image allowed!',
        text: 'Please remove the current image before selecting a new one.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.selectedFile = file;

      // ✅ set the file in the form correctly
      this.sendMessageForm.get('image')?.setValue(file);
      this.sendMessageForm.get('image')?.updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;

    // ✅ Reset form value to empty string, not null
    this.sendMessageForm.get('image')?.setValue('');
    this.sendMessageForm.get('image')?.updateValueAndValidity();

    // ✅ Reset input file element
    const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Close Modal Send Message
  closeModalSend() {
    this.showModalSend = false;
  }

  sendMessageToUser() {
    console.log(this.sendMessageForm.status); // لازم تكون VALID
    console.log(this.sendMessageForm.controls); // يوريك كل فيلد وحالته
    console.log(this.sendMessageForm.value);

    if (this.sendMessageForm.valid) {
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      Object.keys(this.sendMessageForm.value).forEach(key => {
        const value = this.sendMessageForm.get(key)?.value;
        if (key !== 'image') {
          formData.append(key, value);
        }
      });

      this._orderservice.sendToUser(formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: res.message,
            confirmButtonColor: '#28a745',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.showModalSend = false;
            this.sendMessageForm.reset();
            this.selectedFile = null;
            this.imagePreview = null;
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || 'Something went wrong',
            confirmButtonColor: '#d33',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      });
    } else {
      console.log('Form Invalid Fields:', this.sendMessageForm.errors);
      console.log('Form Values:', this.sendMessageForm.value);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill all fields correctly',
        confirmButtonColor: '#d33',
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }


  // Get Order
  getOrder() : void {
    this._orderservice.getOrder().subscribe({
      next : (res) => {
        console.log(res);

        this.orders = res.data.orders;
      },
      error : (err) => {
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

  filterOrders : any
  get filteredCategories() {
    return this.orders.filter((order: any) =>
      (order.user?.email?.toLowerCase() ?? '').includes(this.searchTerm.toLowerCase()) ||
      (order.user?.username?.toLowerCase() ?? '').includes(this.searchTerm.toLowerCase())
    );
  }

  // Show order
  showOrder(order: any) {
    this.selectOneOrder = order;

    this.showModal = true;
  }

  deleteOrder(id: string) {

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
        this._orderservice.deleteOrder(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: res.message,
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getOrder();
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

  // send Message
  sendMessage(order: any) {
    // this.selectOneOrder = order;
    this.sendMessageForm.get('email')?.setValue(order.user.email);
    // const imageFormArray = this.sendMessageForm.get('image') as FormArray;
    //     imageFormArray.clear();
    this.showModalSend = true;
  }

  // edit
  editModal : boolean = false;
  editOrder(order : any){
    this.editModal = true;
    this.selectOneOrder = order;
    console.log(this.selectOneOrder);
    this.statusForm.get('status')?.setValue(this.selectOneOrder.status);

  }

  updateStatus(){

    if (this.statusForm.valid) {
      const data = this.statusForm.value;
      this._orderservice.updataOrder(this.selectOneOrder._id , data).subscribe({
        next : (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: res.message,
            confirmButtonColor: '#28a745',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getOrder();
            this.editModal = false;
          });
        },
        error : (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message, confirmButtonColor: '#d33',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
    }
  }


    // Close the modal
  closeModal() {
    this.showModal = false;
    this.editModal = false;
  }

}
