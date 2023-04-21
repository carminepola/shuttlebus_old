import { Component, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { Data } from '@angular/router';
import { from } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }
  public ris: any;
  public caricamento: boolean = true;
  public tabella = {
    colonne: ['linea', 'Fermata', 'Ora', 'Codice biglietto', 'Stato', 'Posti assegnati', 'Biglietto', 'Nome passeggero', 'E-mail', 'Cellulare', 'N.Bagagli extra'],
    righe: [],
  }
  public dataDaVisualizzare: string;
  ngOnInit() {
    this.dataDaVisualizzare = this.share.commonF.convertData(new Date(), 0, 'time', '-');

    this.carica(this.share.commonF.convertData(this.dataDaVisualizzare, 0, "time", "-"));
  }
  calcolaTabella() {
    setTimeout(() => {
      var dataSet = [];
      if (!this.share.commonF.isEmpty(this.ris)) {
        for (var i = 0; i < this.ris.length; i++) {
          var linea = this.share.traduciPrivato(this.ris[i]["traduzioniCitta"], this.ris[i]["nome"]);
          for (var j = 0; j < this.ris[i]["fasce"].length; j++) {
            var fascia = this.ris[i]["fasce"][j]["idfasciaoraria"];
            var fermata = this.share.traduciPrivato(this.ris[i]["fasce"][j]["traduzioniFermata"], this.ris[i]["fasce"][j]["citta"])
            var indirizzo = this.ris[i]["fasce"][j]["indirizzo"];
            var ora = this.ris[i]["fasce"][j]["orario"].substring(0, 5);
            var posti = this.ris[i]["fasce"][j]["postiTotali"][0]["posti"];
            var postiTotali = this.ris[i]["fasce"][j]["postiTotali"][0]["totposti"];
            var bagagli = this.ris[i]["fasce"][j]["postiTotali"][0]["bagagli"];
            var bagagliTotali = this.ris[i]["fasce"][j]["postiTotali"][0]["totbagagli"];
            var postiDisponibili = this.ris[i]["fasce"][j]["postiTotali"][0]["postiDisponibili"];
            var bagagliDisponibili = this.ris[i]["fasce"][j]["postiTotali"][0]["bagagliDisponibili"];
            dataSet.push([linea, fascia, fermata, ora, posti,postiDisponibili, postiTotali, bagagli,bagagliDisponibili, bagagliTotali]);
          }
        }
      }


      if ($.fn.dataTable.isDataTable('#tabella')) {
        var table = $('#tabella').DataTable();
        table.clear().destroy();
        var table = $('#tabella').DataTable({
          data: dataSet,

        });
      }
      else {

        var table = $('#tabella').DataTable({
          data: dataSet,
          "language": {
            "emptyTable": "Nessun dato al momento disponibile",
            "loadingRecords": "Caricamento...",
            "search": "Cerca",
            "zeroRecords": "La ricerca non ha prodotto risultati",
            "paginate": {
              "first": "Prima",
              "last": "Ulima",
              "next": "Prossima",
              "previous": "Precedente"
            },
            "aria": {
              "sortAscending": ": ordina i dati in modo ascendente ",
              "sortDescending": ": aordina i dati in modo discendente"
            },

          },
          responsive: true,
          "paging": false,
          ordering: true,
          "info": false,

          columns: [
            { title: "Linea" },
            { title: "Fascia" },
            { title: "Fermata" },
            { title: "Ora" },

            { title: "Posti occupati" },
            { title: "Posti disponibili" },
            { title: "Posti totali" },
            { title: "Bagagli occupati" },
            { title: "Bagagli disponibili" },
            { title: "Bagagli totali" },

          ],
          dom: 'Bfrtip',
          buttons: [
            'copy', 'csv', 'excel', 'print', 'pdf'
          ],
        });
      }


    }, 0);

  }
  carica(data: string): void {
    if (!this.share.commonF.isEmpty(data)) {
      this.caricamento = true;
      this.rem.dashboard.get(data).subscribe(
        data => {
          this.ris = data["data"];
          this.calcolaTabella();
          this.caricamento = false;
        },
        error => {
          sessionStorage["500"] = error["message"];
          this.share.go("/500");
          this.caricamento = false;
        });
    }

  }
}
