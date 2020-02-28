import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import {Documentos} from '../../models/documentos'
import * as PDFJS from 'pdfjs-dist/build/pdf';
import html2canvas from 'html2canvas'; 
import { Lexer } from '@angular/compiler';
import {BD} from '../../services/bd.service'
import { Clientes } from "../../models/clientes";
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

  public formulario:FormGroup = new FormGroup({
    'pdf': new FormControl(null),
    'emissao': new FormControl(null),
    'Clientes': new FormControl(null),
    'notaFiscal': new FormControl(null),
    'op': new FormControl(null),
    'LiberadoCQ': new FormControl(null),
    'ConferidoCQ': new FormControl(null)
  })

  constructor(
   private _bd : BD
  ) { }

  ngOnInit(): void {
    this.preencheCamposForm();    
  }


  preencheCamposForm(){
    let data = new Date();
    this.formulario.controls['emissao'].setValue(data.getDate() + "/" +( (data.getMonth()+1) < 10 ? "0" + (data.getMonth()+1) : data.getMonth() ) + "/" + data.getFullYear())
    this._bd.getClientes().then(res =>{
      this._clientes = res    
    });
  }

  teste(pdf:any)
  {

    this.criarNovoPdf();
    console.log(this.formulario.value.Clientes);

    this.pdfConverter(pdf).then(res =>{
      console.log(res);      
    })
  }

  criarNovoPdf(){

    let myWindow;
    myWindow=window.open('','','width=1280,height=720');
    myWindow.document.write('<html><head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">  </style></head><body>')
    myWindow.document.write(document.querySelector("#tabela").innerHTML);
    myWindow.document.write("</body></html>")


    myWindow.document.close(); //missing code


    // myWindow.focus();
    // myWindow.print(); 

      //document.body.appendChild(canvas)
  };

    // var doc = new jsPDF('portrait', 'pt', 'a4'),
    // data = new Date();
    // var margins = {
    //   top: 40,
    //   bottom: 60,
    //   left: 40,
    //   width: 1000
    // };

    // var codigoHTML = document.querySelector("#tabela");

    // doc.fromHTML(codigoHTML,
    //   margins.left, // x coord
    //   margins.top, { pagesplit: true },
    //   function(dispose){
    //     doc.save("Relatorio - "+data.getDate()+"/"+data.getMonth()+"/"+data.getFullYear()+".pdf");
    //   });
        // }
  

   pdfConverter(pdfA:any): Promise<any>{
    var file = pdfA.files[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader(); 
    var typedarray : any; 

    return new Promise((resolve,reject) =>{

      let items: Array<any> = []

      fileReader.onload = function() {
        //Step 4:turn array buffer into typed array
        typedarray = new Uint8Array(this.result as ArrayBuffer);
        
          var pdfA = PDFJS.getDocument(typedarray)
          return pdfA.then(function(pdf) { // get all pages text
            var texts;
            var maxPages = 1;
            var countPromises = []; // collecting all page promises
            for (var j = 1; j <= maxPages; j++) {
              var page = pdf.getPage(j);
    
              var txt = "";
              countPromises.push(page.then(function(page) { // add page promise
                var textContent = page.getTextContent();
                return textContent.then(function(text){
                  items.push(text);
                  /*if(text.items.length < 100)
                    return text;
                  else  
                    return text.items.map(function (s) { return s.str; }).join(''); // value page text */
                });
              }));
            }
          });
        }

        // function getValuesOldPdf(pdf : any){
        //   var oldPdf = pdf;

        //   let produto = "";
        //   let desenho = "";
        //   let liga = "";
        //   let durezaTracao = "";
        //   let analiseQuimicaCu = "";
        //   let analiseQuimicaFe = "";
        //   let analiseQuimicaZN = "";
        //   let observacao = "";
        //   let corrida = "";
        //   let espessuraMedidas = "";
        //   let espessuraOBS = "";
        //   let larguraMedidas = "";
        //   let larguraObs = "";
        //   let durezaMedidas = "";
        //   let durezaOBS = "";
        //   let testeDeObraMedidas = "";
        //   let testeDeDobraOBS = "";
        //   let PesoMedidas = "";
        //   let PesoOBS = "";


        //   if(oldPdf[0].length > 100)
        //   {
        //     oldPdf = oldPdf[0];
        //      produto = oldPdf.slice(oldPdf.search("PRODUTO")+7,oldPdf.search("NOTA FISCAL"));
        //      desenho = oldPdf.slice(oldPdf.search("D E S E N H O")+13,oldPdf.search("O.P"));
        //      liga = oldPdf.slice(oldPdf.search("LIGA")+4,oldPdf.search("DUREZA"));
        //      durezaTracao = oldPdf.slice(oldPdf.search("DUREZA / TRAÇÃO")+15,oldPdf.search("DENOMINAÇÃO "));
        //      analiseQuimicaCu = oldPdf.slice(oldPdf.search("ANÁLISE QUÍMICA CU=")+19,oldPdf.search("FE"));
        //      analiseQuimicaFe = oldPdf.slice(oldPdf.search("FE=")+3,oldPdf.search("ZN"));
        //      analiseQuimicaZN = oldPdf.slice(oldPdf.search("ZN=")+3,oldPdf.search("OBSERVAÇÃO"));
        //      observacao = oldPdf.slice(oldPdf.search("OBSERVAÇÃO")+10,oldPdf.search("CORRIDA"));
        //      corrida = oldPdf.slice(oldPdf.search("CORRIDA")+7,oldPdf.search("LIBERADO C.Q"));
        //      espessuraMedidas = oldPdf.slice(oldPdf.search("ESPESSURA")+9,oldPdf.indexOf("MM", oldPdf.search("ESPESSURA"))) + " MM ";          
        //      espessuraOBS = oldPdf.slice(oldPdf.indexOf("MM", oldPdf.search("ESPESSURA"))+2,oldPdf.search("LARGURA"));
        //      larguraMedidas = oldPdf.slice(oldPdf.search("LARGURA")+7,oldPdf.indexOf("MM", oldPdf.search("LARGURA"))) + " MM ";
        //      larguraObs = oldPdf.slice(oldPdf.indexOf("MM", oldPdf.search("LARGURA"))+2,oldPdf.indexOf("DUREZA", oldPdf.indexOf("LARGURA")));
        //      durezaMedidas = oldPdf.slice(oldPdf.indexOf("DUREZA", oldPdf.search("LARGURA"))+6,oldPdf.indexOf("HRB", oldPdf.indexOf("LARGURA"))) + " HRB ";
        //      durezaOBS = oldPdf.slice(oldPdf.indexOf("HRB", oldPdf.search("LARGURA"))+3, oldPdf.indexOf("TESTE DE DOBRA"));
        //      testeDeObraMedidas = oldPdf.slice(oldPdf.search("TESTE DE DOBRA")+15, oldPdf.indexOf(" ", oldPdf.search("TESTE DE DOBRA")+15 ));
        //      testeDeDobraOBS = oldPdf.slice(oldPdf.indexOf(" ", oldPdf.search("TESTE DE DOBRA")+15 ), oldPdf.search("PESO"));
        //      PesoMedidas = oldPdf.slice(oldPdf.indexOf("PESO")+4, oldPdf.search("KG")) + " KG";
        //      PesoOBS = oldPdf.slice(oldPdf.indexOf("KG")+2, oldPdf.search("ORDEM DE COMPRA")); 
        //   }else{

        //     console.log(oldPdf[0]);
        //      produto = oldPdf[0].items[21].str;
        //      liga = oldPdf[0].items[24].str;

        //     if(oldPdf[0].items[25].str.search("HRB") != -1 )
        //      durezaTracao = oldPdf[0].items[25].str;

        //      espessuraMedidas = oldPdf[0].items[27].str;
        //      espessuraOBS = "";

        //     if(oldPdf[0].items[28].str != "LARGURA")
        //        espessuraOBS = oldPdf[0].items[28];

        //      larguraMedidas = oldPdf[0].items[29].str;    
        //      larguraObs = ""

        //     if(oldPdf[0].items[30].str != "DUREZA")
        //       larguraObs = oldPdf[0].items[30].str;
              
        //      durezaMedidas = oldPdf[0].items[31].str 
        //      durezaOBS = "" 
            
        //     if(oldPdf[0].items[32].str != "TESTE DE DOBRA")
        //       durezaOBS = oldPdf[0].items[32].str;

        //      testeDeObraMedidas = oldPdf[0].items[33].str;
        //      testeDeDobraOBS = ""

        //     if(oldPdf[0].items[34].str != "PESO")
        //     testeDeDobraOBS = oldPdf[0].items[34].str;

        //      PesoMedidas = oldPdf[0].items[35].str
        //      PesoOBS = ""

        //     if(oldPdf[0].items[36].str != "ORDEM DE COMPRA")
        //       PesoOBS = oldPdf[0].items[36].str;            

        //      analiseQuimicaCu =  oldPdf[0].items[43].str 
        //      observacao = oldPdf[0].items[44].str 

        //     if(!isNaN(oldPdf[0].items[45].str))
        //     {
        //       corrida = oldPdf[0].items[45].str;
        //     }
        
             
        //   }

          
        //   var documento = new Documentos("Cyprium","000000000");

        //   let data1 = new Date();

        //   document.querySelector("#emissao").innerHTML =  data1.getDate() + "/" +( (data1.getMonth()+1) < 10 ? "0" + (data1.getMonth()+1) : data1.getMonth() ) + "/" + data1.getFullYear();
        //   document.querySelector("#produto").innerHTML = produto
        //   document.querySelector("#desenho").innerHTML = desenho
        //   document.querySelector("#liga").innerHTML = liga
        //   document.querySelector("#durezaTracao").innerHTML = durezaTracao
        //   document.querySelector("#espessuraMedidas").innerHTML = espessuraMedidas
        //   document.querySelector("#espessuraObs").innerHTML = espessuraOBS;
        //   document.querySelector("#larguraMedidas").innerHTML = larguraMedidas;
        //   document.querySelector("#larguraObs").innerHTML = larguraObs;
        //   document.querySelector("#durezaMedidas").innerHTML = durezaMedidas;
        //   document.querySelector("#durezaObs").innerHTML = durezaOBS;
        //   document.querySelector("#testeDeDobraMedidas").innerHTML = testeDeObraMedidas;
        //   document.querySelector("#testeDeDobraObs").innerHTML = testeDeDobraOBS;
        //   document.querySelector("#pesoMedidas").innerHTML = PesoMedidas;
        //   document.querySelector("#pesoObs").innerHTML = PesoOBS;
        //   document.querySelector("#corrida").innerHTML = corrida;
        //   document.querySelector("#analiseQuimica").innerHTML = analiseQuimicaCu + " " + analiseQuimicaFe + " " + analiseQuimicaZN
        //   document.querySelector("#observacao").innerHTML = observacao;




        //   var doc = new jsPDF('portrait', 'pt', 'a4'),
        //   data = new Date();
        //   var margins = {
        //     top: 40,
        //     bottom: 60,
        //     left: 40,
        //     width: 1000
        //   };

        //   var codigoHTML = document.querySelector("#tabela");

        //   doc.fromHTML(codigoHTML,
        //     margins.left, // x coord
        //     margins.top, { pagesplit: true },
        //     function(dispose){
        //     //doc.save("Relatorio - "+data.getDate()+"/"+data.getMonth()+"/"+data.getFullYear()+".pdf");
        //     });
        // }

        // requestPDFJS(typedarray).then((tx) => {
        //     getValuesOldPdf(tx);
        // }); 
    

      resolve(items);

      fileReader.readAsArrayBuffer(file);
    })
  };
}
