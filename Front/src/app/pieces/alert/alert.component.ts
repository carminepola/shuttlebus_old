import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';



@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],

})
export class AlertComponent implements OnInit {

  constructor(public share: SharedModule) { }

  ngOnInit() {
  }

}
