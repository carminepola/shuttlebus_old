import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-linee',
  templateUrl: './linee.component.html',
  styleUrls: ['./linee.component.scss']
})
export class LineeComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }
  public searchText = "";
  public limitTo = 9;
  public maxScroll = 0;

  public ris: any;
  public data: any;
  public caricamento: boolean = true;
public date:any;

  ngOnInit() {
    this.carica();
    this.date = [];
  }

  carica() {
    this.rem.linee.getAll().subscribe(
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
          title: "Sei sicuro di voler cancellare la linea",

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
  disabilitaLinea(id, set) {
    this.rem.linee.disable(id, set).subscribe(
      data => {
        if (!this.share.catchEx(data["error"])) {
          var stato = "attivata";
          if (set == true) {
            stato = "diattivata"
          }
          if (!this.share.catchEx(data["error"])) {
            var alert = {

              'testo': "Linea " + stato,
              'tipo': "alert-success",
              'delay': 3000

            };
            this.share.alert.generateAlert(alert);

          }


        }
      },
      error => {
        this.caricamento = false;
        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");
      });
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


    this.rem.linee.delete(id).subscribe(
      data => {

        console.log('%c delete linee', 'background: #222; color: #bada55');
        console.log(data);

        if (!this.share.catchEx(data["error"])) {
          Swal.fire({
            icon: 'success',
            title: 'Linea cancellata',


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
            title: 'Linea non cancellata',


          });

        }



      });


  }

}

