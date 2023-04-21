import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here
import { SharedModule } from 'src/app/module/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  posizione = "upload"
  constructor(protected share: SharedModule, protected http: HttpClient) {

  }

  post(files, preFile = "") {
    debugger
    try {
      var url = this.posizione;
      if (!this.share.commonF.isEmpty(preFile)) {
        url += "?preFile=" + preFile
      }

      let formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }
      const httpOptions = {
        headers: new HttpHeaders({

          "token": ((sessionStorage["token"]) ? sessionStorage["token"] : ''),
          "lng": ((localStorage["xi18n"]) ? localStorage["xi18n"] : '')
        }),

      };
      //return this.http.post(this.share.generaCall('login'), "{\n    \"user\": \"ok\"\n}", httpOptions)
      return this.http.post(this.share.generaCall(url), formData, httpOptions);


    } catch (ex) {
      debugger
      console.error(ex.message);
    }
  }
}
