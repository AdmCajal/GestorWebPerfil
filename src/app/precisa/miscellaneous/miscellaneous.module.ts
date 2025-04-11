import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.routes';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundPrecisaComponent } from './not-found/not-found-precisa.component';

@NgModule({
  imports: [
    MiscellaneousRoutingModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule
  ],
  declarations: [
    MiscellaneousComponent,
    NotFoundPrecisaComponent
  ],
})
export class MiscellaneousModule { }
