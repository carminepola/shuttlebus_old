import { Component, OnInit, HostListener } from '@angular/core';
import { commonFunctionModule } from 'src/app/module/commonFunction/commonFunction.module';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';

@Component({
  selector: 'app-centro-notifiche',
  templateUrl: './centro-notifiche.component.html',
  styleUrls: ['./centro-notifiche.component.scss']
})
export class CentroNotificheComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }

  ngOnInit() {
    this.share.notifiche.segnaTutteComeVisualizzate();
    this.init();
    this.segnagiaLette();
  }
  private cont = 0;

  testNotifica() {
    this.cont++
    var notifica = {
      titolo: `Prova ${this.cont}`,
      testo: "Prova testo Prova testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testoProva testo",
      icona: "",
      ora: "",
      durata: 1500,
      buttons: "",
      dimissed: false
    }
    this.share.notifiche.creaNotifica(notifica);
  }

  public limitTo = 9;
  public maxScroll = 0;

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached()) {
      this.limitTo = this.limitTo + 2;
    }
  }
  bottomReached(): boolean {

    this.maxScroll = window.screenY;
    if (this.maxScroll + 100 > window.screenY) {
      if (this.limitTo < this.share.notifiche.getNotifiche().length) {
        return (window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight;
      }
    }
    return false;

  }
  segnagiaLette() {
    this.rem.notifiche.lette().subscribe(
      data => {


      }
    );
  }
  delete(id = "") {

    this.rem.notifiche.delete(id).subscribe(
      data => {


      }
    );

  }

  init() {


    if (sessionStorage["token"] != null || sessionStorage["token"] != undefined || sessionStorage["token"] != "") {
      this.rem.notifiche.get().subscribe(
        data => {

          console.log(data);
          if (!this.share.commonF.isEmpty(data["data"])) {

            for (let i = 0; i < data["data"].length; i++) {

              var n = data["data"][i];
              var notifica1 = {
                id: n.id,
                titolo: n.titolo,
                testo: n.testo,
                icona: "",
                ora: this.share.commonF.dataTimeToString(n.dataNotifica),
                durata: 5000,
                notificata: n.pushed
              }
              this.share.notifiche.creaNotifica(notifica1);

            }

          }
        }
      );

    }

  }
}
