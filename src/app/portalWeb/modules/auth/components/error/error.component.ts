import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-error',
    imports: [ButtonModule, RippleModule, RouterModule, AppFloatingConfigurator, ButtonModule],
    standalone: true,
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class Error {}
