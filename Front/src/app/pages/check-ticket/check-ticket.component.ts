import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-check-ticket',
  templateUrl: './check-ticket.component.html',
  styleUrls: ['./check-ticket.component.scss']
})
export class CheckTicketComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService, public route: ActivatedRoute) { }

  public caricamento = false;
  public id = "";
  public ris: any;
  public cercato = false;
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
      if (this.limitTo < this.ris.length) {
        return (window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight;
      }
    }
    return false;

  }
  ngOnInit(): void {

    this.route.params.subscribe((params) => this.id = params.id);
    if (!this.share.commonF.isEmpty(this.id)) {
      this.carica();
    }

  }
  carica(): void {
    if (!this.share.commonF.isEmpty(this.id)) {
      this.caricamento = true;
      this.rem.tickets.getTickets(this.id).subscribe(
        data => {
          this.cercato = true;
          this.ris = data["data"];

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
