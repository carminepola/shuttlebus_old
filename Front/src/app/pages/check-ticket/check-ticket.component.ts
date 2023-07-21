import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;
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
  printDiv(currentDiv){
 
      var divToPrint = $("#"+currentDiv).html();
      var printWindow = window.open('');
     
      printWindow.document.write(divToPrint);
    
      printWindow.document.close();
      printWindow.print();
  
  }
  downloadDiv(currentDiv, ticketid){
    var HTML_Width = $("#"+currentDiv).width();
    var HTML_Height = $("#"+currentDiv).height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#"+currentDiv)[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) { 
            pdf.addPage(PDF_Width, "p");
           
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
        }
        pdf.save("Your_PDF_Name.pdf");
        $(".html-content").hide();
    });
  
   
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
