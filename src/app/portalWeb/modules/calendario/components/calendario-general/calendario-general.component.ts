import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ComponentesCompartidosModule } from '../../../../shared/componentes-compartidos.module';

import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
    selector: 'app-calendario-general',
    standalone: true,
    imports: [CommonModule, ComponentesCompartidosModule],
    templateUrl: './calendario-general.component.html',
    styleUrls: ['./calendario-general.component.scss'],
    providers: [MessageService]
})
export class CalendarioGeneral implements OnInit, OnDestroy {

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        locales: [esLocale],
        locale: 'es', // Configura el idioma a español
        plugins: [dayGridPlugin]
    };


    ngOnDestroy(): void {
        
    }
    ngOnInit(): void {
    }
}
