import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  public newUser = {
    "nomeUtente": "",
    "ruolo": 10
  }
  constructor(public share: SharedModule, public rem: RemService) { }

  ngOnInit() {
  }

  creautente() {

    this.share.aggiungiCaricamentoElemento("nuovoUtente", "1");

    console.log(this.newUser.nomeUtente)
    this.rem.user.creaUtente(this.newUser.nomeUtente, this.newUser.ruolo).subscribe(
      data => {


        console.log('%c Crea utente', 'background: #222; color: #bada55');
        console.log(data); this.share.rimuvoiCaricamentoElemento("nuovoUtente", "1");

        if (!this.share.catchEx(data["error"])) {




          var alert = {

            'testo': "Utente creato",
            'tipo': "alert-success",
            'delay': 3000

          };
          this.share.alert.generateAlert(alert);
          this.share.go("utenti");

        }




      },
      error => {
        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      }

    );
  }
}
