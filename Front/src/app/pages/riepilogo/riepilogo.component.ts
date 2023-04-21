import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { getDayOfWeek } from 'ngx-bootstrap/chronos/units/day-of-week';

@Component({
  selector: 'app-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.scss']
})
export class RiepilogoComponent implements OnInit {
  constructor(public share: SharedModule) { }
  public nome: string;
  public telefono: string;
  public email: string;
  ngOnInit(): void {
    if (this.share.commonF.isEmpty(localStorage["cart"])) {
      this.share.go("");
    }
  }
  buttonCLick(): void {
    if (!this.share.commonF.isEmpty(this.nome) && !this.share.commonF.isEmpty(this.email)) {
      this.share.patchCarrello(this.nome, this.telefono, this.email);
      this.share.saveCart();
      this.share.go("payment");
    }
  }
}
