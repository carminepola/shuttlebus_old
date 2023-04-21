import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { commonFunctionModule } from 'src/app/module/commonFunction/commonFunction.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class AlertsModule {

  private _alertArray = [];
  private _quequeAlert = [];

  public getAlert() {
    return this._alertArray;
  }
  public constructor(protected commonF: commonFunctionModule) {
  }

  private count = 0;

  public dimissAlert(id) {
    try {
      var trovato = false;
      for (var i = 0; i < this._alertArray.length && !trovato; i++) {
        if (this._alertArray[i].id === id) {
          trovato = true;
          if (this._alertArray[i].show) {
            this.count--;
            this._alertArray[i].show = false;
          }
        }
      }
      this._resolveQueue();
      setTimeout(() => {
        if (this.count == 0) {
          this._alertArray = [];
        }
      }, 401);
    }
    catch (ex) {
      console.error(ex.message);
    }
  }

  private _resolveQueue() {
    if (this._quequeAlert.length > 0) {
      let newAlert = this._quequeAlert[0];
      this._quequeAlert = this._quequeAlert.slice(1, this._quequeAlert.length);
      this.generateAlert(newAlert);
    }
  }

  public generateAlert(alert) {
    const { testo, tipo, delay } = alert;
    alert.testoCorto = this.commonF.troncaTesto(alert.testo, "100");
    try {
      if (this.count < 3) {
        this.count++;
        alert.id = this.commonF.NewGuid();
        this._alertArray.push(alert);
        setTimeout(() => {
          alert.show = true;
          if (delay > 0) {
            setTimeout(() => {
              this.dimissAlert(alert.id);
            }, delay);
          }
        }, 200);
      }
      else {
        this._quequeAlert.push(alert);

      }
    }
    catch (ex) {
      console.error(ex.message);
    }
  }
}
