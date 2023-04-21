import { Injectable } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  constructor(public share: SharedModule, protected http: HttpClient) { }
  posizione = "faq"
  delete(id) {
    try {

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.delete(this.share.generaCall(this.posizione + '?id=' + id), httpOptions);


    } catch (ex) {
      console.error(ex.message);
    }
  }
  get(id = '') {

    if (!this.share.commonF.isEmpty(id)) {
      try {
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),

        };
        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.get(this.share.generaCall(this.posizione + '/' + id), httpOptions);


      } catch (ex) {
        console.error(ex.message);
      }
    }
    else {
      try {
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),

        };
        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.get(this.share.generaCall(this.posizione), httpOptions);


      } catch (ex) {
        console.error(ex.message);
      }
    }
  }
  post(data) {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        })

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.post(this.share.generaCall(this.posizione), JSON.stringify(data), httpOptions);


    } catch (ex) {
      console.error(ex.message);
    }
  }
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
}
