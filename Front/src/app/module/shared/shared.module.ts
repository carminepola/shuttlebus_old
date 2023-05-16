import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { commonFunctionModule } from "../commonFunction/commonFunction.module";
import { AlertsModule } from "./alert.module";
import { NotificationsModule } from "./notifications.module";
import { Router, ActivatedRoute } from "@angular/router";
import { isEmptyExpression, IfStmt } from "@angular/compiler";
import _regex from "@devmin/regex/regex.js";

import { RemService } from "src/app/services/REM/rem.service";
import { stringify } from "querystring";
import { environment } from "../../../environments/environment";
import { SEOService } from "src/app/services/seo/seo.service";
import { isGeneratedFile } from "@angular/compiler/src/aot/util";
declare const google: any;
declare var $: any;
@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class SharedModule {
  //Variabili
  /*Contine le informazioni della pagina corrente*/
  public disabledDates = [];
  public _isDevMod = false; //metti false in produzione

  protected _apiVersion = "/api/1.0/"; //posizione api.
  protected isNotLocal = false; //se l'api non si trova sullo stesso server
  protected isNotUrl = "https://shuttlebus.pintourbus.com/api/1.0/"; //url dell'api
  //protected devApi = "https://pintour.servernas.it/api/1.0/";
  //protected devApi = "";
  protected devApi = "https://localhost:5001/";
  //protected devApi = " https://shuttlebus.pintourbus.com/api/1.0/"
  protected positionImage = "public/";
  public regex = _regex;
  protected _dictionary;
  protected _dataRoute = [];
  protected _lenguage = "";

  protected isPhone = false;

  protected _carrello: any = {
    prezzo: 0,
    nome: "",
    telefono: "",
    email: "",
    elementi: [],
  };

  protected _countLoading = 0;
  protected _elementoLoading = [];
  protected _lenguagesList = [
    {
      lng: "it-it",
      shortLng: "it",
      lenguage: "Italiano",
    },
    {
      lng: "en-en",
      shortLng: "en",
      lenguage: "English",
    },
  ];
  protected _navbar = { show: false, trasparent: false };
  protected _footer = { show: false, trasparent: false };
  public pagina = {
    altezza: window.innerHeight,
    larghezza: window.innerWidth,
    altezzaContenuto: "",
  };
  //End variabili
  public constructor(public commonF: commonFunctionModule, public notifiche: NotificationsModule, public alert: AlertsModule, public router: Router) {}
  /**
   * Ritorna la lista di parametri in Data sulla pagina app-routing
   */

  public problemiRicerca: any;
  public risultatiRicerca: any;

  public primoTo = [];
  public primoFrom = [];
  public dati: any = {
    from: {
      id: "",
      value: "",
      valueView: "",
      option: [],
      search: "",
      loading: true,
      loadingOnly: false,
    },
    to: {
      id: "",
      value: "",
      valueView: "",
      option: [],
      search: "",
      loading: true,
      loadingOnly: false,
    },
    calendario: {
      value: new Date(),
      valueView: "",
      option: [],
      search: "",
      loading: false,
      loadingOnly: false,
    },
    persone: 1,
    filtroOra: 0,
    inRicerca: false,
  };
  public datiReset() {
    this.dati = {
      from: {
        id: "",
        value: "",
        valueView: "",
        option: [],
        search: "",
        loading: true,
        loadingOnly: false,
      },
      to: {
        id: "",
        value: "",
        valueView: "",
        option: [],
        search: "",
        loading: true,
        loadingOnly: false,
      },
      calendario: {
        value: new Date(),
        valueView: "",
        option: [],
        search: "",
        loading: false,
        loadingOnly: false,
      },
      persone: 1,
      filtroOra: 0,
      inRicerca: false,
    };
  }
  public setDevMode(valore: boolean) {
    this._isDevMod = valore;
  }
  public provaPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("ok");
      }, 2000);
    });
  }

  public getCoordinate(indirizzo: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        var risposta = {
          lat: "",
          lng: "",
          latlng: "",
          indirizzo: "",
          trovato: false,
        };
        try {
          if (!this.commonF.isEmpty(indirizzo)) {
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ address: indirizzo }, function (results, status) {
              if (status === "OK") {
                risposta.lat = results[0].geometry.location.lat();
                risposta.lng = results[0].geometry.location.lng();
                risposta.latlng = results[0].geometry.location.lat() + ", " + results[0].geometry.location.lng();
                risposta.indirizzo = results[0].formatted_address;
                risposta.trovato = true;
              } else {
                console.log("errore maps");
              }
              resolve(risposta);
            });
          } else {
            resolve(risposta);
          }
        } catch (ex) {
          console.log(ex.message);
        }
      }, 2000);
    });
  }

  public dataFromRoute(route: any, location: string) {
    try {
      if (this.commonF.isEmpty(route)) {
        throw "Invalid paramas";
      } else {
        var confrontaLocation = "";
        for (var i = 0; i < route.length; i++) {
          confrontaLocation = "";

          var lng = false;
          var path = "";
          if (route[i].path.includes(":lng/")) {
            path = route[i].path.replace(":lng/", "");
            lng = true;
          }

          path = route[i].path.split("/");
          if (path.length > 1) {
            path = path[1];
          } else {
            path = path[0];
          }

          if (!this.commonF.isEmpty(location)) {
            var loc = location.split("/");
            if (loc.length > 1) {
              if (loc[1].length == 2 && loc.length > 2) {
                confrontaLocation = loc[2];
              } else {
                confrontaLocation = loc[1];
              }
            }
          } else {
            confrontaLocation = "";
          }
          if (path == confrontaLocation) {
            this._dataRoute = route[i].data;
            return this._dataRoute;
          }
        }
        this._dataRoute = [];
        return this._dataRoute;
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }
  public getDataFromRoute() {
    return this._dataRoute;
  }

  public samePath(path) {
    if (path == this.getLocation()) {
      return true;
    }
    return false;
  }

  public getAccessoRichiesto() {
    return this._dataRoute["richiedeAccesso"];
  }
  public getLocation() {
    var ris = "";
    var location = this.router.url;
    var loc = location.split("/");
    if (loc.length > 1) {
      if (loc[1].length == 2) {
        ris = loc[2];
      } else {
        ris = loc[1];
      }
    }
    return ris;
  }

  /**
   *  Cambia pagina
   */
  public go(path) {
    if (!this.commonF.isEmpty(path)) {
      this.router.navigate([path]);
    } else {
      this.router.navigate([""]);
    }
  }
  public goPath(path) {
    if (this.commonF.isEmpty(path)) {
      this.router.navigate([""]);
    } else {
      this.router.navigate(path);
    }
  }
  /**
   * Modal
   */
  private _modalCoda = [];

  public closeAllModal() {
    var modalCoda = this._modalCoda;
    for (var i = 0; i < modalCoda.length && this._modalCoda.length > 0; i++) {
      this.closeModal(modalCoda[i]);
    }
  }

  public openModal(id) {
    this._modalCoda.push(id);
    $("#" + id).modal("show");
  }
  public closeModal(id) {
    $("#" + id).modal("hide");
    var newArray = this._modalCoda.filter(function (element) {
      return element !== id;
    });

    this._modalCoda = newArray;
  }
  /**
   * Traduzioni
   */

  public getListLenguage() {
    return this._lenguagesList;
  }
  public setDefaultLenguage() {
    try {
      if (this.commonF.isEmpty(localStorage["xi18n"])) {
        var userLang = navigator.language.split["-"];
        if (!this.commonF.isEmpty(userLang)) {
          this._lenguage = userLang[0].toLowerCase();
        } else {
          this._lenguage = "it";
        }

        localStorage["xi18n"] = this._lenguage;
      } else {
        this._lenguage = localStorage["xi18n"];
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }
  public foundLenguage(lng: string) {
    try {
      if (!this.commonF.isEmpty(lng)) {
        return this._lenguagesList.find(function (element) {
          return element.lng.toLowerCase() == lng;
        });
      }
      return undefined;
    } catch (ex) {
      console.error(ex.message);
    }
  }

  public changeLenguage(lng: string) {
    try {
      if (!this.commonF.isEmpty(lng)) {
        localStorage["xi18n"] = lng;
        this._lenguage = lng;
      } else {
        throw "Lenguage not defined";
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }
  public getRuolo() {
    return sessionStorage["ruolo"];
  }
  public getIdUtente() {
    return sessionStorage["id"];
  }
  public getLenguage() {
    return this._lenguage;
  }
  public traduciPrivato(parole, alternativa) {
    try {
      if (!this.commonF.isEmpty(parole)) {
        if (parole[0][this.getLenguage()]) {
          return parole[0][this.getLenguage()];
        }
      } else {
        return alternativa;
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }
  public traduci(parola: string) {
    var a;
    try {
      if (this.commonF.isEmpty(parola)) {
        return "";
      }
      var risposta = parola;
      if (!this.commonF.isEmpty(this._dictionary)) {
        for (var i = 0; i < this._dictionary.length; i++) {
          if (parola.toLocaleLowerCase() == this._dictionary[i]["parola"].toString().toLowerCase()) {
            a = this._dictionary[i][this.getLenguage()];

            if (a != undefined) {
              if (!this.commonF.isEmpty(a)) {
                return this._dictionary[i][this.getLenguage()].toString();
              }
            }
          }
        }
      }
    } catch (ex) {
      console.error(ex);
    }

    return parola;
  }
  public setDictionary(dictionary: object) {
    try {
      if (!this.commonF.isEmpty(dictionary)) {
        this._dictionary = dictionary;
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }
  public replaceAll(str, find, replace) {
    return str.replace(new RegExp(this.escapeRegExp(find), "g"), replace);
  }
  public escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  /**
   * Navbar
   */
  public setNavbar() {
    try {
      if (!this.commonF.isEmpty(this._dataRoute["navbar"])) {
        this._navbar = this._dataRoute["navbar"];
      } else {
        this._navbar = { show: false, trasparent: false };
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }
  public getNavbar() {
    return this._navbar;
  }
  /**
   * Footer
   */
  public setfooter() {
    try {
      if (!this.commonF.isEmpty(this._dataRoute["footer"])) {
        this._footer = this._dataRoute["footer"];
      } else {
        this._footer = { show: false, trasparent: false };
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }

  public getFooter() {
    return this._footer;
  }
  /**
   * Pagina altezza e larghezza
   */

  public getAltezzaPagina() {
    return window.innerHeight;
  }
  public getLarghezzaPagina() {
    return window.innerWidth;
  }
  public setLarghezzaPagina() {
    this.pagina.larghezza = window.innerWidth;
  }
  public setAltezzaPagina() {
    this.pagina.altezza = window.innerHeight;
  }

  public setAltezzaContenuto() {
    this.pagina.altezzaContenuto = this.getAltezzaPagina() - (this.getAltezzaElemento("navbar") + this.getAltezzaElemento("footer")) + "px";
  }

  public textFromHtml(text) {
    var a = "";
    if (!this.commonF.isEmpty(text)) {
      a = text.replace("</p>", " ");
      a = a.replace(/<[^>]*>/g, "");
      a = a.replace("&nbsp;", " ");
    }

    return a;
  }
  public troncaTesto(testo: string, n: number, mettiPuntini: boolean = true) {
    if (this.commonF.isEmpty(testo)) {
      return "";
    }
    testo = this.textFromHtml(testo);
    if (n === 0) {
      return testo;
    }
    if (this.commonF.isEmpty(n)) {
      n = 200;
    }
    var puntini = false;
    if (testo.length > n) {
      puntini = true;
    }
    var a = testo.substring(0, n);
    if (puntini && mettiPuntini) {
      a += "...";
    }
    return a;
  }
  /**
   * Altezza pagina da id
   **/
  public getAltezzaElemento(id) {
    if (document.getElementById(id)) {
      if (document.getElementById(id).offsetHeight) {
        return document.getElementById(id).offsetHeight;
      }
    }

    return 0;
  }
  public getLarghezzaElemento(id) {
    if (document.getElementById(id)) {
      if (document.getElementById(id).offsetWidth) {
        return document.getElementById(id).offsetWidth;
      }
    }
    return 0;
  }
  public isDev() {
    return this._isDevMod;
  }
  public getUrl() {
    if (this.isDev()) {
      var ris = this.isNotUrl;

      return ris;
    } else {
      if (this.isNotLocal) {
        return this.isNotUrl;
      }
    }
  }

  public fotoUrl(path: string, file: string) {
    var ris = path + file;
    if (this.commonF.isEmpty(file)) {
      return "";
    }
    if (this.isDev()) {
      var ris = this.isNotUrl + this.positionImage + file;

      return ris;
    } else {
      if (this.isNotLocal) {
        return this.isNotUrl + this.positionImage + file;
      }
    }

    return ris;
  }
  public generaCall(url: string) {
    //attenzione qua
    if (this.isDev()) {
      url = this.devApi + url;
      return url;
    } else if (this.isNotLocal) {
      return this.isNotUrl + this._apiVersion + url;
    }
    return this._apiVersion + url;
  }

  public aggiungiCaricamentoElemento(nome, id) {
    var newArray = this._elementoLoading.filter(function (element) {
      return element.id == id && element.nome == nome;
    });
    if (this.commonF.isEmpty(newArray)) {
      this._elementoLoading.push({ nome: nome, id: id });
    }
  }

  public isCaricamento(nome, id) {
    var newArray = this._elementoLoading.filter(function (element) {
      return element.id == id && element.nome == nome;
    });
    if (!this.commonF.isEmpty(newArray)) {
      return true;
    }
    return false;
  }
  public resettaCaricamentoElemento() {
    this._elementoLoading = [];
  }

  public rimuvoiCaricamentoElemento(nome, id) {
    var newArray = this._elementoLoading.filter(function (element) {
      return element.id !== id || element.nome != nome;
    });
    this._elementoLoading = newArray;
  }

  public isSiteLoading() {
    if (this._countLoading > 0) {
      return true;
    }
    return false;
  }
  public addLoad() {
    this._countLoading++;
  }
  public removeLoad() {
    this._countLoading--;
  }

  public catchEx(ex) {
    var risposta = false;
    try {
      let pushAlert = true;
      if (ex.code != 0) {
        var alert = {
          testo: ex["message"],
          tipo: "alert-warning",
          delay: 5000,
        };

        risposta = true;

        switch (ex.code) {
          case 1:
            this.terminaSessione(true);
            break;
          case 10:
            pushAlert = false;
            break;
        }

        if (pushAlert) {
          this.alert.generateAlert(alert);
        }
      }
    } catch (Ex) {
      console.error(ex);
    }
    return risposta;
  }

  /**
   * sessione
   */
  ripristinaSessione() {
    if (!this.commonF.isEmpty(localStorage["token"]) && !this.commonF.isEmpty(localStorage["ruolo"])) {
      sessionStorage["token"] = localStorage["token"];
      sessionStorage["ruolo"] = localStorage["ruolo"];
      sessionStorage["id"] = localStorage["id"];
    }
  }
  terminaSessione(force) {
    if (force == true) {
      localStorage["token"] = "";
      localStorage["ruolo"] = "";
      localStorage["id"] = "";
    }
    sessionStorage["token"] = "";
    sessionStorage["ruolo"] = "";
    sessionStorage["id"] = "";
    this.go("/login");
  }
  isValidSession() {
    if (!this.commonF.isEmpty(sessionStorage["token"]) && !this.commonF.isEmpty(sessionStorage["ruolo"])) {
      return true;
    }
    return false;
  }

  sortBy = (key, order = "desc") => {
    return (a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      let varA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
      let varB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }

      return order == "desc" ? comparison * -1 : comparison;
    };
  };
  generaNome(nome) {
    var outString = nome.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "_");
    var a = this.replaceAll(outString, " ", "_");
    return a;
  }
  dropdown(id, idDrop, type) {
    try {
      if (!this.commonF.isEmpty(id) && !this.commonF.isEmpty(type)) {
        if (type.toLowerCase() == "open") {
          if (!$(idDrop).hasClass("show")) {
            $(id).dropdown("toggle");
          }
        } else {
          if ($(idDrop).hasClass("show")) {
            $(id).dropdown("toggle");
          }
        }
      } else {
        console.error("Errore configurazione dropdown");
      }
    } catch (e) {
      console.error(e);
    }
  }

  patchCarrello(nome: string, telefono: string, email: string) {
    this._carrello.nome = nome;
    this._carrello.telefono = telefono;
    this._carrello.email = email;
  }

  getCarrello() {
    return this._carrello;
  }
  getPrezzoCarrello() {
    return this._carrello.prezzo;
  }
  deleteCarrello(guid, data) {
    var a = [];
    var cont = 0;
    for (let i = 0; i < this._carrello.elementi.length; i++) {
      if (this._carrello.elementi[i].guid !== guid || this._carrello.elementi[i].data !== data) {
        a.push(this._carrello.elementi[i]);
      } else if (this._carrello.elementi[i].guid === guid && this._carrello.elementi[i].data === data) {
        cont += this._carrello.elementi[i].prezzo;
      }
    }
    this._carrello.prezzo += -cont;
    this._carrello.elementi = a;
    this.saveCart();
  }
  pushCarrello(idLinea, guid, nome, traduzioniNome, data, datiBiglietto, prezzo, from, to, idCard, fromBackup, toBackup) {
    if (this.seNelCarrelloEsiste(guid, data)) {
      return false;
    }

    var biglietto = {
      idLinea: idLinea,
      guid: guid,
      nome: nome,
      data: data,
      traduzioniNome: traduzioniNome,
      datiBiglietto: datiBiglietto,
      prezzo: prezzo,
      from: from,
      to: to,
      backup: { from: fromBackup, to: toBackup },
    };
    this._carrello.prezzo += prezzo;
    this._carrello.elementi.push(biglietto);

    this.commonF.scrollTo("card-" + idCard);

    this.saveCart();
  }
  svuotaCarrello() {
    this._carrello.elementi = [];
    this._carrello.prezzo = 0;
    localStorage["cart"] = "";
  }
  seNelCarrelloEsiste(guid, giorno) {
    for (let i = 0; i < this._carrello.elementi.length; i++) {
      if (guid == this._carrello.elementi[i].guid && giorno == this._carrello.elementi[i].data) {
        return true;
      }
    }
    return false;
  }

  saveCart() {
    localStorage["cart"] = JSON.stringify(this._carrello);
    localStorage["expire"] = new Date();
  }

  loadCart() {
    var check = false;
    if (localStorage["cart"]) {
      var dataCompare = new Date();
      dataCompare.setDate(dataCompare.getDate() - 1);
      if (new Date(this.commonF.convertData(localStorage["expire"], 0, "time", "-")) > dataCompare) {
        check = true;
        this._carrello = JSON.parse(localStorage["cart"]);

        var a = [];
        for (let i = 0; i < this._carrello.elementi.length; i++) {
          var f = new Date(this.commonF.convertStringToDataIt(this._carrello.elementi[i].data, "time", "-"));
          var g = new Date();
          g.setDate(g.getDate() - 1);

          if (f < g) {
            var b = {
              guid: this._carrello.elementi[i].guid,
              data: this._carrello.elementi[i].data,
            };
            a.push(b);
          }
        }

        for (let i = 0; i < a.length; i++) {
          this.deleteCarrello(a[i].guid, a[i].data);
        }
      }
    }
    if (!check) {
      localStorage["cart"] = "";
      localStorage["expire"] = "";
      localStorage["search"] = "";
    }
  }
  IsSameDay(date1: Date, date2: Date) {
    if (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
      return true;
    } else {
      return false;
    }
  }
  private millisecondPerDay = 24 * 60 * 60 * 1000;
  GetDisabledDates(excludeDates: Array<Date>) {
    var now = new Date();
    var startDate: Date = new Date(now.setFullYear(now.getFullYear() - 1));
    var endDate: Date = new Date(now.setFullYear(now.getFullYear() + 2)); //change as per your need

    this.disabledDates = [];
    do {
      var found = false;
      for (var i = 0; i < excludeDates.length; i++) {
        var excludeDate: Date = excludeDates[i];
        if (this.IsSameDay(excludeDate, startDate)) {
          found = true;
        }
      }
      if (!found) {
        this.disabledDates.push(startDate);
      }
      startDate = new Date(startDate.getTime() + this.millisecondPerDay);
    } while (startDate <= endDate);

    //console.log("Calculated: "+this.disabledDates);
  }

  initCalendario(dat) {
    var enabledDates = [];
    if (this.commonF.isEmpty(dat)) {
      this.disabledDates = [];

      return false;
    }

    var trovato = false;
    for (var i = 0; i < dat.length; i++) {
      debugger;

       
        enabledDates.push(new Date(dat[i]));
        if (this.commonF.convertData(dat[i]) == this.commonF.convertData(this.dati.calendario.value)) {
          trovato = true;
        }
     
    }

    if (!trovato) {
      this.dati.calendario.value = new Date(enabledDates[0]);
    }
    this.GetDisabledDates(enabledDates);
  }
}
