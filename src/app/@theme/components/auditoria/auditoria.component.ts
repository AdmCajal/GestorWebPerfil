import { Component, Input, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../util/ComponenteBasePrincipa';
import { UsuarioAuth } from '../../../precisa/auth/model/usuario';

@Component({
  selector: 'ngx-auditoria',
  styleUrls: ['./auditoria.component.scss'],
  templateUrl: './auditoria.component.html',
})



export class AuditoriaComponent extends ComponenteBasePrincipal implements OnInit {

  @Input() creacionUsuario: string;
  @Input() creacionFecha: Date; 
  @Input() modificacionFecha: Date;
  // Auth = this.getUsuarioAuth().data;


  @Input() dataEntrante: any;
  @Input() tipoAuditoria: string;
  @Input() modificacionUsuario: string;
  

  @Input() aprobacionUsuario = '';
  @Input() aprobacionFecha = new Date();

  date3: Date;


  ngOnInit(): void {
    this.date3 = new Date()
   // console.log("entrandooo", this.creacionUsuario, this.creacionFecha, this.modificacionFecha);

  }




}
