import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
})
export class commonFunctionModule {


  public objtoarray(obj) {
    var a: Array<any> = new Array<any>();
    if (!this.isEmpty(obj)) {


      for (let i = 0; i < obj.length; i++) {
        a.push(obj[i]);
      }

    } return a;

  }
  public isEmpty(valore: any) {
    try {
      if (valore === null || valore === undefined || valore === "" || valore.length === 0) {
        return true;
      }
      return false;
    }
    catch (ex) {
      console.log(ex);
    }
  }
  public newArray(i: number) {
    if (!this.isEmpty(i)) {
      return new Array(i);
    }
    else {
      return [];
    }

  }
  public NewGuid() {
    var sGuid = "";
    for (var i = 0; i < 32; i++) {
      sGuid += Math.floor(Math.random() * 0xF).toString(0xF);
    }
    return sGuid;
  }
  public troncaTesto(testo, lunghezza) {
    if (this.isEmpty(testo)) {
      return "";
    }
    if (lunghezza === 0) {
      return testo;
    }
    if (this.isEmpty(lunghezza)) {
      lunghezza = 200;
    }
    var puntini = false;
    if (testo.length > lunghezza) {
      puntini = true;
    }
    var a = testo.substring(0, lunghezza);
    if (puntini) {
      a += "...";
    }
    return a;

  }
  public MD5(valore) {
    try {

      if (!this.isEmpty(valore)) {
        var CryptoJS = require("crypto-js");
        var md5 = CryptoJS.MD5(valore);
        return md5.toString();
      }
      return "";
    }
    catch (Ex) {
      console.error(Ex.message);
    }
  }
  public clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
  public scrollTo(id: any, smooth: boolean = false) {
    if (smooth) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
    else {
      document.getElementById(id).scrollIntoView({
        behavior: "auto",
        block: "start"
      });
    }
  }

  public convertStringToDataIt(data, formato = "it", separatore = "/") {

    var d = data.split("/");

    var mnth = d[1];
    var day = d[0];
    var yrs = d[2];
    switch (formato.toLowerCase()) {
      case "it":
        return [day, mnth, yrs].join(separatore);
      case "uk":
        return [mnth, day, yrs].join(separatore);
      case "time":
        return [yrs, mnth, day].join(separatore);
    }
  }

  public dataTimeToString(data: string) {
    var a = data.split("T");
    var ora = a[1].slice(0, 5);
    var dataDaSplittare = a[0];

    var dataSplittata = dataDaSplittare.split('-');


    return dataSplittata[2] + "/" + dataSplittata[1] + "/" + dataSplittata[0] + " " + ora;

  }
  public dataToString(data: string) {
    var a = data.split("T");
    var ora = a[1].slice(0, 5);
    var dataDaSplittare = a[0];

    var dataSplittata = dataDaSplittare.split('-');


    return dataSplittata[2] + "/" + dataSplittata[1] + "/" + dataSplittata[0] ;

  }
  public convertData(data, giorniDaAggiungere = 0, formato = "it", separatore = "/") {

    var date;
    if (!this.isEmpty(data)) {
      date = new Date(data);
    }
    else {
      date = new Date();
    }

    if (giorniDaAggiungere != 0) {
      date.setDate(date.getDate() + giorniDaAggiungere);
    }

    var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    switch (formato.toLowerCase()) {
      case "it":
        return [day, mnth, date.getFullYear()].join(separatore);
      case "uk":
        return [mnth, day, date.getFullYear()].join(separatore);
      case "time":
        return [date.getFullYear(), mnth, day].join(separatore);
    }

  }


}


