import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {Documentos} from '../../models/documentos'
import * as PDFJS from 'pdfjs-dist/build/pdf';
import html2canvas from 'html2canvas'; 
import { Lexer } from '@angular/compiler';
import {BD} from '../../services/bd.service'
import { Clientes } from "../../models/clientes";
import { DomSanitizer } from '@angular/platform-browser';
import {Certificado} from "../../models/certificados";
declare const jsPDF:any

PDFJS.GlobalWorkerOptions.workerSrc = './assets/js/pdf.worker.min.js';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  _documento : Documentos;
  _oldPDF : any;
  public _clientes: Array<Clientes>
  _items: any = [];
  htmlTabela:string = "";
  htmlDom:any;
  loading:boolean;
  filtro:any;

  public formulario:FormGroup = new FormGroup({
    'pdf': new FormControl(null,Validators.required),    
    'emissao': new FormControl(null,Validators.required),
    'certificado': new FormControl(null),
    'notaFiscal': new FormControl(null,Validators.required),
    'Clientes': new FormControl(null,Validators.required),
    'produto': new FormControl(null),
    'desenho': new FormControl(null),
    'op': new FormControl(null,Validators.required),
    'ordemCompra': new FormControl(null),
    'liga': new FormControl(null),
    'durezaTracao': new FormControl(null),
    'analiseQuimica': new FormControl(null),
    'obs': new FormControl(null),
    'corrida': new FormControl(null),
    'LiberadoCQ': new FormControl(null,Validators.required),
    'ConferidoCQ': new FormControl(null,Validators.required),
    'filtro': new FormControl(null)
  })

  constructor(
   private _bd : BD,
   private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.preencheCamposForm();    
  }


  preencheCamposForm(){
    let data = new Date();
    this.formulario.controls['emissao'].setValue((data.getDate() < 10 ? "0" + (data.getDate()+1) : data.getDate()) + "/" +( (data.getMonth()+1) < 10 ? "0" + (data.getMonth()+1) : data.getMonth() ) + "/" + data.getFullYear())
     this._bd.getClientes().then(res =>{
      this._clientes = res       
    });
    this._bd.getNCertificado().then(res =>{
      this.formulario.controls['certificado'].setValue(res);      
    })
  }

  clearForm(){
    this.formulario.controls['corrida'].setValue("");
    this.formulario.controls['notaFiscal'].setValue("");
    this.formulario.controls['produto'].setValue("");
    this.formulario.controls['desenho'].setValue("");
    this.formulario.controls['op'].setValue("");
    this.formulario.controls['ordemCompra'].setValue("");
    this.formulario.controls['liga'].setValue("");
    this.formulario.controls['durezaTracao'].setValue("");
    this.formulario.controls['analiseQuimica'].setValue("");
    this.formulario.controls['obs'].setValue("");
    this.formulario.controls['corrida'].setValue("");
    this.formulario.controls['LiberadoCQ'].setValue("");
    this.formulario.controls['ConferidoCQ'].setValue("");
  }


  async preencheValoresPdf(pdf:any)
  {
    this.clearForm();
    this.loading = true;
    let possiveisCampos:Array<String> = Array<String>(new String(["LIMITE DE RESISTÊNCIA A TRAÇÃO","INSPETOR","ESPESSURA","LARGURA","COMPRIMENTO","CONDUTIVIDADE","ALONGAMENTO","DUREZA","CÓDIGO DO PRODUTO","T.G.","LIMITE DE ESCOAMENTO","TESTE DE DOBRA","DIÂMETRO",
                           "CURVATURA LATERAL","RESISTIVIDADE ELETRICA","PESO","LOTE","N° DE CORRIDA","VISUAL","ORDEM DE COMPRA","OBSERVAÇÃO"]));
                           

    let promise2 = await this.pdfConverter(pdf);
    this._items = promise2;

    setTimeout(() => {
      document.getElementById("testeaa").innerHTML = "";

      this.formulario.controls['produto'].setValue(this._items[0].items[21].str);
      //this.formulario.controls['op'].setValue(this._items[0].items[23].str);
      this.formulario.controls['liga'].setValue(this._items[0].items[24].str);

      if(possiveisCampos[0].indexOf(this._items[0].items[25].str) == -1)
        this.formulario.controls['durezaTracao'].setValue(this._items[0].items[25].str)

      let teste:string 
      
      console.log(this._items[0].items[this._items[0].items.length-3].str);
      
      if(this._items.length > 1)
      {

      }else
      {
        if(this._items[0].items[this._items[0].items.length-3].str.search("ESTA EM PLENA CONFORMIDADE") === -1)
        {
          this.formulario.controls['corrida'].setValue(this._items[0].items[this._items[0].items.length-3].str)
        }


        console.log(this._items);
          
        for(let i = 0; i < this._items[0].items.length; i++)
        {
          document.hasChildNodes
          //console.log(this._items[0].items[i].str);


            this.htmlDom  = document.createElement('tr');
            let td = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');

            if(possiveisCampos[0].indexOf(this._items[0].items[i].str) != -1 && i > 13 && "ORDEM DE COMPRA" != this._items[0].items[i].str ){
              td.colSpan = 3
              td.innerText = this._items[0].items[i].str
              td2.colSpan = 1 
              td2.className = "font-weight-bold"
              td.style.padding = "10px";
              td2.innerText = this._items[0].items[i+1].str
              td3.colSpan = 2
              td3.style.borderRight = " 7px solid black";

              //Verifica se o proximo campo é um dos campos 
              if(possiveisCampos[0].indexOf(this._items[0].items[i+3].str) == -1)            
                td3.innerText = "";  
              else
                td3.innerText = this._items[0].items[i+2].str;;

              this.htmlDom.append(td);
              this.htmlDom.append(td2);
              this.htmlDom.append(td3);

              document.querySelector("#testeaa").append(this.htmlDom)
            }

          if( this._items[0].items[i].str =="ANÁLISE QUÍMICA" ){
            this.formulario.controls['analiseQuimica'].setValue(this._items[0].items[i+5].str);
            this.formulario.controls['obs'].setValue(this._items[0].items[i+6].str);
          }

          if( this._items[0].items[i].str =="OBSERVACAO" && i < (this._items[0].items.length - 10)  ){
            this.formulario.controls['analiseQuimica'].setValue(this._items[0].items[i+5].str);
            this.formulario.controls['obs'].setValue(this._items[0].items[i+6].str);
          }
        }

    }
      console.log(this.htmlDom)
  
      this.loading = false;
    }, 2000);


  }

  teste(pdf:any)
  {

    if( this.formulario.status == "VALID")
    {
      this.criarNovoPdf();
      console.log(this.formulario.value.Clientes[0]);

      let _certificado = new Certificado(this.formulario.value.Clientes[0].nome,this.formulario.value.Clientes[0].cnpj,this.formulario.value.certificado,this.formulario.value.emissao);
      this._bd.gerarCertificado(_certificado)

      this._bd.setNCertificado(this.formulario.value.certificado+1).then(res =>{
        console.log(res); 
        this.formulario.controls['certificado'].setValue(this.formulario.value.certificado+1);     
      });

    }else
      alert("Preencha os campos necessários")
    // this.pdfConverter(pdf).then(res =>{
    //   console.log(res);      
    // })
  }

  criarNovoPdf(){

    let myWindow;
    myWindow=window.open('','','width=1000,height=900');
    myWindow.document.write('<html><head><style>tr td { border: 1px solid black; color: black;}</style><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">  </style></head><body>')
    myWindow.document.write(document.querySelector("#tabela").innerHTML);
    myWindow.document.write("</body></html>")


    myWindow.document.close(); //missing code

    setTimeout(() => {
      myWindow.print()
    }, 2000);
  
  }
  
   pdfConverter(pdfA:any): Promise<any>{
    var file = pdfA.files[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader(); 
    var typedarray : any; 

    return new Promise(resolve =>{

      let items: Array<any> = []

      fileReader.onload = function() {
        //Step 4:turn array buffer into typed array
        typedarray = new Uint8Array(this.result as ArrayBuffer);
        
          var pdfA = PDFJS.getDocument(typedarray).promise
          return pdfA.then(function(pdf) { // get all pages text
            var texts;
            var maxPages = pdf.numPages;
            var countPromises = []; // collecting all page promises
            for (var j = 1; j <= maxPages; j++) {
              var page = pdf.getPage(j);
    
              var txt = "";
              countPromises.push(page.then(function(page) { // add page promise
                var textContent = page.getTextContent();
                return textContent.then(function(text){
                  items.push(text);
                });
              }));
            }
          });
        }

      resolve(items);

      fileReader.readAsArrayBuffer(file);
    })
  };
}
