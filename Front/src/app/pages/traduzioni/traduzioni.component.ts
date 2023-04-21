import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-traduzioni',
  templateUrl: './traduzioni.component.html',
  styleUrls: ['./traduzioni.component.scss']
})
export class TraduzioniComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute) { }
  public caricamento = true;
  public id: any;
  public ris: any;
  public obj = { id: 0, parola: "", it: "", en: "" };
  public data: any;
  ngOnInit() {

    this.route.params.subscribe((params) => this.id = params.id);
    if (!this.share.commonF.isEmpty(this.id)) {
      this.carica();
    }
    else {
      this.caricamento = false;

    }
  }
  salva() {
    debugger
    this.share.aggiungiCaricamentoElemento('traduzioni', 'salva');
    if (this.share.commonF.isEmpty(this.obj.parola)) {
      var alert = {

        'testo': "Compila almeno il campo nome",
        'tipo': "alert-danger",
        'delay': 3000

      }
      this.share.alert.generateAlert(alert)
      this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');
      return false;
    }
    try {

      this.rem.traduzioniService.salvaParola(this.obj).subscribe(
        data => {

          this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');

          this.ris = data;
          console.log(data);
          if (!this.share.catchEx(data["error"])) {

            this.share.go("traduzioni");

          }


        },
        error => {
          this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');
          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );



    } catch (ex) {
      this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');
      console.log(ex);
    }

  }
  carica() {
    try {
      this.rem.traduzioniService.getParola(this.id).subscribe(
        data => {


          this.caricamento = false;
          this.ris = data;
          console.log(data);
          if (!this.share.catchEx(data["error"])) {

            this.data = data["data"];
            this.obj = this.data[0];

          }


        },
        error => {
          this.caricamento = false;
          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );
    } catch (ex) {
      console.log(ex);
    }

  }


}
