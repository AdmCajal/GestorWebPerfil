import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  position:string='top'
  dialog:boolean=false
  resetForm:FormGroup


  constructor(private formBuild:FormBuilder) { }

  ngOnInit(): void {
    this.cargarValidacion()
  }

  cargarValidacion(){
    this.resetForm= this.formBuild.group({
      password:['',[Validators.required,Validators.maxLength(9)]],
      confirmPassword:['',[Validators.required,Validators.maxLength(9)]],
      usuario:['',[Validators.required,Validators.maxLength(100)]]
    })
 
  }

  get usuarioField(){
    return this.resetForm.get('usuario')
  }

  get passwordField(){
    return this.resetForm.get('password')
  }

  get confirmPasswordField(){
    return this.resetForm.get('confirmPassword')
  }

  resetPass(){

    if(this.resetForm.valid){
      console.log(this.resetForm.value)
    }else{
   
      this.resetForm.markAllAsTouched();
    }
  }

  iniciarComponente(){
    this.dialog=true
    this.cargarValidacion()   
  }
}
