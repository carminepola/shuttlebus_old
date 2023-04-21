import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { SharedModule } from 'src/app/module/shared/shared.module';

import { RemService } from 'src/app/services/REM/rem.service';
import { identifierModuleUrl } from '@angular/compiler';
import { ActivatedRoute } from "@angular/router";




@Component({
  selector: 'app-biglietto',
  templateUrl: './biglietto.component.html',
  styleUrls: ['./biglietto.component.scss']
})
export class BigliettoComponent implements OnInit {

  public caricamento = true;
  private nome = this.share.commonF.NewGuid();
  private des = this.share.commonF.NewGuid();
  public biglietto = {
    "id": 0,
    "nome": this.nome,
    "descrizione": this.des,
    "costo": 0,
    "traduzioniNome": [
      {

        "nome": this.nome,
        "it": "",
        "en": ""
      }
    ],
    "traduzioniDesc": [
      {

        "nome": this.des,
        "it": "",
        "en": ""
      }
    ]
  }
  public testo: any = "ttt";
  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute) { }

  public ris;
  id: string;
  private sub: any;

  ngOnInit() {


    this.route.params.subscribe((params) => this.id = params.id);


    if (!this.share.commonF.isEmpty(this.id)) {
      this.caricaBiglietto();
    }
    else {
      this.caricamento = false;
    }




  }




  caricaBiglietto() {


    if (this.share.commonF.isEmpty(this.id)) {
      this.id = "0";
    }

    this.rem.biglietti.getBiglietto(this.id).subscribe(
      data => {



        this.ris = data;
        console.log(data);
        if (!this.share.catchEx(data["error"])) {



          this.caricamento = false;
          this.biglietto = data["data"][0];
          console.log(this.biglietto)


        }
        else {
          this.share.removeLoad();

          this.share.go("/404");

        }


      },
      error => {

        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      }

    );
  }
  salva(f) {

    this.share.aggiungiCaricamentoElemento("salva", "biglietti");

    if (f.valid) {

      if (this.share.commonF.isEmpty(this.id)) {
        this.rem.biglietti.postBiglietto(this.biglietto).subscribe(
          data => {

            console.log(data);
            this.share.rimuvoiCaricamentoElemento("salva", "biglietti");
            if (!this.share.catchEx(data["error"])) {
              this.share.go("biglietti");
            }
          },
          error => {
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");

          }
        );
      }
      else {
        this.rem.biglietti.putBiglietto(this.biglietto).subscribe(
          data => {

            console.log(data);

            this.share.rimuvoiCaricamentoElemento("salva", "biglietti");
            if (!this.share.catchEx(data["error"])) {
              this.share.go("biglietti");
            }
          },
          error => {
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");

          }
        );
      }


    }
    else {
      this.share.rimuvoiCaricamentoElemento("salva", "biglietti");
    }



  }



}
