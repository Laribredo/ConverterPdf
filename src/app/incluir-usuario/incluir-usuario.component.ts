import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BD } from '../../services/bd.service';

@Component({
  selector: 'app-incluir-usuario',
  templateUrl: './incluir-usuario.component.html',
  styleUrls: ['./incluir-usuario.component.css']
})
export class IncluirUsuarioComponent implements OnInit {

  formulario:FormGroup = new FormGroup({
    'email':new FormControl(null,[Validators.required, Validators.email]),
    'senha': new FormControl(null),
    'senhaAntiga': new FormControl(null)
  })

  constructor(
    private _bd : BD
  ) { }

  ngOnInit(): void {
  }

  cadastrarUsuario(){
    if( this.formulario.status == "VALID")
    {
      let usuario = new Usuario(
        this.formulario.value.email,
        this.formulario.value.senha
      )
      this._bd.cadastrarUsuario(usuario)
    }else{
      alert("Revise os campos digitados");
    }
  }

  alterarSenha(){
    if(this.formulario.value.senha.length == 0)
    {
      alert("O campo senha não pode estar vazio para a alteração de senha")
    }else{
      this._bd.alterarSenha(this.formulario.value.senhaAntiga,this.formulario.value.senha).then(res =>{
        console.log(res);
      })
    }
  }

}
