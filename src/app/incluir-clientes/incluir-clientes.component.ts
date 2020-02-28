import { Component, OnInit,Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { appService } from './../../services/app.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Clientes } from '../../models/clientes';
import {BD} from '../../services/bd.service'
import * as firebase from 'firebase'

@Component({
  selector: 'app-incluir-clientes',
  templateUrl: './incluir-clientes.component.html',
  styleUrls: ['./incluir-clientes.component.css'],
  providers: [appService,BD]
})
export class IncluirClientesComponent implements OnInit {

  public formulario: FormGroup = new FormGroup({
    'nome': new FormControl(null, [Validators.required]),
    'cnpj': new FormControl(null, [Validators.required]),
    'cep': new FormControl(null, [Validators.required]),
    'endereco': new FormControl(null, [Validators.required]),
    'complemento': new FormControl(null, [Validators.required]),
    'cidade': new FormControl(null, [Validators.required]),
    'estado': new FormControl(null, [Validators.required])
  })

  constructor(
    private http: HttpClient,
    private _service : appService,
    private _bd : BD
  ) { }

  ngOnInit(): void {
  }

  cadastrarCliente(){
    
    console.log("cadastrarCliente");
    if( this.formulario.status == "VALID")
    {

      let _cliente = new Clientes(
        this.formulario.value.nome,
        this.formulario.value.cnpj,
        this.formulario.value.endereco,
        this.formulario.value.complemento,
        this.formulario.value.cidade,
        this.formulario.value.estado,
        this.formulario.value.cep
      )

      this._bd.cadastrarCliente(_cliente);
    }
    
  }

  mascaraCNPJ(valor: any)
  {
      //Coloca ponto entre o segundo e o terceiro dígitos
     let v=valor.value.replace(/^(\d{2})(\d)/,"$1.$2")

      //Coloca ponto entre o quinto e o sexto dígitos
      v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3")

      //Coloca uma barra entre o oitavo e o nono dígitos
      v=v.replace(/\.(\d{3})(\d)/,".$1/$2")

      //Coloca um hífen depois do bloco de quatro dígitos
      v=v.replace(/(\d{4})(\d)/,"$1-$2")

      valor.value = v
  }

  
  mascaraCEP(valor: any){
    
    let v:string  = valor.value
    v = v.replace(/^(\d{5})(\d)/,"$1-$2")
    
    valor.value = v
  }

  confereCep(valor){
    
    if(valor.value.length == 9)
    {
      let cep = valor.value.replace("-","");
      
      this._service.consultarCep(cep).then(res =>{
        if(res.erro)
        {
          
        }else{
          console.log(res);
          this.formulario.controls['endereco'].setValue(res.logradouro);
          this.formulario.controls['complemento'].setValue(res.complemento);
          this.formulario.controls['cidade'].setValue(res.localidade);
          this.formulario.controls['estado'].setValue(res.uf);
        }
      }); 
    } 
  }
}
