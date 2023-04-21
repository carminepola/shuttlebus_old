import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from '@angular/router';
import { SEOService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-busline',
  templateUrl: './busline.component.html',
  styleUrls: ['./busline.component.scss']
})
export class BuslineComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute, private seo: SEOService) { }
  public nome: string;
  public ris: any;
  public data: any;
  public id: string;
  public obj: any;
  public caricamento = true;
  public lineaSelezionata = "";
  public foto = "";
  cambiaFasciaOraria(i) {
    if (i == this.lineaSelezionata) {
      this.lineaSelezionata = '';

    }
    else {
      this.lineaSelezionata = i;
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => this.nome = params.name);
    this.route.params.subscribe((params) => this.id = params.id);
    this.nome = this.share.replaceAll(this.nome, "_", "");
    if (!this.share.commonF.isEmpty(this.nome)) {
      this.carica();
    }
    else {
      this.caricamento = false;
      this.share.go("404");

    }

  }

  carica() {

    try {
      this.rem.linee.getID(this.id).subscribe(
        data => {

          this.caricamento = false;
          this.ris = data;
          console.log(data);
          if (!this.share.catchEx(data["error"])) {

            this.data = data["data"];
            this.obj = this.data[0];

            this.seo.updateTitle("Pintour | " + this.share.traduciPrivato(this.obj.traduzioniNome, this.obj.nome));

            debugger
            var rotueData = this.share.getDataFromRoute();
            var description = rotueData["description"][this.share.getLenguage()];
            description = description.replace("#nome#", this.share.traduciPrivato(this.obj.traduzioniNome, this.obj.nome))
            this.seo.updateAllDescription(description);

            var key = this.share.traduciPrivato(this.obj.traduzioniDesc, this.obj.descrizione).split(" ")
            this.seo.updateKey(key);



          }


        },
        error => {
          this.caricamento = false;
          this.share.removeLoad();
          sessionStorage["500"] = error["message"];
          this.share.go("/500");


        }

      );
    } catch (ex) {
      console.log(ex);
    }

  }
}
