import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';
@Injectable({
  providedIn: 'root'
})
export class ImpostazioniService {
  posizione = "impostazioni"
  constructor(protected share: SharedModule, protected http: HttpClient, ) { }
  put(data) {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
        body: JSON.stringify(data)
      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.put(this.share.generaCall(this.posizione), JSON.stringify(data), httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
  get() {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        })
      };
      return this.http.get(this.share.generaCall(this.posizione), httpOptions);

    } catch (ex) {
      console.error(ex.message);
    }
  }
}
