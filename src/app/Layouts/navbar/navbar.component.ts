import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/Core/Services/Notify/notify.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  count : number = 0;
  constructor(private notify: NotifyService , private _router : Router) {
    this.notify.counter.subscribe({
      next: (res) => {
        this.count = res;
        console.log(res);

      },
      error: (err) => {
        console.error('Error :', err);
      }
    });

  }

  readNotification() {
    this.notify.readAllNotifications().subscribe({
      next: (res) => {
        console.log(res);
        this._router.navigate(['/notify']);
        this.notify.getCounter(0);
      },
      error: (err) => {
        console.error('Error :', err);
      }
    });
  }

  ngOnInit(): void {

  }

}
