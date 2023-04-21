import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-admin-faq',
  templateUrl: './admin-faq.component.html',
  styleUrls: ['./admin-faq.component.scss']
})
export class AdminFaqComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute) { }
  public caricamento = true;
  public id: any;
  public ris: any;
  public obj = { "id": 0, "domandaIT": "", "domandaEN": "", "rispostaIT": "", "rispostaEN": "" };
  public data: any;
  public foto: string;
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
    if (this.share.commonF.isEmpty(this.obj.domandaIT) || this.share.commonF.isEmpty(this.obj.domandaEN)) {
      var alert = {

        'testo': "Compila domanda e risposta in italiano",
        'tipo': "alert-danger",
        'delay': 3000

      }
      this.share.alert.generateAlert(alert)
      this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');
      return false;
    }
    try {

      if (this.share.commonF.isEmpty(this.id)) {
        this.rem.faq.post(this.obj).subscribe(
          data => {

            this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');

            this.ris = data;
            console.log(data);
            if (!this.share.catchEx(data["error"])) {

              this.share.go("listafaq");

            }


          },
          error => {
            this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");


          }

        );
      }
      else {
        this.rem.faq.put(this.obj).subscribe(
          data => {

            this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');

            this.ris = data;
            console.log(data);
            if (!this.share.catchEx(data["error"])) {

              this.share.go("listafaq");

            }


          },
          error => {
            this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");


          }

        );
      }




    } catch (ex) {
      this.share.rimuvoiCaricamentoElemento('traduzioni', 'salva');
      console.log(ex);
    }

  }
  carica() {
    try {
      this.rem.faq.get(this.id).subscribe(
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
