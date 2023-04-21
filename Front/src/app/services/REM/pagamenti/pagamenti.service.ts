import { Injectable } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here

@Injectable({
  providedIn: 'root'
})
export class PagamentiService {
  posizione = "pagamenti"
  constructor(protected share: SharedModule, protected http: HttpClient) { }
  get(cart,sessionID,userSession) {
    var a = JSON.parse(cart)


    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),


      };
      return this.http.post(this.share.generaCall(this.posizione)+"?sessionePagamento="+sessionID+"&sessioneUtente="+userSession, a, httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
  privato(id) {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
      };
      return this.http.patch(this.share.generaCall(this.posizione) + "?id=" + id, "", httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
  paypal(id) {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
      };
      return this.http.patch(this.share.generaCall("paypal") + "?id=" + id, "", httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
}
