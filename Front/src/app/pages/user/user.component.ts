import { Component, OnInit, OnChanges } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userCambio: object = { "vecchiaPassword": "", "nuovaPassword": "", "ripteiPassword": "" };
  obj: object;
  constructor(public share: SharedModule, public rem: RemService) { }

  ngOnInit() {
    this.caricamentoUtente();
  }

  caricamentoUtente() {

    var datiUrl = this.share.getDataFromRoute();
    console.log(datiUrl);
    this.share.aggiungiCaricamentoElemento("pagina", "1");

    this.rem.user.getUser(this.share.getIdUtente()).subscribe(
      data => {


        console.log('%c DATI UTENTE', 'background: #222; color: #bada55');
        console.log(data);

        if (!this.share.catchEx(data["error"])) {

          this.obj = data["data"][0];

          this.share.rimuvoiCaricamentoElemento("pagina", "1");

        }




      },
      error => {
        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      }

    );
  }

  cambioEmailCodice(codice) {
    try {
      this.share.aggiungiCaricamentoElemento("buttonUser", "3");

      this.rem.user.cambioEmailCodice(codice).subscribe(
        data => {


          console.log('%c CambioPassword', 'background: #222; color: #bada55');
          console.log(data);

          if (!this.share.catchEx(data["error"])) {

            var alert = {

              'testo': "Il tuo nome utente è stato cambiato",
              'tipo': "alert-success",
              'delay': 3000

            }

            this.share.alert.generateAlert(alert)
            this.userCambio = { "vecchiaPassword": "", "nuovaPassword": "", "ripteiPassword": "" };
            this.share.rimuvoiCaricamentoElemento("buttonUser", "3");
            this.obj["nomeUtente"] = data["data"];
          }





        },
        error => {

          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );

    }
    catch (ex) {

      console.error(ex.message);
    }

  }
  cambioEmail(email) {
    try {

      this.share.aggiungiCaricamentoElemento("buttonUser", "2");

      this.rem.user.cambioEmail(email).subscribe(
        data => {


          console.log('%c CambioPassword', 'background: #222; color: #bada55');
          console.log(data);

          if (!this.share.catchEx(data["error"])) {

            var alert = {

              'testo': "Ti è stata inviata una mail all'indirizzo indicato si prega di controllare anche la sezione spam",
              'tipo': "alert-success",
              'delay': 3000

            }
            this.share.alert.generateAlert(alert)
            this.userCambio = { "vecchiaPassword": "", "nuovaPassword": "", "ripteiPassword": "" };
            this.share.rimuvoiCaricamentoElemento("buttonUser", "2");
          }





        },
        error => {

          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );

    }
    catch (ex) {

      console.error(ex.message);
    }

  }

  notifiche() {
    try {


      this.rem.user.cambioNotifiche(this.obj["notifiche"], this.obj["notificheEmail"]).subscribe(
        data => {


          console.log('%c change notifiche', 'background: #222; color: #bada55');
          console.log(data);

          if (!this.share.catchEx(data["error"])) {


          }





        },
        error => {

          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );

    }
    catch (ex) {

      console.error(ex.message);
    }

  }

  cambioPassword(vecchiaPassword, nuovaPassword) {

    try {
      this.share.aggiungiCaricamentoElemento("buttonUser", "1");

      this.rem.user.cambioPassword(vecchiaPassword, nuovaPassword).subscribe(
        data => {


          console.log('%c CambioPassword', 'background: #222; color: #bada55');
          console.log(data);

          if (!this.share.catchEx(data["error"])) {

            var alert = {

              'testo': "Password modificata",
              'tipo': "alert-success",
              'delay': 3000

            }
            this.share.alert.generateAlert(alert)
            this.userCambio = { "vecchiaPassword": "", "nuovaPassword": "", "ripteiPassword": "" };
            this.share.rimuvoiCaricamentoElemento("buttonUser", "1");
          }





        },
        error => {

          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );

    }
    catch (ex) {

      console.error(ex.message);
    }



  }
}
