import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-lista-biglietti',
  templateUrl: './lista-biglietti.component.html',
  styleUrls: ['./lista-biglietti.component.scss']
})
export class ListaBigliettiComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }

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

  public data: any = [];
  public ris: object;
  ngOnInit() {
    this.caricaBiglietti();
  }
  caricaBiglietti() {


    this.rem.biglietti.getBiglietti().subscribe(
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
  elimina(id) {

    try {
      if (!this.share.commonF.isEmpty(id)) {

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
          title: "Sei sicuro di voler cancellare il biglietto",

          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'Annulla',
          showLoaderOnConfirm: true,

        }).then((result) => {
          if (result.value) {
            this.delete(id);
          }
        })



      }
      else {
        throw "Almeno l'id passalo";
      }

    }
    catch (ex) {
      console.error(ex.message);
    }

  }
  delete(id) {


    Swal.fire({
      customClass: {

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

      showConfirmButton: false,
      html: '<div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"><span class="sr-only">Loading...</span></div>',
      allowOutsideClick: false,
      allowEnterKey: false,
      allowEscapeKey: false,

    });


    this.rem.biglietti.delete(id).subscribe(
      data => {

        console.log('%c delete biglietto', 'background: #222; color: #bada55');
        console.log(data);

        if (!this.share.catchEx(data["error"])) {
          Swal.fire({
            icon: 'success',
            title: 'Biglietto cancellato',


          });

          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id == id) {
              this.data[i].cancellato = true;

            }

          }
        }
        else {
          Swal.fire({
            icon: 'error',
            title: data["error"]["message"],


          });

        }



      });


  }
}