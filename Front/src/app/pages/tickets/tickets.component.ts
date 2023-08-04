import { Component, OnInit, HostListener,OnChanges } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {


  constructor(public share: SharedModule, public rem: RemService) { }
  public searchText: string = ""
  public data: any;
  public caricamento = true;
  public annullamento = false;
  public giorno = this.share.commonF.convertData(new Date(), 0, 'time', '-');
  public dataSearch = this.initMonth();
  @HostListener("window:scroll", [])
  initMonth(){
    let data = new Date().getFullYear()+"-";
    if(new Date().getMonth()< 10)
    {
       data += "0" + (parseInt(new Date().getMonth().toString()) + 1);
    }
    else
    {
      data +=  new Date().getMonth();
    }
    return data;
  }
  
  
   ngInitTicket() {

    for(let i = 0; i < this.data.length;i++)
    {
      let id = this.data[i].riferimento;

      this.rem.tickets.getTicketsShort(id).subscribe(
        data => {


          this.data[i] = data["data"][0];




        });
    }







  }
   
  ngOnInit(): void {
    this.caricaDati(this.dataSearch);
  }

  delete(riferimento: string, idfascia: string, idlinea: string, data: string, item: any) {

    this.rem.tickets.put(riferimento.toString(), idfascia.toString(), idlinea.toString(), data.toString()).subscribe(
      data => {

        console.log(data);
        this.caricamento = false;
        if (!this.share.catchEx(data["error"])) {
          this.annullamento = false;
          item.rimborsato = true;
        }
      },
      error => {
        this.annullamento = false;
        this.caricamento = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      });

  }
  annulla(item: any) {
    try {

      this.annullamento = true;
      var riferimento = item.riferimento;
      var idfascia = item.idfascia;
      var idlinea = item.idlinea;
      var data = this.giorno;
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-success mr-2',
          cancelButton: 'btn btn-danger',
          title: "",
          popup: "bg-white",

        },
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        },
        icon: "question",
        buttonsStyling: false,
        title: "Sei sicuro di voler annullare il biglietto? L'azione è irrevesibile",

        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'Annulla',
        showLoaderOnConfirm: true,

      }).then((result) => {

        if (result.value) {

          this.delete(riferimento, idfascia, idlinea, data, item);
        }
        else {
          this.annullamento = false;
        }
      })

    } catch (ex) {
      this.annullamento = false;
      console.error(ex.message);
    }

  }

  caricaDati(giorno:string) {

    this.annullamento = false;

    this.caricamento = true;
    this.rem.tickets.get(giorno).subscribe(
      data => {
        this.data = [];
        console.log(data);
        this.caricamento = false;
        if (!this.share.catchEx(data["error"])) {
          let temprarydata = data["data"] ;

          temprarydata.forEach(element => {


            
             element["backup"] = JSON.parse(element["backup"]);
              
             let indexBiglietto = element["backup"].elementi.findIndex(e => e.datiBiglietto.idlinea ==  element["idLinea"] && e.datiBiglietto.guid == element["idFascia"]);
             debugger
             if(indexBiglietto > -1)
             {


               
              let dati = element["backup"]["elementi"][indexBiglietto];

              element["data"] = this.share.commonF.dataToString(element.data,'-')
              element["dataViaggio"] = this.share.commonF.dataToString(element.dataViaggio)
              element["from"] =  dati["from"];
              element["to"] = dati["to"];
              element["prezzo"] = dati["prezzo"];
              element["partenza"] = dati.datiBiglietto["partenza"].substring(0,5);
              element["arrivo"] = dati.datiBiglietto["arrivo"].substring(0,5);
              element["bagagli"] = dati.datiBiglietto["numeroBagagliOpzionali"];
              element["idfascia"] = dati.datiBiglietto["guid"];
              element["idlinea"] = dati.datiBiglietto["idlinea"];
              let biglietti = "<ul>";
              let posti = 0;


              for(let i = 0; i < dati.datiBiglietto.biglietti.length; i++)
              {
                let x = dati.datiBiglietto.biglietti[i];
                if(x.numero > 0)
                {
                  posti +=x.numero;
                  biglietti +="<li>X"+x.numero +" " + x["traduzioniNome"][0]["it"] +" "+x.costo+"€</li>";
                }

              }
             
              element["posti"] = posti;
               element["dettagli"] = biglietti +"</br>"; 

             }
             
             this.data.push(element);
          });




        }
      },
      error => {
        this.caricamento = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      }

    );

  }

}
