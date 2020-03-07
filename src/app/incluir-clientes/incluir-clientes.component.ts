import { Component, OnInit,Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { appService } from './../../services/app.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Clientes } from '../../models/clientes';
import {BD} from '../../services/bd.service'
import * as firebase from 'firebase'
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-incluir-clientes',
  templateUrl: './incluir-clientes.component.html',
  styleUrls: ['./incluir-clientes.component.css'],
  providers: [appService,BD]
})
export class IncluirClientesComponent implements OnInit {

  _clientes:Clientes;
  filtro: any;
  editando:boolean = false;
  editClient:Clientes;

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
    this._bd.getClientes().then(res =>{
      this._clientes = res       
    });
  }

  cadastrarCliente(){
    
    console.log("cadastrarCliente");
    if( this.formulario.status == "VALID" )
    {
      if(!this.editando)
      {
        let _cliente = new Clientes(
          null,
          this.formulario.value.nome,
          this.formulario.value.cnpj,
          this.formulario.value.endereco,
          this.formulario.value.complemento,
          this.formulario.value.cidade,
          this.formulario.value.estado,
          this.formulario.value.cep
        )
  
        this._bd.cadastrarCliente(_cliente);
      }else
      {
        this.editClient.nome = this.formulario.value.nome
        this.editClient.cnpj = this.formulario.value.cnpj
        this.editClient.endereco = this.formulario.value.endereco
        this.editClient.complemente = this.formulario.value.complemento
        this.editClient.cidade = this.formulario.value.cidade
        this.editClient.estado = this.formulario.value.estado
        this.editClient.cep = this.formulario.value.cep
        this.editando = false;
        this._bd.updateClientes(this.editClient);
      }
    }else{
      alert("Preencha os Campos Necessários")
    }
    
  }


  editarClientes(_cliente:Clientes)
  {
    this.formulario.controls["nome"].setValue(_cliente.nome);
    this.formulario.controls["cnpj"].setValue(_cliente.cnpj);
    this.formulario.controls["cep"].setValue(_cliente.cep);
    this.formulario.controls["endereco"].setValue(_cliente.endereco);
    this.formulario.controls["complemento"].setValue(_cliente.complemente);
    this.formulario.controls["cidade"].setValue(_cliente.cidade);
    this.formulario.controls["estado"].setValue(_cliente.estado);

    console.log(_cliente.key);
    this.editando = true;
    this.editClient = _cliente;
    
  }

  excluirClientes(_cliente:Clientes)
  {
    let c =  confirm("Você tem certeza que deseja exluir esse cliente?");

    if(c)
      this._bd.deleteClientes(_cliente)

    this._bd.getClientes().then(res =>{
      this._clientes = res       
    }); 
    
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
