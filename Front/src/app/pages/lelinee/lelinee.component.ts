import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { TestComponent } from '../test/test.component';
import { CONNREFUSED } from 'dns';

@Component({
  selector: 'app-lelinee',
  templateUrl: './lelinee.component.html',
  styleUrls: ['./lelinee.component.scss']
})
export class LelineeComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }

  public caricamento: boolean = true;
  public data = [];
  public ris: any;
  public obj: any;
  public searchText = "";
  public limitTo = 9;
  public maxScroll = 0;
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached()) {
      this.limitTo = this.limitTo + 10;
    }
  }
  bottomReached(): boolean {

    this.maxScroll = window.screenY;
    if (this.maxScroll + 100 > window.screenY) {
      if (this.limitTo < this.data.length) {
        return (window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight;
      }
    }
    return false;

  }

  ngOnInit() {
    this.carica();
  }
  sottolineaCercato(testo: string, cercato: string) {
    if (!this.share.commonF.isEmpty(cercato) && cercato.length >= 2) {
      var regEx = new RegExp(cercato, "ig");
      var stringa = testo.toLowerCase();
      var cercainstringa = cercato.toLowerCase();
      var index = stringa.indexOf(cercainstringa);
      if (index >= 0) {
        var cercata = testo.substring(index, index + cercato.length);
      }
      var a = testo.replace(regEx, "<b class='bg-secondary text-white'>" + cercata + "</b>");
      return a;
    }
    return testo;
  }


  carica() {

    this.rem.linee.get().subscribe(
      data => {


        this.caricamento = false;
        this.ris = data;
        console.log(data);
        if (!this.share.catchEx(data["error"])) {

          this.data = data["data"];



        }


      },
      error => {
        this.caricamento = false;
        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      }

    );
  }

}
