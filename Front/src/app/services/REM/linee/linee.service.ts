import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class LineeService {

  constructor(private http: HttpClient, private share: SharedModule) {

  }


  posizione = "linee"

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
  getAll() {

    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.posizione) + "/getAllLinee", httpOptions);


    } catch (ex) {
      console.error(ex.message);
    }

  }
  disable(id: string, set: boolean) {

    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.patch(this.share.generaCall(this.posizione) + "/patch?id=" + id + "&set=" + set, "", httpOptions);


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
  getID(id: string) {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),


      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(this.posizione) + "/getID?id=" + id, httpOptions);


    } catch (ex) {
      console.error(ex.message);
    }

  }
}
