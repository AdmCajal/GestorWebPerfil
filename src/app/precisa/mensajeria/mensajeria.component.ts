import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-mensajeria',
  template: `<router-outlet></router-outlet>`,
  styles: [`::ng-deep.nb-theme-default h5, .nb-theme-default .h5 {
    font-family: Open Sans, sans-serif;
    font-weight: 700;
    line-height: 2rem;
    font-size:1.1rem;
    width:320px;
  }`]
})
export class MensajeriaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
