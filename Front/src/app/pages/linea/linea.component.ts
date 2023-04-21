import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from '@angular/router';
import { identifierModuleUrl } from '@angular/compiler';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import jsQR from "jsqr";
import { runInThisContext } from 'vm';
@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.scss']
})
export class LineaComponent implements OnInit {

  public dal = [];
  public al = [];
  public caricamento: boolean = true;
  public biglietti: any = [];
  public fermate: any = [];
  public fermataSelezionata: string = "";
  public bigliettoSelezionato: string = "";
  protected id: string;

  public guidNome: string = this.share.commonF.NewGuid();
  public guidDes: string = this.share.commonF.NewGuid();
  public GiornoDaAggiungere;
  public obj: any = {
    "id": 0,
    "nome": this.guidNome,
    "descrizione": this.guidDes,
    "traduzioniNome": [{ "nome": this.guidNome, "it": "", "en": "" }],
    "traduzioniDesc": [{ "nome": this.guidDes, "it": "", "en": "" }],
    "disattivato": false,
    "itinerario": [],
    "biglietti": [],
    "fasceOrarie": []
  }
  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute) { }

  async ngOnInit() {
    await this.caricaBiglietti();
    await this.caricaFermate(); this.route.params.subscribe((params) => this.id = params.id);
    if (!this.share.commonF.isEmpty(this.id)) {
      this.caricaLinea(this.id);
    }
    else {
      this.caricamento = false;
    }
  }
  caricaLinea(id) {
    this.rem.linee.get(this.id).subscribe(
      data => {

        console.log(data);
        if (!this.share.catchEx(data["error"])) {
          this.caricamento = false;
          this.obj = data["data"][0];

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
  caricaBiglietti() {
    return new Promise(resolve => {
      try {

        this.rem.biglietti.getBiglietti().subscribe(
          data => {

            if (!this.share.catchEx(data["error"])) {
              this.biglietti = data["data"];

            }
            resolve("ok");

          },
          error => {
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");
          }

        );

      } catch (ex) {
        console.error(ex.Messge);
        resolve("error");
      }
    });

  }
  caricaFermate() {
    return new Promise(resolve => {
      try {
        this.rem.fermate.get().subscribe(
          data => {


            if (!this.share.catchEx(data["error"])) {
              this.fermate = data["data"];
            }
            resolve("ok");

          },
          error => {

            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");
          }
        );

      } catch (ex) {
        console.error(ex.Messge);
        resolve("error");
      }
    });
  }
  aggiungiAdItinerario(index) {

    try {

      var tempFermata = this.fermate[index];
      var fermata = {
        "id": 0,
        "idFermata": tempFermata.id,
        "citta": tempFermata.citta,
        "indirizzo": tempFermata.indirizzo,
        "traduzioniCitta": tempFermata.traduzioniCitta
      }
      this.obj.itinerario.push(fermata);
      this.fermataSelezionata = "";
      this.resettaFasce();

    }
    catch (ex) {
      console.error(ex.message);
    }


  }
  resettaFasce() {
    if (this.obj.itinerario.length > 0) {
      for (var i = 0; i < this.obj.fasceOrarie.length; i++) {
        this.obj.fasceOrarie[i].orari = [];
        for (var j = 0; j < this.obj.itinerario.length; j++) {

          var orario = {
            "orario": "",
            "idFermata": this.obj.itinerario[j].idFermata,

          }
          this.obj.fasceOrarie[i].orari.push(orario);

        }

      }
    }
    else {
      this.obj.fasceOrarie = [];
    }
  }
  eliminaFascia() {

    this.obj.itinerario.pop();
    this.resettaFasce()
    this.dal.pop();
    this.al.pop();
  }
  toggleEccezione(i, giorno) {
    if (this.esisteEccezione(i, giorno)) {
      this.rimuoviEccezioneGiorno(i, giorno);
    }
    else {
      this.aggiungiEccezioneGiorno(i, giorno);
    }
  }
  esisteEccezione(iFascia, giorno) {
    for (var i = 0; i < this.obj.fasceOrarie[iFascia].eccezioni.length; i++) {
      if (giorno == this.obj.fasceOrarie[iFascia].eccezioni[i].chiusura) {
        return true;
      }
    }
    return false;
  }
  aggiungiEccezioneData(iFascia, data) {
    var eccezione = {
      "id": "0",
      "chiusura": '',
      "data": data,
      'tipo': 'DATA'
    }
    this.GiornoDaAggiungere = "";
    this.obj.fasceOrarie[iFascia].eccezioni.push(eccezione);
  }
  rimuoviEccezioneData(iFascia, index) {
    var a = [];
    for (var i = 0; i < this.obj.fasceOrarie[iFascia].eccezioni.length; i++) {
      if (i != index) {
        a.push(this.obj.fasceOrarie[iFascia].eccezioni[i]);
      }
    }
    this.obj.fasceOrarie[iFascia].eccezioni = a;
  }
  aggiungiEccezioneGiorno(iFascia, giorno) {
    var eccezione = {
      "id": "0",
      "chiusura": giorno,
      "data": '',
      'tipo': 'GIORNO'
    }
    this.obj.fasceOrarie[iFascia].eccezioni.push(eccezione);
  }

  rimuoviEccezioneGiorno(iFascia, giorno) {

    var a = [];
    for (var i = 0; i < this.obj.fasceOrarie[iFascia].eccezioni.length; i++) {
      if (giorno != this.obj.fasceOrarie[iFascia].eccezioni[i].chiusura) {
        a.push(this.obj.fasceOrarie[iFascia].eccezioni[i]);
      }
    }
    this.obj.fasceOrarie[iFascia].eccezioni = a;

  }
  aggiungiArcoTemporale(iFascia) {
    this.obj.fasceOrarie[iFascia].apertura.push({
      "da": "",
      "a": ""
    })
  }
  rimuoviArcoTemporale(iFascia, index) {
    var a = [];
    for (var i = 0; i < this.obj.fasceOrarie[iFascia].apertura.length; i++) {
      if (i != index) {
        a.push(this.obj.fasceOrarie[iFascia].apertura[i]);
      }
    }
    this.obj.fasceOrarie[iFascia].apertura = a;
  }
  aggiungiBiglietto(id) {

    var check = false;
    for (var i = 0; i < this.biglietti.length && check == false; i++) {
      if (this.biglietti[i].id == id) {
        check = true;
        var a = Object.assign({}, this.biglietti[i]);
        this.obj.biglietti.push(a);
      }
    }
    this.bigliettoSelezionato = "";

  }
  rimuoviBiglietto(id) {
    if (!this.share.commonF.isEmpty(id)) {
      var a = [];
      for (var i = 0; i < this.obj.biglietti.length; i++) {

        if (id != this.obj.biglietti[i].id) {
          a.push(this.obj.biglietti[i]);
        }
      }
      this.obj.biglietti = a;
    }
  }


  bigliettoEsiste(id) {
    for (var i = 0; i < this.obj.biglietti.length; i++) {

      if (id == this.obj.biglietti[i].id) {
        return true;
      }
    }
    return false;

  }
  listaBiglietti() {
    var a = [];

    for (var i = 0; i < this.biglietti.length; i++) {
      var check = false;
      for (var j = 0; j < this.obj.biglietti.length && check == false; j++) {
        if (this.biglietti[i].id == this.obj.biglietti[j].id) {
          check = true;

        }

      }
      if (!check) {
        a.push(this.biglietti[i]);
      }
    }
    return a;
  }
  rimuoviFascia(idFascia) {
    var a = [];
    for (var i = 0; i < this.obj.fasceOrarie.length; i++) {
      if (i != idFascia) {
        a.push(this.obj.fasceOrarie[i]);
      }
    }
    this.obj.fasceOrarie = a;

  }
  aggiungiFascia() {
    var fascia = {
      "guid": this.share.commonF.NewGuid(),
      "apertura": [
        {
          "da": "",
          "a": ""
        }
      ],
      "eccezioni": [

      ],
      "settings": [
        {
          "disattivato": false,
          "posti": 0,
          "bagagli": 0,
          "bagagliOpzionali": 0,
          "prezzoBagagli": 0
        }
      ],
      "orari": [

      ]
    };

    for (var i = 0; i < this.obj.itinerario.length; i++) {

      var orario = {
        "orario": "09:00",
        "idFermata": this.obj.itinerario[i].idFermata,

      }
      fascia.orari.push(orario);


    }
    this.dal.push("");
    this.al.push("");
    console.log(this.dal)
    this.obj.fasceOrarie.push(fascia);


  }


  checkObj() {
    var alert = {
      'testo': "",
      'tipo': "alert-warning",
      'delay': 3000
    }
    try {
      var o = this.obj;
      var f = this.share.commonF;
      if (f.isEmpty(o.traduzioniNome[0].it)) {
        throw "Form non valido al campo nome";
      }
      if (o.itinerario.length <= 1) {
        throw "Devi aggiungere almeno due elementi all'itinerario"
      }
      if (o.fasceOrarie.length == 0) {
        throw "Devi aggiungere almeno una fascia oraria";
      }
      debugger
      for (var i = 0; i < o.fasceOrarie.length; i++) {

        for (var j = 0; j < o.fasceOrarie[i].apertura.length; j++) {

          if (f.isEmpty(o.fasceOrarie[i].apertura[j].da) || f.isEmpty(o.fasceOrarie[i].apertura[j].a)) {

            throw "Tutte le date di apertura devono essere compilate"
          }

        }



      }

    }
    catch (ex) {
      console.log(ex);
      alert.testo = ex;
      this.share.alert.generateAlert(alert)
      return false;
    }


    return true;



  }

  salva() {

    if (this.checkObj()) {


      this.share.aggiungiCaricamentoElemento("linea", "salva");


      console.log(JSON.stringify(this.obj));
      if (this.share.commonF.isEmpty(this.id)) {
        this.rem.linee.post(this.obj).subscribe(
          data => {

            console.log(data);
            this.share.rimuvoiCaricamentoElemento("linea", "salva");
            if (!this.share.catchEx(data["error"])) {
              this.share.go("linee");
            }
          },
          error => {
            this.share.rimuvoiCaricamentoElemento("linea", "salva");
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");

          }
        )
      }
      else {
        this.rem.linee.put(this.obj).subscribe(
          data => {

            console.log(data);

            this.share.rimuvoiCaricamentoElemento("linea", "salva");
            if (!this.share.catchEx(data["error"])) {
              this.share.go("linee");
            }
          },
          error => {
            this.share.rimuvoiCaricamentoElemento("linea", "salva");
            this.share.removeLoad();
            sessionStorage["500"] = error["message"];
            this.share.go("/500");

          }
        );
      }
    }

  }


}
