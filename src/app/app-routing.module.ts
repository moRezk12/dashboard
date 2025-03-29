import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { LayoutComponent } from './Layouts/layout/layout.component';
import { AdminComponent } from './Components/Dashboard/admin/admin.component';
import { CompanyComponent } from './Components/Dashboard/company/company.component';
import { AdvertisementComponent } from './Components/Dashboard/advertisement/advertisement.component';
import { ProductComponent } from './Components/Dashboard/product/product.component';
import { ForgetpassComponent } from './Components/Auth/forgetpass/forgetpass.component';
import { ConfirmpassComponent } from './Components/Auth/confirmpass/confirmpass.component';
import { authGuard } from './Core/Guards/auth.guard';
import { OrderComponent } from './Components/Dashboard/order/order.component';
import { UserComponent } from './Components/Dashboard/user/user.component';
import { BranchComponent } from './Components/Dashboard/branch/branch.component';
import { MessageComponent } from './Components/Dashboard/message/message.component';

const routes: Routes = [

  {path : '', redirectTo : 'login', pathMatch : 'full'},
  {path : 'login' , component : LoginComponent},
  {path : 'forgetpass' , component : ForgetpassComponent},
  {path : 'confirmpass' , component : ConfirmpassComponent},

  {path : '' , component : LayoutComponent,
  children : [
      {path : '' , redirectTo : 'admin', pathMatch : 'full'},
      {path : 'admin' , component : AdminComponent},
      {path : 'user' , component : UserComponent},
      {path : 'branch' , component : BranchComponent},
      {path : 'company' , component : CompanyComponent},
      {path : 'product' , component : ProductComponent},
      {path : 'advertisement' , component : AdvertisementComponent},
      {path : 'order' , component : OrderComponent},
      {path : 'message' , component : MessageComponent}
    ],
    canActivate : [authGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
