import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { commonFunctionModule } from 'src/app/module/commonFunction/commonFunction.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // Import it up here

declare var $: any;
declare var Push: any;

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class NotificationsModule {

  public constructor(protected commonF: commonFunctionModule) {

  }



  private _permessoNotifiche = true;
  private _visualizzaNotifiche = true;

  private _notifiche = [];
  private _codaNotifiche = [];
  private _contatoreNotificheVisualizzate = 0;
  private _inRimozione = false;


  public setPermessoNotifiche(permesso: boolean) {
    this._permessoNotifiche = permesso;
    if (permesso == false) {

      this._notifiche = [];
      this._codaNotifiche = [];
      this._contatoreNotificheVisualizzate = 0;
      this._inRimozione = false;
    }
  }

  public setVisualizzazioneNotifiche(permesso: boolean) {
    this._visualizzaNotifiche = permesso;
    this.segnaTutteComeVisualizzate();

  }

  public contaNotifiche() {
    return this._notifiche.length;
  }

  public contaNotificheVisualizzate() {
    return this._contatoreNotificheVisualizzate;
  }

  public getNotifiche() {

    return this._notifiche;

  }

  public getNotificheReverse() {

    var reverse = this._notifiche.slice().reverse();
    return reverse;

  }

  public contaCodaNotifiche() {

    return this._codaNotifiche.length;

  }



  private pushNotifica(notifica) {
    if (this._visualizzaNotifiche) {
      var notificato = false;
      for (let i = 0; i < this._notifiche.length && !notificato; i++) {
        if (this._notifiche[i].id == notifica.id) {
          this._contatoreNotificheVisualizzate++;
          setTimeout(() => {

            this._notifiche[i].visibile = true;

            if (notifica.durata > 0) {
              setTimeout(() => {
                this.visualizzaNotifica(notifica.id)
              }, notifica.durata);
            }

          }, 50);

        }
      }
    }
  }


  public creaNotifica(notifica) {

    if (!this._permessoNotifiche) {
      return false;
    }
    const { id, titolo, testo, ora = "", icona = "", durata = 0, buttons = [], notificata, eliminata } = notifica;

    try {
      for (let i = 0; i < this._notifiche.length; i++) {
        if (this._notifiche[i].id == id) {
          return false;
        }
      }
      if (!this.commonF.isEmpty(titolo) && !this.commonF.isEmpty(testo)) {
        notifica.id = id;
        notifica.titoloLungo = titolo;
        notifica.testo = this.commonF.troncaTesto(testo, 70);
        notifica.testoLungo = testo;
        notifica.titolo = this.commonF.troncaTesto(titolo, 20);
        notifica.eliminata = true;
        notifica.visibile = false;



        setTimeout(() => {
          notifica.eliminata = false;
        }, 100);

        this._notifiche.push(notifica);
        if (notifica.notificata == false) {
          if (this._contatoreNotificheVisualizzate == 0) {

            this.pushNotifica(notifica);
          }
          else {
            this._codaNotifiche.push(notifica);
          }
        }

      }
      else {
        throw "Non ci sono i parametri necessari per creare la notifica";
      }
    }
    catch (ex) {
      console.log(ex.message);
    }
  }

  public eliminaNotifica(id) {

    this.visualizzaNotifica(id, true);

  }
  public eliminaTutte() {
    this._notifiche = [];
  }

  public cont1 = 0;
  public cont2 = 0;
  public visualizzaNotifica(id, elimina = false) {
    try {

      if (!this._inRimozione) {

        var trovato = false;

        this._inRimozione = true;

        for (let i = 0; i < this._notifiche.length && !trovato; i++) {
          if (this._notifiche[i].id === id && this._notifiche[i].visibile) {



            this._notifiche[i].visibile = false;

            trovato = true;

            setTimeout(() => {
              this._notifiche[i].notificata = true;
              if (this._contatoreNotificheVisualizzate > 0) {
                this._contatoreNotificheVisualizzate--;

              }


              this._inRimozione = false;
              this._notifiche[i].notificata = true;

              if (elimina) {
                this._notifiche[i].eliminata = true;

              }


              this.risolviCodaNotifiche();
            }, 100);
          }
          else if (this._notifiche[i].id === id && !this._notifiche[i].visibile && elimina == true) {
            this._notifiche[i].eliminata = true;


          }
          else if (this._notifiche[i].id == id && !this._notifiche[i].visibile) {
            this._notifiche[i].notificata = true;
          }

        }
        this._inRimozione = false;
      }
      else {
        setTimeout(() => {
          this.visualizzaNotifica(id);
        }, 200);
      }

    }
    catch (ex) {
      console.log(ex.message);
    }


  }

  public segnaTutteComeVisualizzate() {
    this._inRimozione = true;
    this._codaNotifiche = [];
    for (let i = 0; i < this._notifiche.length; i++) {

      this._notifiche[i].visibile = false;
      this._notifiche[i].notificata = true;
    }
    this._contatoreNotificheVisualizzate = 0;
    this._inRimozione = false;
  }

  private risolviCodaNotifiche() {
    if (this._codaNotifiche.length > 0) {
      var notifica = this._codaNotifiche[0];
      this._codaNotifiche = this._codaNotifiche.slice(1, this._codaNotifiche.length);
      this.pushNotifica(notifica);
    }
  }
}
