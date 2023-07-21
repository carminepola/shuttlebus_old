import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-search-from-mail',
  templateUrl: './search-from-mail.component.html',
  styleUrls: ['./search-from-mail.component.scss']
})
export class SearchFromMailComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute) { }

  public caricamento = false;
  public id = "";
  public ris: any;
  public cercato = false;
  public searchText = "";
  public limitTo = 9;
  public maxScroll = 0;
  ngOnInit(): void {
    this.route.params.subscribe((params) => this.id = params.id);
    if (!this.share.commonF.isEmpty(this.id)) {
      this.carica();
    }
    
  }
  vaiacercaMail(id: string = "") {
    
    if (this.share.commonF.isEmpty(id)) {
      this.share.go("checkticket")
    } else {
      this.share.go("checkticket/" + id.toLowerCase())
    }


  }
  carica(): void {
    
    if (!this.share.commonF.isEmpty(this.id)) {
      this.caricamento = true;
      
      this.rem.tickets.getTicketsMail(this.id).subscribe(
        data => {
          this.cercato = true;
          this.ris = data["data"];

          if(!this.share.commonF.isEmpty(this.ris)){
            localStorage["mail"] = this.id
          }

          this.caricamento = false;
        },
        error => {
          this.cercato = true;
          sessionStorage["500"] = error["message"];
          this.share.go("/500");
          this.caricamento = false;
        });
    }
  }

}
