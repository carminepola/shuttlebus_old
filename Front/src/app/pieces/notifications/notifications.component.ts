import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { commonFunctionModule } from 'src/app/module/commonFunction/commonFunction.module';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(public share: SharedModule, public commonF: commonFunctionModule) { }

  ngOnInit() {
    setTimeout(() => {

    }, 1000);



  }


}
