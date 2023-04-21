import { Component, OnInit } from '@angular/core';
import { RemService } from 'src/app/services/REM/rem.service';
import { SharedModule } from 'src/app/module/shared/shared.module';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-lista-traduzioni',
  templateUrl: './lista-traduzioni.component.html',
  styleUrls: ['./lista-traduzioni.component.scss']
})
export class ListaTraduzioniComponent implements OnInit {

  constructor(public rem: RemService, public share: SharedModule) { }
  public ris: any;
  public data: any;
  public caricamento: boolean = true;
  ngOnInit() {
    this.carica();
  }

  carica() {

    this.rem.traduzioniService.getDizionario().subscribe(
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
          title: "Sei sicuro di voler cancellare la traduzione",

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
    this.rem.traduzioniService.delete(id).subscribe(
      data => {

        console.log('%c delete fermate', 'background: #222; color: #bada55');
        console.log(data);

        if (!this.share.catchEx(data["error"])) {
          Swal.fire({
            icon: 'success',
            title: 'Traduzione cancellata',


          });

          var a = [];
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id != id) {
              a.push(this.data[i]);
            }


          }
          this.data = a;
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
