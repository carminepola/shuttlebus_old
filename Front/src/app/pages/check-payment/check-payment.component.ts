import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-check-payment',
  templateUrl: './check-payment.component.html',
  styleUrls: ['./check-payment.component.scss']
})
export class CheckPaymentComponent implements OnInit {

  constructor(public s: SharedModule, public rem: RemService, public route: ActivatedRoute) { }

  public biglietto: string = "";
  public tipo: string = "";
  public ris: any;
  public message: any;
  public visualizzaAcquisti: boolean = true;
  ngOnInit(): void {
    this.route.params.subscribe((params) => this.tipo = params.tipo);
    this.route.params.subscribe((params) => this.biglietto = params.id);

    setTimeout(() => {
      this.pagamento();
  
    }, 5000);
      this.s.svuotaCarrello();
    
  }
  isLocalMail(){
    
    if(localStorage["mail"])
    {
      return localStorage["mail"];
    }
    return "";
  }
  pagamento(): void {
    switch (this.tipo) {
      case "private":

        this.rem.pagamenti.privato(this.biglietto).subscribe(
          data => {
            debugger

            this.ris = data["data"];
            this.message = data["error"]["message"];
            localStorage["sessionID"] = this.s.commonF.NewGuid();
            let error = data["error"]["code"];
            if(error.toString() === "0")
            {
              let user = JSON.parse(localStorage["datiUtente"]);
              localStorage["mail"] = user.email;
              this.visualizzaAcquisti = true;
            }

          }
        )
        break;
      case "paypal":
        debugger
        var bigliettoSplit = this.biglietto.split("?");
        var biglietto = bigliettoSplit[0];
        this.rem.pagamenti.paypal(biglietto).subscribe(
          data => {
            localStorage["sessionID"] = this.s.commonF.NewGuid();
            this.ris = data["data"];
            this.message = data["error"]["message"];
            let error = data["error"]["code"];
            if(error.toString() === "0")
            {
              let user = JSON.parse(localStorage["datiUtente"]);
              localStorage["mail"] = user.email;
              this.visualizzaAcquisti = true;
            }

            if(this.ris =="refresh")
            {
              setTimeout(() => {
            
                this.ris =="";
                this.pagamento();
            
              }, 5000);

            }
           
           
 
          }
        )
        console.log(biglietto);
        break;
    }
  }
}
