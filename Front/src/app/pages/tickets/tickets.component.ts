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
  public searchText = "";
  public limitTo = 9;
  public maxScroll = 0;
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
  onScroll(): void {
    if (this.bottomReached()) {

      this.limitTo = this.limitTo + 10;
    }
  }
  searchItems(x, limitTo, searchItems) {

    if (this.share.commonF.isEmpty(searchItems)) {

      return x.slice(0, limitTo);
    }
    return x;

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
  bottomReached(): boolean {

    this.maxScroll = window.screenY;
    if (this.maxScroll + 100 > window.screenY) {
      if (this.limitTo < this.data.length) {
        return (window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight;
      }
    }
    return false;

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
        this.data = data;
        console.log(data);
        this.caricamento = false;
        if (!this.share.catchEx(data["error"])) {
          this.data = data["data"];




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
