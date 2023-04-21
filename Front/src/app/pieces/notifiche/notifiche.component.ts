import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';

@Component({
  selector: 'app-notifiche',
  templateUrl: './notifiche.component.html',
  styleUrls: ['./notifiche.component.scss']
})
export class NotificheComponent implements OnInit {

  constructor(public share: SharedModule) { }

  ngOnInit() {
  }

}
