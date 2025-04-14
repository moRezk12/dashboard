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
import { DepartmentComponent } from './Components/Dashboard/department/department.component';
import { SocialmediaComponent } from './Components/Dashboard/socialmedia/socialmedia.component';

const routes: Routes = [

  {path : '', redirectTo : 'login', pathMatch : 'full'},
  {path : 'login' , component : LoginComponent},
  {path : 'forgetpass' , component : ForgetpassComponent},
  {path : 'confirmpass' , component : ConfirmpassComponent},

  {path : '' , component : LayoutComponent,
  children : [
      {path : '' , redirectTo : 'admin', pathMatch : 'full'},
      {path : 'admin' , component : AdminComponent , canActivate : [authGuard]},
      {path : 'user' , component : UserComponent , canActivate : [authGuard]},
      {path : 'branch' , component : BranchComponent , canActivate : [authGuard] },
      {path : 'company' , component : CompanyComponent , canActivate : [authGuard] },
      {path : 'product' , component : ProductComponent ,canActivate : [authGuard] },
      {path : 'advertisement' , component : AdvertisementComponent , canActivate : [authGuard]},
      {path : 'department' , component : DepartmentComponent , canActivate : [authGuard] },
      {path : 'social' , component : SocialmediaComponent , canActivate : [authGuard] },
      {path : 'order' , component : OrderComponent , canActivate : [authGuard] },
      {path : 'message' , component : MessageComponent , canActivate : [authGuard] }
    ],

  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
