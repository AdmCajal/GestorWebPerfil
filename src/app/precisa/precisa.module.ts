import { HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ThemeModule } from '../@theme/theme.module';
import { ECommerceModule } from '../pages/e-commerce/e-commerce.module';
import { PrecisaIndexComponent } from './precisa-index.component';
import { PrecisaRoutingModule } from './precisa-routing.module';

/**
 * SE ELIMINO Y COMENTO LA PROPIEDAD LocationStrategy por descontinuidad
 */
@NgModule({
  imports: [
    PrecisaRoutingModule,
    ThemeModule,
    NbMenuModule,
    ECommerceModule,
    ConfirmDialogModule,
  ],
  declarations: [
    PrecisaIndexComponent,


  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy, useValue: "/Precisa/" },

  ],

})
export class PrecisaModule {
}
