import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-not-found-precisa',
  styleUrls: ['./not-found-precisa.component.scss'],
  templateUrl: './not-found-precisa.component.html',
})
export class NotFoundPrecisaComponent {

  constructor(private menuService: NbMenuService) {
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
