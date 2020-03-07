import { Component, OnInit } from '@angular/core';
import {BD} from '../../services/bd.service'
import { Certificado } from 'src/models/certificados';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css']
})
export class CertificadosComponent implements OnInit {

  filtro
  _certificados:Certificado;

  constructor(
    private _bd : BD
  ) { }

  ngOnInit(): void {
    this._bd.getCertificados().then( (res:Certificado) =>{
      this._certificados = res;
    });
  }

}
