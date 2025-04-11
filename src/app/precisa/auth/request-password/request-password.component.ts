import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-request-password',
  templateUrl: './request-password.component.html'
})
export class RequestPasswordComponent implements OnInit {

  position:string='top'
  dialog:boolean=false
  recuperarForm:FormGroup

  constructor(private formBuild:FormBuilder) { }

  ngOnInit(): void {
      this.cargarValidacion()
  }

  cargarValidacion(){
    this.recuperarForm= this.formBuild.group({
      correo:['',[Validators.required,Validators.email,Validators.maxLength(100)]]
    })
  }

  get correoField(){
    return this.recuperarForm.get('correo')
  }

  recuperarClave(){
    if(this.recuperarForm.valid){

    }else{

    }
  }

  iniciarComponente(){
    this.dialog=true
    this.cargarValidacion()
  }
}
