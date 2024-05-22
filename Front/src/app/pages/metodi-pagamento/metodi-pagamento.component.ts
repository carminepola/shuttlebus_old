import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';

@Component({
  selector: 'app-metodi-pagamento',
  templateUrl: './metodi-pagamento.component.html',
  styleUrls: ['./metodi-pagamento.component.scss']
})
export class MetodiPagamentoComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }

  protected pageServices = this.rem.pagamenti;
  public ris: any;
  public data: any;
  protected codiceBiglietto: string;
  ngOnInit(): void {
    if (this.share.commonF.isEmpty(localStorage["cart"])) {
      this.share.go("");
    }
    else {
      this.carica();
    }
  }
  clickMetodo(metodo: string): void {
    try {
      switch (metodo) {
        case "private":
          this.share.go("checkpayment/private/" + this.codiceBiglietto);
          break;
        case "paypal":
          var url = ""
          debugger
          for (let i = 0; i < this.ris.data.length && this.share.commonF.isEmpty(url); i++) {
            if (this.ris.data[i]["chiave"] == metodo) {
              url = this.ris.data[i]["link"];
            }
          }
          window.open(url, "_self")

          break;
        case "stripe":
          var url = ""
          debugger
          for (let i = 0; i < this.ris.data.length && this.share.commonF.isEmpty(url); i++) {
            if (this.ris.data[i]["chiave"] == metodo) {
              url = this.ris.data[i]["link"];
            }
          }
          window.open(url, "_self")

          break;
      }

    }
    catch (ex) {
      console.error(ex.message);
    }
  }
  seEsisteMetodo(nomeMetodo: string): boolean {
    try {
      for (let i = 0; i < this.ris.data.length; i++) {
        if (this.ris.data[i].chiave == nomeMetodo) {
          return true;
        }
      }
      return false;
    }
    catch (ex) {
      console.error(ex.message);
    }

  }

  carica() {

    var a = JSON.parse(localStorage["cart"]);
    if (this.share.commonF.isEmpty(a.nome) || this.share.commonF.isEmpty(a.email)) {
      return this.share.go("checkout");
    }

    debugger
    localStorage["sessionID"] = this.share.commonF.NewGuid();
    localStorage["userSession"] = this.share.commonF.isEmpty(localStorage["userSession"]) ? this.share.commonF.NewGuid() : localStorage["userSession"];

    this.pageServices.get(localStorage["cart"], localStorage["sessionID"], localStorage["userSession"]).subscribe(
      data => {

        this.ris = data;
        console.log(data);
        if (!this.share.catchEx(data["error"])) {
          this.data = data["data"];
          this.codiceBiglietto = data["error"]["message"].toString();
        }
      },
      error => {
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }

}
