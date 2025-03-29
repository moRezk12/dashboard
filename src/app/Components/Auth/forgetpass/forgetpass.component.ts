import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Core/Services/Auth/login.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-forgetpass',
  templateUrl: './forgetpass.component.html',
  styleUrls: ['./forgetpass.component.css']
})
export class ForgetpassComponent {

    loginForm!: FormGroup;

    constructor(private fb: FormBuilder ,
      private router : Router,
      private _loginService : LoginService
    ) {}

    ngOnInit(): void {
      this.loginForm = this.fb.group({
        phone: ['', [Validators.required]]
      });

       // Check if the value is a phone number
      this.loginForm.get('phone')?.valueChanges.subscribe(value => {
        if (this.isPhoneNumber(value)) {
          if (!value.startsWith('+20')) {
            this.loginForm.patchValue({ phone: `+2${value}` }, { emitEvent: false });
          }
        }
      });

    }

    isPhoneNumber(value: string): boolean {
      return /^[0-9]{10,}$/.test(value);
    }

    // Login
    ForgetPass() {
      console.log( "value" + JSON.stringify(this.loginForm.value));

      if (this.loginForm.valid) {
        const data = this.loginForm.value;
        this._loginService.forgetpass(data).subscribe({
          next : (res : any ) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: res.message,
              confirmButtonColor: '#28a745',
              confirmButtonText: 'OK',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              localStorage.setItem('phone', this.loginForm.value.phone);
              this.router.navigate(['/confirmpass']);
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
      }else {
        this.loginForm.markAllAsTouched();
      }

    }


}
