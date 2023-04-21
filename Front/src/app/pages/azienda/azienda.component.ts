import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';

@Component({
  selector: 'app-azienda',
  templateUrl: './azienda.component.html',
  styleUrls: ['./azienda.component.scss']
})
export class AziendaComponent implements OnInit {

  constructor(public share: SharedModule) { }

  ngOnInit() {
  }

}
