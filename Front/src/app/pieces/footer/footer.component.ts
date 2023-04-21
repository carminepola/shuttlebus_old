import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public share: SharedModule) { }

  public policy: boolean = false;


  ngOnInit() {
    
    if (localStorage["policy"] != "true") {
      this.policy = true;

    }


  }
  policySet() {
    debugger

    this.policy = false;
    localStorage["policy"] = true;
  }

}
