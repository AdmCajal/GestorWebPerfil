import { Component } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  template: `<ngx-login-column-layout>
  
        <router-outlet></router-outlet>
  
  </ngx-login-column-layout>`,
})
export class AuthComponent {
}
