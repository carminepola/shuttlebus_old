import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';

import { HomeComponent } from 'src/app/pages/home/home.component';

declare var $: any;
@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss']
})

export class HomeSearchComponent implements OnInit {

  constructor(public s: SharedModule, private rem: RemService) { }
  f: any = this.s.commonF;
  backup: any = { from: "", to: "" }

  ngOnInit() {
    try {
      debugger

      if (this.s.commonF.isEmpty(this.s.dati.from.value) || this.s.commonF.isEmpty(this.s.dati.to.value)) {
        if (localStorage["search"]) {
          setTimeout(() => {
            this.s.dati = JSON.parse(localStorage["search"]);
            this.s.dati.calendario.value = new Date(this.s.dati.calendario.value);
            this.s.initCalendario(this.s.dati.calendario.option);

            this.callRicerca();
          }, 500);

        }
        else {
          this.s.go("");
        }

      }
    }
    catch (ex) {
      console.error(ex);
    }


  }


  clickData(date, val) {

    var d = date;
    d.setDate(d.getDate() + val);
    this.s.dati.calendario.value = d;
    this.s.dati.calendario.valueView = this.s.commonF.convertData(d);
    if (this.f.isEmpty(this.s.dati.from.value)) {
      this.s.dati.from = this.f.clone(this.backup.from);


    }

    if (this.f.isEmpty(this.s.dati.to.value)) {
      this.s.dati.to = this.f.clone(this.backup.to);

    }


    this.callRicerca();
  }
  soluzioniBiglietti: any = [];

  bagaglioAggiungi(biglietto, numero, limiteMassimo) {


    if (biglietto + numero <= limiteMassimo && biglietto + numero >= 0) {
      biglietto = biglietto + numero;
    }

    return biglietto;
  }
  bigliettoAggiungi(biglietto, numero, limiteMassimo, lista) {

    var cont = 0;
    for (let i = 0; i < lista.length; i++) {
      cont += lista[i].numero;
    }
    if (cont == limiteMassimo && numero > 0) {
      return biglietto;
    }

    if (biglietto + numero <= limiteMassimo && biglietto + numero >= 0) {
      biglietto = biglietto + numero;
    }

    return biglietto;
  }
  costoBiglietti(fascia) {
    var lista = fascia.biglietti;
    var cont = 0;
    for (let i = 0; i < lista.length; i++) {
      cont += lista[i].numero * lista[i].costo;
    }
    cont += fascia.numeroBagagliOpzionali * fascia.prezzoBagagli;
    return cont;
  }
  numeroBiglietti(fascia) {
    var lista = fascia.biglietti;
    var cont = 0;
    for (let i = 0; i < lista.length; i++) {
      cont += lista[i].numero;
    }

    return cont;
  }

  callRicerca() {
    try {
      if (this.s.commonF.isEmpty(this.s.dati.from.id) || this.s.commonF.isEmpty(this.s.dati.to.id)) {
        return false;
      }
      this.s.dati.inRicerca = true;
      var d = this.s.dati;
      this.rem.search.searchLinee(d.from.id, d.to.id, d.persone, d.filtroOra, d.calendario.value).subscribe(
        data => {
          if (!this.s.catchEx(data["error"])) {
            this.s.dati.inRicerca = false;
            this.s.risultatiRicerca = data["data"];
            console.log(this.s.risultatiRicerca);
            this.s.problemiRicerca = data["error"]["info"];
            setTimeout(() => {
              this.s.commonF.scrollTo("cercato");
            }, 100);
          }
          else {
            this.s.dati.inRicerca = false;
            this.s.go("/404");
          }
        },
        error => {
          this.s.dati.inRicerca = false;
          sessionStorage["500"] = error["message"];
          this.s.go("/500");
        }
      );
    } catch (ex) {
      console.error(ex);
    }
  }
}
