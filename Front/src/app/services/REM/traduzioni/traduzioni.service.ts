import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class TraduzioniService {

  constructor(private http: HttpClient, private share: SharedModule) { }
  getDizionario() {
    try {




      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };


      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall('traduzioni'), httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }


  }
  delete(id: string) {
    try {




      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),


      };


      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.delete(this.share.generaCall('traduzioni?id=' + id), httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }


  }
  getParola(id: string) {
    try {




      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),


      };


      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall('traduzioni/' + id), httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }


  }
  salvaParola(obj: any) {
    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
        body: JSON.stringify(obj)

      };

      if (obj["id"] == 0) {
        return this.http.post(this.share.generaCall('traduzioni'), JSON.stringify(obj), httpOptions)

      }
      else {
        return this.http.put(this.share.generaCall('traduzioni'), JSON.stringify(obj), httpOptions)

      }


      //return this.http.get(this.share.generaCall('traduzioni/' + id), httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }


  }
}

