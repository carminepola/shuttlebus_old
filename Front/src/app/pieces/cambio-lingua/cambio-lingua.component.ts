import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { SEOService } from 'src/app/services/seo/seo.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-cambio-lingua',
  templateUrl: './cambio-lingua.component.html',
  styleUrls: ['./cambio-lingua.component.scss']
})
export class CambioLinguaComponent implements OnInit {

  constructor(public share: SharedModule, private seo: SEOService, private localeService: BsLocaleService) { }

  ngOnInit() {
  }
  locales = listLocales();
  public correggiLingua(lng: string) {
    if (!this.share.commonF.isEmpty(lng)) {
   
      this.localeService.use(lng);
      switch (lng.toLowerCase()) {

        case "en":
          return "gb";
        default:
          return lng;
      }

    }

  }

}
