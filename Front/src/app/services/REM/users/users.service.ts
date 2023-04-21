import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private share: SharedModule) { }
  creaUtente(nomeUtente, ruolo) {
    try {


      var data = { "nomeUtente": nomeUtente, "ruolo": ruolo };

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }), body: JSON.stringify(data)

      };
      return this.http.post(this.share.generaCall('utenti'), data, httpOptions);


    }
    catch (ex) {
      console.error(ex.message);
    }
  }
  deleteUser(id) {
    try {


      var data = { "id": id };

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }), body: JSON.stringify(data)

      };
      return this.http.delete(this.share.generaCall('utenti'), httpOptions);


    }
    catch (ex) {
      console.error(ex.message);
    }

  }

  disableUser(id, blocca) {
    try {


      var data = { "id": id, "blocca": blocca };

      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }), body: JSON.stringify(data)

      };
      return this.http.options(this.share.generaCall('utenti'), httpOptions);


    }
    catch (ex) {
      console.error(ex.message);
    }

  }
  getUser(id: string) {
    try {


      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),


      };

      var call = "utenti";
      if (!this.share.commonF.isEmpty(id)) {
        call += "/" + id;
      }


      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.get(this.share.generaCall(call), httpOptions);





    } catch (ex) {
      console.error(ex.message);
    }


  }
  cambioPassword(vecchiaPassword, nuovaPassword) {
    try {


      var dati = { "password": this.share.commonF.MD5(vecchiaPassword), "nuovaPassword": this.share.commonF.MD5(nuovaPassword) };
      if (!this.share.commonF.isEmpty(vecchiaPassword) && !this.share.commonF.isEmpty(nuovaPassword)) {

        var data = JSON.stringify(dati);

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),
          body: data

        };

        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.patch(this.share.generaCall('login'), data, httpOptions);

      }



    } catch (ex) {
      console.error(ex.message);
    }

  }

  cambioEmail(email) {
    try {


      var dati = { "email": email };
      if (!this.share.commonF.isEmpty(email)) {

        var data = JSON.stringify(dati);

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),
          body: data

        };

        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.put(this.share.generaCall('login'), data, httpOptions);

      }



    } catch (ex) {
      console.error(ex.message);
    }

  }
  cambioNotifiche(notifiche, notificheE) {
    try {



      if (!this.share.commonF.isEmpty(notifiche) && !this.share.commonF.isEmpty(notificheE)) {


        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),


        };

        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.patch(this.share.generaCall('utenti?notifica=' + notifiche + "&notificaEmail=" + notificheE), '', httpOptions);

      }



    } catch (ex) {
      console.error(ex.message);
    }

  }
  cambioEmailCodice(codice) {
    try {


      var dati = { "codice": codice };
      if (!this.share.commonF.isEmpty(codice)) {

        var data = JSON.stringify(dati);

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
            "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
          }),
          body: data

        };

        //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
        return this.http.put(this.share.generaCall('login'), data, httpOptions);

      }



    } catch (ex) {
      console.error(ex.message);
    }

  }
}
