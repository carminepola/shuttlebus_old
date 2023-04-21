import { Component, OnInit } from '@angular/core';
import { error } from 'protractor';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {

  constructor() { }
  public _error = "";
  ngOnInit() {
    this._error = sessionStorage["500"];
  }

}
