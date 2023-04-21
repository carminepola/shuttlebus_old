import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient, private share: SharedModule) { }
  posizione = "tickets";

  get(giorno:string) {

      try {
        if(this.share.commonF.isEmpty(giorno))
        {
          throw "Parametri mancanti";
        }
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),

        };
        return this.http.get(this.share.generaCall(this.posizione+"?giorno="+giorno), httpOptions);
      } catch (ex) {
        console.error(ex.message);
      }

  }
  getTicketsShort(id: string) {
    if (!this.share.commonF.isEmpty(id)) {
      try {
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),

        };
        return this.http.get(this.share.generaCall(this.posizione + "/getTicketsShort" + '?id=' + id), httpOptions);
      } catch (ex) {
        console.error(ex.message);
      }
    }
  }
  getTicketsMail(id: string) {
    if (!this.share.commonF.isEmpty(id)) {
      try {
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),

        };
        return this.http.get(this.share.generaCall(this.posizione + "/getTicketFromMail" + '?email=' + id), httpOptions);
      } catch (ex) {
        console.error(ex.message);
      }
    }
  }
  getTickets(id: string) {
    if (!this.share.commonF.isEmpty(id)) {
      try {
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),

        };
        return this.http.get(this.share.generaCall(this.posizione + "/getTickets" + '?id=' + id), httpOptions);
      } catch (ex) {
        console.error(ex.message);
      }
    }
  }
  put(riferimento: string, idfascia: string, idlinea: string, data: string) {

    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };

      return this.http.put(this.share.generaCall(this.posizione + `?riferimento=${riferimento.trim()}&idFascia=${idfascia}&idLinea=${idlinea}&data=${data}`), '', httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }

  }
}
