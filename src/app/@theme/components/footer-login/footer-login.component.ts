import { Component, Input, OnInit } from '@angular/core';
import { Portal } from '../../../precisa/auth/model/portal';
import { LoginService } from '../../../precisa/auth/service/login.service';

@Component({
  selector: 'ngx-footer-login',
  styleUrls: ['./footer-login.component.scss'],
  templateUrl: './footer-login.component.html'
})
export class FooterLoginComponent implements OnInit {

  @Input() objPortal = new Portal();

  ngOnInit(): void {
    this.listarPortal()
  }

  constructor(private loginService: LoginService){}

  listarPortal(): Promise<number> {
    let portal = {Idportal:1,Estado:'A'}
    return this.loginService.listarPortal(portal).then(
      portal => {
        if (portal.length > 0) {
          this.objPortal = portal[0]
        }
        return 1
      }
    )
  }
  

}
