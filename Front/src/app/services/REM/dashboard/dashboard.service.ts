import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private share: SharedModule) { }
  get(giorno) {
    try {

      if (!this.share.commonF.isEmpty(giorno)) {
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),



        };
        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.get(this.share.generaCall('dashboard') + "?giorno=" + giorno, httpOptions);

      }



    } catch (ex) {
      console.error(ex.message);
    }


  }
}
