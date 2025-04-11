import { Component } from '@angular/core';

@Component({
  selector: 'ngx-login-column-layout',
  styleUrls: ['./login-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      
      <nb-layout-column style='padding: 0rem;background-color: #f9f6f6;'>
        <ng-content select="router-outlet"  class='p-shadow-13'></ng-content>
      </nb-layout-column>
      
    
    </nb-layout>
  `,
})
export class LoginColumnLayoutComponent {}
