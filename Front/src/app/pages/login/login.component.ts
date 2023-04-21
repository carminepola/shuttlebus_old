import { Component, OnInit, OnChanges } from '@angular/core';
import { RemService } from 'src/app/services/REM/rem.service';
import { SharedModule } from 'src/app/module/shared/shared.module';

import { ProviderAst } from '@angular/compiler';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private rem: RemService, public share: SharedModule,) { }
  public login = {
    "nomeUtente": "",

    "password": "",
    "ricorda": false
  }
  public pass = "";
  ngOnInit() {
    if (!this.share.commonF.isEmpty(sessionStorage["token"])) {

      this.share.go("dash");
    }
    this.share.resettaCaricamentoElemento();
  }


  recuperoPassword() {


    this.share.aggiungiCaricamentoElemento("resettaPassword", "login2");

    this.rem.login.recuperoPassword({ "nomeUtente": this.login.nomeUtente }).subscribe(
      data => {
        this.share.rimuvoiCaricamentoElemento("resettaPassword", "login2");

        this.share.closeModal("exampleModal");
        console.log(data);
        if (!this.share.catchEx(data["error"])) {

          var alert = {

            'testo': "Ti è stata inviata un email per recuperare la password.",
            'tipo': "alert-success",
            'delay': 3000

          }
          this.share.alert.generateAlert(alert);


        }


      },
      error => {

        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");



      }

    );
  }
  effettualogin() {
    try {

      this.share.aggiungiCaricamentoElemento("login", "login1");



      this.login.password = this.share.commonF.MD5(this.pass);


      this.rem.login.login(this.login).subscribe(
        data => {
          this.share.rimuvoiCaricamentoElemento("login", "login1");

          this.share.closeModal("exampleModal");
          console.log(data);
          if (!this.share.catchEx(data["error"])) {

            if (this.login.ricorda) {
              localStorage["token"] = data["data"][0].token;
              localStorage["ruolo"] = data["data"][0].ruolo;
              localStorage["id"] = data["data"][0].id;
            }
            sessionStorage["token"] = data["data"][0].token;
            sessionStorage["ruolo"] = data["data"][0].ruolo;
            sessionStorage["id"] = data["data"][0].id;
            this.share.go("dash");



          }


        },
        error => {

          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );
    } catch (ex) {
      console.error(ex.message);
    }

  }



}
