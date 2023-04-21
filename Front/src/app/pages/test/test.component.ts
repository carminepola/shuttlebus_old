import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { RemService } from "../../services/REM/rem.service";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],

})
export class TestComponent implements OnInit {
  users: Object;
  constructor(public rout: ActivatedRoute, public share: SharedModule, public rem: RemService) { }
  public toggle = false;
  public prova = 0;

  public oggetto = {
    prova: "ok",
    prova2: "ok"
  }

  ngOnInit() {
    this.prova = this.share.getAltezzaPagina();
    /*this.testServices.getUsers().subscribe(testServices => {
      this.users = testServices
      console.log(this.users);
    
  );}*/

    /*this.rem.user.getUsers().subscribe(testServices => {
      this.users = testServices
      console.log(this.users);
    
    });*/
  }

  private cont = 0;

  testNotifica() {
    this.cont++
    var notifica = {
      titolo: `Prova ${this.cont}`,
      testo: "Prova testo Prova testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testo",
      icona: "",
      ora: "",
      durata: 0,
      buttons: "",
      dimissed: false
    }
    this.share.notifiche.creaNotifica(notifica);
  }

  testNotificaPulsanti() {
    function prova() {
      alert("ok");
    }
    this.cont++
    var notifica1 = {
      titolo: `Prova ${this.cont}`,
      testo: "Prova testo Prova testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testo",
      icona: "",
      ora: "",
      durata: 5000,
      buttons: [{ 'title': "bottone1", 'class': 'btn btn-link btn-block', 'function': prova, 'icon': '' }, { 'title': "bottone2", 'class': 'btn btn-link', 'function': '', 'icon': '' }],
      dimissed: false
    }
    this.share.notifiche.creaNotifica(notifica1);
  }


  private alertCont = 0;
  testAlert() {
    this.alertCont++;
    var alert = {

      'testo': "testo efwadfertwertwerty nwwedfwqefw ergfwe rwgerg erhe bher hdr her herthertherthert he thrhetryt testo efwadfertwertwerty nwwedfwqefw ergfwe rwgerg erhe bher hdr her herthertherthert he thrhetryt" + this.alertCont,
      'tipo': "alert-danger",
      'delay': 3000

    }
    this.share.alert.generateAlert(alert)
  }

  testAlertS() {
    this.alertCont++;
    var alert = {

      'testo': "testo efwadfertwertwerty nwwedfwqefw ergfwe rwgerg erhe bher hdr her herthertherthert he thrhetryt testo efwadfertwertwerty nwwedfwqefw ergfwe rwgerg erhe bher hdr her herthertherthert he thrhetryt" + this.alertCont,
      'tipo': "alert-success",
      'delay': 0

    }
    this.share.alert.generateAlert(alert)
  }

}