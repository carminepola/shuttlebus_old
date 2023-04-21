import { Component, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { SharedModule } from 'src/app/module/shared/shared.module';

import { RemService } from 'src/app/services/REM/rem.service';
import { identifierModuleUrl } from '@angular/compiler';
import { ActivatedRoute } from "@angular/router";
import { type } from 'os';
import { FooterComponent } from 'src/app/pieces/footer/footer.component';



@Component({
  selector: 'app-fermate',
  templateUrl: './fermate.component.html',
  styleUrls: ['./fermate.component.scss']
})
export class FermateComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute) { }
  public caricamento = true;
  private citta = this.share.commonF.NewGuid();
  private note = this.share.commonF.NewGuid();
  public id: any;
  public ris;
  public erroreFoto = false;
  public caricaFile = false;
  public posizione: any = {
    lat: "",
    lng: "",
    latlng: "",
    indirizzo: "",
    trovato: false
  };
  public obj = {
    "id": 0,
    "citta": this.citta,
    "note": this.note,
    "indirizzo": "",
    "foto": "",
    "lat": "",
    "lng": "",
    "traduzioniCitta": [
      {

        "nome": this.citta,
        "it": "",
        "en": ""
      }
    ],
    "traduzioniNote": [
      {

        "nome": this.note,
        "it": "",
        "en": ""
      }
    ]
  }

  ngOnInit() {


    this.route.params.subscribe((params) => this.id = params.id);
    if (!this.share.commonF.isEmpty(this.id)) {
      this.carica();
    }
    else {
      this.caricamento = false;

    }
  }

  fileCheck(file, typeCheck) {


    var split = file.type.split("/");
    if (split.length > 1) {
      if (split[0] == typeCheck) {
        return true;
      }
    }

    return false;




  }

  fileChange(element) {
    this.caricaFile = true;
    this.erroreFoto = false;
    var uploadedFiles = element.target.files;
    var file = uploadedFiles[0];
    console.log(uploadedFiles);


    if (this.fileCheck(file, "image")) {



      this.rem.upload.post(uploadedFiles).subscribe(
        data => {
          this.caricaFile = false;
          console.log(data);
          if (!this.share.catchEx(data["error"])) {

            this.obj.foto = data["data"][0];


          }
          else {

            this.erroreFoto = true;
          }

        },
        error => {
          this.share.removeLoad();
          this.caricaFile = false;
          this.erroreFoto = true;
        }
      );

    }
    else {
      this.erroreFoto = true;
    }

  }
  carica() {
    this.rem.fermate.get(this.id).subscribe(
      data => {
        this.ris = data;
        console.log(data);
        if (!this.share.catchEx(data["error"])) {
          this.caricamento = false;
          this.obj = data["data"][0];
          this.posizione.trovato = true;
          console.log(this.obj)

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
  public indirizzoValido = false;
  async updateIndirizzo() {
    this.share.aggiungiCaricamentoElemento("fermata", "button");
    this.posizione = {
      lat: "",
      lng: "",
      latlng: "",
      indirizzo: "",
      trovato: false
    };
    await this.share.getCoordinate(this.obj.indirizzo).then(value => {
      this.posizione = value;

      this.share.rimuvoiCaricamentoElemento("fermata", "button");
      if (this.posizione["trovato"]) {

        this.obj.indirizzo = this.posizione["indirizzo"];
        this.indirizzoValido = true;
        this.obj.lat = this.posizione["lat"];
        this.obj.lng = this.posizione["lng"];


      }

    });



  }


  salva(f) {

    this.share.aggiungiCaricamentoElemento("fermata", "salva");

    if (f.valid && this.posizione["trovato"]) {

      if (this.share.commonF.isEmpty(this.id)) {
        this.rem.fermate.post(this.obj).subscribe(
          data => {

            console.log(data);
            this.share.rimuvoiCaricamentoElemento("fermata", "salva");
            if (!this.share.catchEx(data["error"])) {
              this.share.go("fermate");
            }
          },
          error => {
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");

          }
        )
      }
      else {
        this.rem.fermate.put(this.obj).subscribe(
          data => {

            console.log(data);

            this.share.rimuvoiCaricamentoElemento("fermata", "salva");
            if (!this.share.catchEx(data["error"])) {
              this.share.go("fermate");
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
      this.share.rimuvoiCaricamentoElemento("fermata", "salva");
    }



  }


}
