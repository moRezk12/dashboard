import { Component, OnInit } from '@angular/core';
import { NotifyService } from './Core/Services/Notify/notify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dashboard';

  constructor(private notify : NotifyService){}
  ngOnInit(): void {

    this.notify.getNotif().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('Error :', err);
      }
    });

    this.notify.getNotif().subscribe({
      next: (res) => {

        const unreadCount = res.notifications.filter((n : any) => !n.isRead).length;
        this.notify.getCounter(unreadCount);
        
      },
      error: (err) => {
        console.error('Error :', err);
      }
    });

  }


}
