import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ArrayType } from '@angular/compiler';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.scss']
})
export class UtentiComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }
  obj: any = [];
  public caricamento: boolean = true;
  ngOnInit() {
    this.caricamentoUtente();
  }

  disabilitaUtente(id, bool) {
    this.rem.user.disableUser(id, bool).subscribe(
      data => {

        console.log('%c Lista utenti', 'background: #222; color: #bada55');
        console.log(data);
        console.log(bool)
        var stato = "attivato";
        if (bool == true) {
          stato = "diattivato"
        }
        if (!this.share.catchEx(data["error"])) {
          var alert = {

            'testo': "Utente " + stato,
            'tipo': "alert-success",
            'delay': 3000

          };
          this.share.alert.generateAlert(alert);

        }

      },
      error => {


        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
        return false;

      }
    );
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

    this.rem.user.deleteUser(id).subscribe(
      data => {

        console.log('%c Lista utenti', 'background: #222; color: #bada55');
        console.log(data);

        if (!this.share.catchEx(data["error"])) {
          Swal.fire({
            icon: 'success',
            title: 'Utente cancellato',


          });

          for (let i = 0; i < this.obj.length; i++) {
            if (this.obj[i].id == id) {
              this.obj[i].cancellato = true;

            }

          }
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Utente cancellato',


          });

        }







      },
      error => {
        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
        return false;

      }
    );


  }

  eliminaUtente(id) {

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
          title: "Sei sicuro di voler cancellare l'utente",

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
  caricamentoUtente() {
    this.caricamento = true;
    var datiUrl = this.share.getDataFromRoute();
    console.log(datiUrl);



    this.rem.user.getUser('').subscribe(
      data => {


        console.log('%c Lista utenti', 'background: #222; color: #bada55');
        console.log(data);

        this.caricamento = false;

        if (!this.share.catchEx(data["error"])) {

          this.obj = data["data"];




        }




      },
      error => {
        this.caricamento = false;
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      }

    );
  }
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
      if (this.limitTo < this.obj.length) {
        return (window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight;
      }
    }
    return false;

  }
}
