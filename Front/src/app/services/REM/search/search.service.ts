import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient, private share: SharedModule) { }
  position: string = "search"
  getLuogoVicino(lat: string, lng: string) {
    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.position + "/getLuogoVicino" + `?lat=${lat}&lng=${lng}`), httpOptions);



    } catch (ex) {
      console.error(ex.message);
    }


  }
  getFrom() {
    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.position + "/getFrom"), httpOptions);



    } catch (ex) {
      console.error(ex.message);
    }


  }
  getTo() {
    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.position + "/getTo"), httpOptions);



    } catch (ex) {
      console.error(ex.message);
    }


  }
  searchFrom(q) {
    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.position + "/searchFrom?q=" + q), httpOptions);



    } catch (ex) {
      console.error(ex.message);
    }

  }
  searchData(da, a) {

    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.position + "/searchData?from=" + da + "&to=" + a), httpOptions);



    } catch (ex) {
      console.error(ex.message);
    }
  }
  searchTo(q) {
    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.position + "/searchTo?q=" + q), httpOptions);



    } catch (ex) {
      console.error(ex.message);
    }

  }
  searchLinee(from, to, passeggeri, orario, day) {
    try {

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };

      return this.http.get(this.share.generaCall(this.position + `/searchLinee?from=${from}&to=${to}&passeggeri=${passeggeri}&orario=${orario}&day=${this.share.commonF.convertData(day, 0, 'time', '-')}`), httpOptions);
    } catch (ex) {
      console.error(ex.message);
    }
  }
}
