import { Component, OnInit } from '@angular/core';
import { BD } from './../../services/bd.service'
import { appService } from './../../services/app.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[BD, appService]
})
export class LoginComponent implements OnInit {

  public formulario:FormGroup = new FormGroup({
    'email': new FormControl(null,[Validators.required]),
    'senha': new FormControl(null)
  });

  public mensagem:string = "";

  constructor(
    private _bd : BD,
    private _service : appService,
    public router: Router
  ) { }

  ngOnInit(): void {
    if(this._service.autenticado())
    {
      this.router.navigate(["/menu"])
    }
  }

  logar(){
    console.log("logando");
    
    this._bd.autenticar(this.formulario.value.email, this.formulario.value.senha).then(res =>{
      console.log("passou")
    },err =>{
      this.mensagem = "Email ou senha Inválidos"  
    });
  }
}
