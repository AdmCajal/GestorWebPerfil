import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.routes';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbInputModule, NbCardModule, NbButtonModule } from '@nebular/theme';
import { DropdownModule } from 'primeng/dropdown';
import { LoginService } from './service/login.service';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { DialogModule } from 'primeng/dialog';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {PasswordModule} from 'primeng/password';
import { LoginComponent } from './login/login.component';
import { HeaderMComponent } from './shared/app-header/header-m.component';

//import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [LoginComponent,AuthComponent, RequestPasswordComponent, ResetPasswordComponent,HeaderMComponent],
  imports: [
    //MatFormFieldModule,
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    DropdownModule,
    DialogModule,
    PasswordModule
  ],providers:[LoginService]
})
export class AuthModule { }
