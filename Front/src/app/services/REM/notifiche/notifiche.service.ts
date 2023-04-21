import { Injectable } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
@Injectable({
  providedIn: 'root'
})
export class NotificheService {
  posizione = "notifiche"
  constructor(protected share: SharedModule, protected http: HttpClient) { }
  get() {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
      };
      return this.http.get(this.share.generaCall(this.posizione), httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
  delete(id) {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
      };
      return this.http.delete(this.share.generaCall(this.posizione) + "?idKey=" + id, httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
  lette() {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
      };
      return this.http.post(this.share.generaCall(this.posizione), '', httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
}
