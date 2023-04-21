import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }

  ngOnInit(): void {
    this.carica();
  }
  public ris: any;
  public data: any;
  private pageServices = this.rem.impostazioni;

  carica() {
    this.pageServices.get().subscribe(
      data => {
        this.ris = data;
        console.log(data);
        if (!this.share.catchEx(data["error"])) {
          this.data = data["data"];
        }
      },
      error => {

        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }
  salva() {
    this.share.aggiungiCaricamentoElemento("impostazioni", "salva");
    this.pageServices.put(this.data).subscribe(
      data => {
        this.ris = data;
        console.log(data);
        if (!this.share.catchEx(data["error"])) {
          this.share.rimuvoiCaricamentoElemento("impostazioni", "salva");
          this.carica();

        }
      },
      error => {
        this.share.rimuvoiCaricamentoElemento("impostazioni", "salva");
        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      }
    );
  }
}
