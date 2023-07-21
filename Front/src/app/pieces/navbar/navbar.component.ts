import { Component, OnInit, OnChanges } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public share: SharedModule) { }

  ngOnInit() {
    if (!localStorage["sessionID"]) {

      localStorage["sessionID"] = this.share.commonF.NewGuid();
    }
  }

  isLocalMail(){
    
    if(localStorage["mail"])
    {
      return localStorage["mail"];
    }
    return "";
  }

}
