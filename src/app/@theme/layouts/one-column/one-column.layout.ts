import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed style="background-image: linear-gradient(#ffffff, #e8e9e9, #fbfbfb)" >
        <ngx-header style="color:red !important" ></ngx-header>
       
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" style=" background-repeat: no-repeat;
      background-size: cover;
      "   responsive>
        <ng-content select="nb-menu"  style="background-image: url('assets/img/textura12.jpg'); background-color:blue"></ng-content>
      </nb-sidebar>


     
      
      <nb-layout-column style="padding: 1.25rem 1.25rem 0.75rem;" >
        <ng-content select="router-outlet"  ></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent { }
