import { Component, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from 'src/app/module/shared/shared.module';

import { RemService } from 'src/app/services/REM/rem.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';


declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }

  locales = listLocales();

  public minDate = new Date();
  public searchComponent = false;



  fromOutsideClick() {

    setTimeout(() => {
      if (this.share.commonF.isEmpty(this.share.dati.from.id)) {
        if (!this.share.commonF.isEmpty(this.share.dati.from.value)) {

          for (let i = 0; i < this.share.dati.from.option.length; i++) {

            var stringa = this.share.traduciPrivato(this.share.dati.from.option[i].traduzioniCitta, this.share.dati.from.option[i].citta).toLowerCase()
            var index = stringa.indexOf(this.share.dati.from.value.toLowerCase());

            if (index >= 0) {
              this.share.dati.from.value = this.share.traduciPrivato(this.share.dati.from.option[i].traduzioniCitta, this.share.dati.from.option[i].citta);
              this.share.dati.from.id = this.share.dati.from.option[i].id;
              this.share.dati.from.backup = this.share.dati.from.option[i];
              this.searchTo();
              return true;
            }
          }
        }
        this.share.dati.from.value = "";
      }
      else {
        for (let i = 0; i < this.share.dati.from.option.length; i++) {
          if (this.share.dati.from.option[i].id == this.share.dati.from.id)
            if (this.share.traduciPrivato(this.share.dati.from.option[i].traduzioniCitta, this.share.dati.from.option[i].citta) == this.share.dati.from.value) {
              return true;
            }
            else {

              this.share.dati.from.value = "";
              this.share.dati.from.id = "";
              this.share.dati.to.option = this.share.primoTo;
              return false;
            }
        }
      }
    }, 250);


  }
  toOutsideClick() {
    if (this.share.commonF.isEmpty(this.share.dati.to.id)) {
      if (!this.share.commonF.isEmpty(this.share.dati.to.value)) {

        for (let i = 0; i < this.share.dati.to.option.length; i++) {

          var stringa = this.share.traduciPrivato(this.share.dati.to.option[i].traduzioniCitta, this.share.dati.to.option[i].citta).toLowerCase()
          var index = stringa.indexOf(this.share.dati.to.value.toLowerCase());

          if (index >= 0) {
            this.share.dati.to.value = this.share.traduciPrivato(this.share.dati.to.option[i].traduzioniCitta, this.share.dati.to.option[i].citta);
            this.share.dati.to.id = this.share.dati.to.option[i].id;
            this.share.dati.to.backup = this.share.dati.to.option[i];
            this.searchFrom();
            return true;
          }


        }

      }

      this.share.dati.to.value = "";




    }
    else {
      for (let i = 0; i < this.share.dati.to.option.length; i++) {
        if (this.share.dati.to.option[i].id == this.share.dati.to.id)
          if (this.share.traduciPrivato(this.share.dati.to.option[i].traduzioniCitta, this.share.dati.to.option[i].citta) == this.share.dati.to.value) {
            return true;
          }
          else {
            this.share.dati.to.value = "";
            this.share.dati.to.id = "";
            this.share.dati.from.option = this.share.primoFrom;
            return false;
          }
      }

    }


  }
  ngOnInit() {

   
    if (this.share.samePath('search')) {
      this.share.initCalendario(this.share.dati.calendario.option);
      this.searchComponent = true;
    }
    else {
      this.share.datiReset();



      this.share.primoFrom = [];
      this.share.primoTo = [];
      this.searchComponent = false;
      this.caricaFrom();
      this.caricaTo();
    }




  }

  onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
        const { cell, isHovered } = hoverEvent;

        if ((isHovered &&
          !!navigator.platform &&
          /iPad|iPhone|iPod|Apple/.test(navigator.platform)) &&
          'ontouchstart' in window
        ) {
            (this.share.dati.calendario.value as any)._datepickerRef.instance.daySelectHandler(cell);
        }

        return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
}
  prova() {

    alert("ddd");
  }



  caricaTo() {
    this.share.dati.to.loading = true;

    this.rem.search.getTo().subscribe(
      data => {



        if (!this.share.catchEx(data["error"])) {

          this.share.dati.to.loading = false;
          var dat = data["data"].sort();
          this.share.dati.to.option = dat;

          this.share.primoTo = dat;


        }
        else {
          this.share.dati.from.loading = false;
          this.share.go("/404");
        }
      },
      error => {
        this.share.dati.from.loading = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }
  caricaFrom() {
    this.share.dati.from.loading = true;

    this.rem.search.getFrom().subscribe(
      data => {
        if (!this.share.catchEx(data["error"])) {
          this.share.dati.from.loading = false;
          var dat = data["data"].sort();
          this.share.dati.from.option = dat;
          this.share.primoFrom = dat;

        }
        else {
          this.share.dati.from.loading = false;
          this.share.go("/404");
        }
      },
      error => {
        this.share.dati.from.loading = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }

  searchFrom() {
debugger
    if (!this.share.commonF.isEmpty(this.share.dati.from.id) && !this.share.commonF.isEmpty(this.share.dati.to.id)) {
      this.searchData(this.share.dati.from.id, this.share.dati.to.id);

    }
    else {
      this.share.initCalendario('');
    }

    if (this.share.commonF.isEmpty(this.share.dati.to.id)) {

      return false;
    }


    this.share.dati.from.loadingOnly = true;





    this.rem.search.searchFrom(this.share.dati.to.id).subscribe(
      data => {


        debugger
        if (!this.share.catchEx(data["error"])) {
          this.share.dati.from.loadingOnly = false;
          var dat = data["data"].sort();
          this.share.dati.from.option = dat;


          if (this.share.commonF.isEmpty(this.share.dati.from.value)) {
            setTimeout(() => {
              $("#dropdownMenuButton").focus();
            }, 100);

          }


        }
        else {
          this.share.dati.from.loadingOnly = false;
          this.share.go("/404");
        }
      },
      error => {
        this.share.dati.from.loadingOnly = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }

  searchData(da, a) {

    this.share.dati.calendario.loadingOnly = true;
    this.rem.search.searchData(da, a).subscribe(
      data => {
        if (!this.share.catchEx(data["error"])) {

          this.share.dati.calendario.loadingOnly = false;
          var dat = data["data"].sort();
          this.share.dati.calendario.option = dat;


          this.share.initCalendario(this.share.dati.calendario.option);

        }
        else {
          this.share.dati.calendario.calendario = false;
          this.share.go("/404");
        }
      },
      error => {
        this.share.dati.calendario.calendario = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }
  orderFunction(a, b) {
    debugger
    var aName = this.share.traduciPrivato(a.traduzioniCitta, a.citta);
    var bname = this.share.traduciPrivato(b.traduzioniCitta, b.citta);
    return a < b;
  }
  searchTo() {
    debugger
    if (!this.share.commonF.isEmpty(this.share.dati.from.id) && !this.share.commonF.isEmpty(this.share.dati.to.id)) {
      this.searchData(this.share.dati.from.id, this.share.dati.to.id);

    }
    else {
      this.share.initCalendario('');
    }
    if (this.share.commonF.isEmpty(this.share.dati.from.id)) {
      this.share.initCalendario('');
      return false;
    }



    this.share.dati.to.loadingOnly = true;
    this.rem.search.searchTo(this.share.dati.from.id).subscribe(
      data => {
        if (!this.share.catchEx(data["error"])) {

          this.share.dati.to.loadingOnly = false;

          var dat = data["data"].sort(this.share.sortBy(this.share.getLenguage(), 'asc'));
          this.share.dati.to.option = dat;


          if (this.share.commonF.isEmpty(this.share.dati.to.value)) {
            setTimeout(() => {
              $("#dropdownMenuButtonb").focus();
            }, 100);

          }
          else {
            setTimeout(() => {
              $("#data").focus();
            }, 100);
          }



        }
        else {
          this.share.dati.from.loadingOnly = false;
          this.share.go("/404");
        }
      },
      error => {
        this.share.dati.from.loadingOnly = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }



  provaClick(){
    alert("ok");
  }

  cerca() {
    try {
      this.share.dati.from.valueView = this.share.dati.from.value;
      this.share.dati.to.valueView = this.share.dati.to.value;
      this.share.dati.calendario.valueView = this.share.commonF.convertData(this.share.dati.calendario.value);
      this.callRicerca();
      localStorage["search"] = JSON.stringify(this.share.dati);
      if (!this.share.samePath('search')) {
        this.share.go("search");

      }


    } catch (ex) {
      console.error(ex);
    }
  }

  callRicerca() {
    try {

      if (this.share.commonF.isEmpty(this.share.dati.from.id) || this.share.commonF.isEmpty(this.share.dati.to.id)) {
        return false;
      }
      this.share.dati.inRicerca = true;
      var d = this.share.dati;

      this.rem.search.searchLinee(d.from.id, d.to.id, d.persone, d.filtroOra, d.calendario.value).subscribe(
        data => {
          if (!this.share.catchEx(data["error"])) {
            this.share.dati.inRicerca = false;
            this.share.risultatiRicerca = data["data"];
            this.share.problemiRicerca = data["error"]["info"];
          }
          else {
            this.share.dati.inRicerca = false;
            this.share.go("/404");
          }
        },
        error => {
          this.share.dati.inRicerca = false;
          sessionStorage["500"] = error["message"];
          this.share.go("/500");
        }
      );
    } catch (ex) {
      console.error(ex);
    }
  }


}
