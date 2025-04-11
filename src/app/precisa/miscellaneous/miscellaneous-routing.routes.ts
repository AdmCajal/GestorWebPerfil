import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPrecisaComponent } from './not-found/not-found-precisa.component';


const routes: Routes = [{
  path: '',
  component: NotFoundPrecisaComponent,
  children: [
    {
      path: '404',
      component: NotFoundPrecisaComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiscellaneousRoutingModule { }
