import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';

@Component({
  selector: 'app-carrello-icon',
  templateUrl: './carrello-icon.component.html',
  styleUrls: ['./carrello-icon.component.scss']
})
export class CarrelloIconComponent implements OnInit {

  constructor(public s: SharedModule) { }

  ngOnInit() {
  }

}
