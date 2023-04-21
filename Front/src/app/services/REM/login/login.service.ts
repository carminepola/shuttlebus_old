import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private share: SharedModule) {

  }
  login(data) {
    try {

      if (!this.share.commonF.isEmpty(data)) {

        data = JSON.stringify(data);

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),
          body: data


        };


        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.post(this.share.generaCall('login'), data, httpOptions);

      }



    } catch (ex) {
      console.error(ex.message);
    }


  }
  recuperoPassword(data) {
    try {

      if (!this.share.commonF.isEmpty(data)) {

        data = JSON.stringify(data);

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),
          body: data


        };


        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.options(this.share.generaCall('login'), httpOptions);

      }



    } catch (ex) {
      console.error(ex.message);
    }


  }
  logout() {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),
      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.delete(this.share.generaCall('login'), httpOptions);

    } catch (ex) {
      console.error(ex.message);
    }

  }
}
