import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Auth/login/login.component';
import { AdminComponent } from './Components/Dashboard/admin/admin.component';
import { AdvertisementComponent } from './Components/Dashboard/advertisement/advertisement.component';
import { CompanyComponent } from './Components/Dashboard/company/company.component';
import { ProductComponent } from './Components/Dashboard/product/product.component';
import { LayoutComponent } from './Layouts/layout/layout.component';
import { NavbarComponent } from './Layouts/navbar/navbar.component';
import { SidebarComponent } from './Layouts/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgetpassComponent } from './Components/Auth/forgetpass/forgetpass.component';
import { ConfirmpassComponent } from './Components/Auth/confirmpass/confirmpass.component';
import { AuthInterceptor } from './Core/Interceptor/Auth/auth.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptor } from './Core/Interceptor/Loading/spinner.interceptor';
import { OrderComponent } from './Components/Dashboard/order/order.component';
import { UserComponent } from './Components/Dashboard/user/user.component';
import { BranchComponent } from './Components/Dashboard/branch/branch.component';
import { MessageComponent } from './Components/Dashboard/message/message.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DepartmentComponent } from './Components/Dashboard/department/department.component';
import { SocialmediaComponent } from './Components/Dashboard/socialmedia/socialmedia.component';
import { DetailsproforstoreComponent } from './Components/Dashboard/detailsproforstore/detailsproforstore.component';
import { WoodComponent } from './Components/Dashboard/wood/wood.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    AdvertisementComponent,
    CompanyComponent,
    ProductComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    ForgetpassComponent,
    ConfirmpassComponent,
    OrderComponent,
    UserComponent,
    BranchComponent,
    MessageComponent,
    DepartmentComponent,
    SocialmediaComponent,
    DetailsproforstoreComponent,
    WoodComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true},
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
