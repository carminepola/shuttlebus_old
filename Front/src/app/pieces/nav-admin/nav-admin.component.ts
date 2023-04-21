import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';

@Component({
  selector: 'app-nav-admin',
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.scss']
})
export class NavAdminComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }


  ngOnInit() {
  }
  logout() {
    try {
      this.rem.login.logout().subscribe(
        data => {
          console.log(data);
          if (!this.share.catchEx(data["error"])) {

          }
        },
        error => {
          sessionStorage["500"] = error["message"];
          this.share.go("/500");
        }
      );
      this.share.terminaSessione(true);
      this.share.go("");
    } catch (ex) {
      console.error(ex.message);
    }
  }
}
