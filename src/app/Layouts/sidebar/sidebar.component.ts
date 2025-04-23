import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private _router:Router){}

  links = [
    { url: '/admin', name: 'Admin' },
    { url: '/user', name: 'User' },
    { url: '/branch', name: 'Branch' },
    { url: '/product', name: 'Product' },
    { url: '/store', name: 'Store' },
    { url: '/order', name: 'Order' },
    { url: '/social', name: 'Social Media' },
    { url: '/message', name: 'Message' },
    { url: '/advertisement', name: 'Advertisement' },
    { url: '/department', name: 'Department' },
  ]

  Logout() {
    // localStorage.removeItem('token');
    localStorage.clear();
    this._router.navigate(['/login']);
  }

}
