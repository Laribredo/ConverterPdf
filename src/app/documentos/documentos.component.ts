import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Documentos } from '../../models/documentos'
import * as PDFJS from 'pdfjs-dist/build/pdf';
import html2canvas from 'html2canvas';
import { Lexer } from '@angular/compiler';
import { BD } from '../../services/bd.service'
import { Clientes } from "../../models/clientes";
import { DomSanitizer } from '@angular/platform-browser';
import { Certificado } from "../../models/certificados";
declare const jsPDF: any

PDFJS.GlobalWorkerOptions.workerSrc = './assets/js/pdf.worker.min.js';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  _documento: Documentos;
  _oldPDF: any;
  public _clientes: Array<Clientes>
  _items: any = [];
  htmlTabela: string = "";
  htmlDom: any;
  loading: boolean;
  filtro: any;

  public formulario: FormGroup = new FormGroup({
    'pdf': new FormControl(null, Validators.required),
    'emissao': new FormControl(null, Validators.required),
    'certificado': new FormControl(null),
    'notaFiscal': new FormControl(null, Validators.required),
    'Clientes': new FormControl(null, Validators.required),
    'produto': new FormControl(null),
    'desenho': new FormControl(null),
    'op': new FormControl(null, Validators.required),
    'ordemCompra': new FormControl(null),
    'liga': new FormControl(null),
    'durezaTracao': new FormControl(null),
    'analiseQuimica': new FormControl(null),
    'analiseQuimicaIngles': new FormControl(null),
    'obs': new FormControl(null),
    'obsIngles': new FormControl(null),
    'corrida': new FormControl(null),
    'corridaIngles': new FormControl(null),
    'LiberadoCQ': new FormControl(null, Validators.required),
    'ConferidoCQ': new FormControl(null, Validators.required),
    'filtro': new FormControl(null)
  })

  constructor(
    private _bd: BD,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.preencheCamposForm();
  }


  preencheCamposForm() {
    let data = new Date();
    this.formulario.controls['emissao'].setValue((data.getDate() < 10 ? "0" + (data.getDate()) : data.getDate()) + "/" + ((data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : data.getMonth()) + "/" + data.getFullYear())
    this._bd.getClientes().then(res => {
      this._clientes = res
    });
    this._bd.getNCertificado().then(res => {
      this.formulario.controls['certificado'].setValue(res);
    })
  }

  clearForm() {
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
    this.formulario.controls['obsIngles'].setValue("");
    this.formulario.controls['corrida'].setValue("");
    this.formulario.controls['LiberadoCQ'].setValue("");
    this.formulario.controls['ConferidoCQ'].setValue("");
  }

  async preencheValoresPdf(pdf: any) {
    this.clearForm();
    this.loading = true;
    let possiveisCampos: Array<String> = Array<String>(new String(["LIMITE DE RESISTÊNCIA A TRAÇÃO", "INSPETOR", "ESPESSURA", "LARGURA", "COMPRIMENTO", "CONDUTIVIDADE", "ALONGAMENTO", "DUREZA", "CÓDIGO DO PRODUTO", "T.G.", "LIMITE DE ESCOAMENTO", "TESTE DE DOBRA", "DIÂMETRO",
      "CURVATURA LATERAL", "RESISTIVIDADE ELETRICA", "PESO", "LOTE", "N° DE CORRIDA", "VISUAL", "ORDEM DE COMPRA", "OBSERVAÇÃO"]));

    let possiveisCampos_ingles: Array<string> = ["DRAIN RESISTANCE LIMIT", "INSPECTOR", "THICKNESS", "WIDTH", "LENGTH", "CONDUCTIVITY", "STRETCHING", "TOUGHNESS", "PRODUCT CODE", "T.G.", "FLOW LIMIT", "TEST OF DOUBLE", "DIAMETER",
      "SIDE CURVATURE", "ELECTRIC RESISTANCE", "WEIGHT", "LOT", "RACING NUMBER", "VISUAL", "PURCHASE ORDER", "NOTE"]

    let Campos_ingles: Array<string> = ["LIMITE DE RESISTÊNCIA A TRAÇÃO", "INSPETOR", "ESPESSURA", "LARGURA", "COMPRIMENTO", "CONDUTIVIDADE", "ALONGAMENTO", "DUREZA", "CÓDIGO DO PRODUTO", "T.G.", "LIMITE DE ESCOAMENTO", "TESTE DE DOBRA", "DIÂMETRO",
      "CURVATURA LATERAL", "RESISTIVIDADE ELETRICA", "PESO", "LOTE", "N° DE CORRIDA", "VISUAL", "ORDEM DE COMPRA", "OBSERVAÇÃO"]

    let campos_principais = ["METÁLLICA", "INDUSTRIAL S/A", "C E R T I F I C A D O", "GARANTIA DA QUALIDADE", "QUALIDADE",
      "ASSEGURADA", "EMISSÃO", "DENOMINAÇÃO", "MEDIDAS ENCONTRADAS", "Nº CERTIFICADO:", "CLIENTE", "PRODUTO", "NOTA", "FISCAL", "NOTA FISCAL", "OTA FISCAL", "D E S E N H O", "O.P.", "LIGA", "DUREZA / TRAÇÃO", "LIMITE DE RESISTÊNCIA A TRAÇÃO", "INSPETOR", "ESPESSURA", "LARGURA", "COMPRIMENTO", "CONDUTIVIDADE", "ALONGAMENTO", "DUREZA", "CÓDIGO DO PRODUTO", "T.G.", "LIMITE DE ESCOAMENTO", "TESTE DE DOBRA", "DIÂMETRO",
      "CURVATURA LATERAL", "RESISTIVIDADE ELETRICA", "CONDUTIVIDADE", "PESO", "LOTE", "N° DE CORRIDA", "VISUAL", "ANÁLISE QUÍMICA", "ORDEM DE COMPRA", "OBSERVAÇÃO", "CORRIDA", "CONDUTIVIDAD", "LIBERADO C.Q.", "CONFERIDO C.Q"]

    let promise2 = await this.pdfConverter(pdf);
    this._items = promise2;

    setTimeout(() => {
      document.getElementById("node").innerHTML = "";
      document.getElementById("node_ingles").innerHTML = "";

      this.formulario.controls['produto'].setValue(this._items[0].items[21].str);
      //this.formulario.controls['op'].setValue(this._items[0].items[23].str);
      this.formulario.controls['liga'].setValue(this._items[0].items[24].str);

      if (possiveisCampos[0].indexOf(this._items[0].items[25].str) == -1)
        this.formulario.controls['durezaTracao'].setValue(this._items[0].items[25].str)

      let teste: string

      console.log(this._items[0].items[this._items[0].items.length - 3].str);

      if (this._items.length > 1) {

      } else {
        if (this._items[0].items[this._items[0].items.length - 3].str.search("ESTA EM PLENA CONFORMIDADE") === -1) {
          this.formulario.controls['corrida'].setValue(this._items[0].items[this._items[0].items.length - 3].str)
        }

        //REGRA IMPLANTADA PARA OS PDFS QUE VEM COM ESPAÇAMENTO
        let novo_item = []
        let campo = ""
        this._items[0].items.map((t, i) => {
          if (t.str.trim() != "" && campos_principais.indexOf(t.str.trim()) == -1) {
            campo += t.str;
          }

          if (t.str.trim() != "" && campos_principais.indexOf(t.str.trim()) != -1) {

            if (campo != "")
              novo_item.push(campo);

            novo_item.push(t.str.trim());

            campo = "";
          }
        })
        console.log("novo");
        console.log(novo_item);


        console.log("antigo");
        console.log(this._items[0].items);


        if (this._items[0].items.length > 100) {
          novo_item.map((it, i) => {
            if (it == "PRODUTO") {
              this.formulario.controls['produto'].setValue(novo_item[i + 1]);
            }
            if (it == "LIGA") {
              this.formulario.controls['liga'].setValue(novo_item[i + 1]);
            }
            if (it == "CORRIDA") {
              this.formulario.controls['corrida'].setValue(novo_item[i + 1]);
            }
            if (it == "OBSERVAÇÃO") {
              this.formulario.controls['obs'].setValue(novo_item[i + 1]);
            }
            if(it == "ANÁLISE QUÍMICA")
            {
              this.formulario.controls['analiseQuimica'].setValue(novo_item[i + 1]);
              this.formulario.controls['analiseQuimicaIngles'].setValue(novo_item[i + 1]);
            }
          })
        }

        this.formulario.controls['obsIngles'].setValue('THIS PRODUCT IS IN COMPLIANCE WITH THE ROHS DIRECTIVE 2011/65 / EU');
        this.formulario.controls['corridaIngles'].setValue(this.corridaIngles(this.formulario.value.corrida))

        if (this._items[0].items.length < 100) {
          for (let i = 0; i < this._items[0].items.length; i++) {
            document.hasChildNodes
            //console.log(this._items[0].items[i].str);


            this.htmlDom = document.createElement('tr');
            let td = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');

            let tr_ingles = document.createElement('tr');
            let td_ingles = document.createElement('td');
            let td2_ingles = document.createElement('td');
            let td3_ingles = document.createElement('td');

            if (this._items[0].items[i].str != " "
              && possiveisCampos[0].indexOf(this._items[0].items[i].str) != -1 && i > 13
              && "ORDEM DE COMPRA" != this._items[0].items[i].str
              && this._items[0].items[i].str != "OBSERVAÇÃO") {

              td.colSpan = 3
              td.innerText = this._items[0].items[i].str
              td2.colSpan = 1
              td2.className = "font-weight-bold"
              td.style.padding = "10px";
              td2.innerText = this._items[0].items[i + 1].str
              td3.colSpan = 2
              td3.style.borderRight = " 7px solid black";


              this.htmlDom.append(td);
              this.htmlDom.append(td2);
              //this._items[0].items[i].str);

              td_ingles.colSpan = 3
              td_ingles.innerText = possiveisCampos_ingles[Campos_ingles.indexOf(this._items[0].items[i].str)]
              td2_ingles.colSpan = 1
              td2_ingles.className = "font-weight-bold"
              td_ingles.style.padding = "10px";
              td2_ingles.innerText = this._items[0].items[i + 1].str
              td3_ingles.colSpan = 2
              td3_ingles.style.borderRight = " 7px solid black";

              tr_ingles.append(td_ingles);
              tr_ingles.append(td2_ingles);

              //Verifica se o proximo campo é um dos campos 
              if (this._items[0].items[i + 3] !== undefined) {
                if (possiveisCampos[0].indexOf(this._items[0].items[i + 3].str) == -1 &&
                  this._items[0].items[i + 3].str != "ANÁLISE QUÍMICA") {
                  td3.innerText = "";
                  td3_ingles.innerText = ""
                }
                else
                  if (this._items[0].items[i + 2].str != "ANÁLISE QUÍMICA") {
                    td3.innerText = this._items[0].items[i + 2].str;
                    td3_ingles.innerText = this._items[0].items[i + 2].str;
                  }

              }


              tr_ingles.append(td3_ingles);
              this.htmlDom.append(td3);

              document.querySelector("#node").append(this.htmlDom)
              document.querySelector("#node_ingles").append(tr_ingles);



            }

            

            if (this._items[0].items[i].str == "ANÁLISE QUÍMICA") {
              this.formulario.controls['analiseQuimica'].setValue(this._items[0].items[i + 5].str);
              this.formulario.controls['analiseQuimicaIngles'].setValue(this.analiseQuimicaIngles(this._items[0].items[i + 5].str));
              this.formulario.controls['obs'].setValue(this._items[0].items[i + 6].str);
            }

            if (this._items[0].items[i].str == "OBSERVACAO" && i < (this._items[0].items.length - 10)) {
              this.formulario.controls['analiseQuimica'].setValue(this._items[0].items[i + 5].str);
              this.formulario.controls['analiseQuimicaIngles'].setValue(this.analiseQuimicaIngles(this._items[0].items[i + 5].str));
              this.formulario.controls['obs'].setValue(this._items[0].items[i + 6].str);
            }
          }
        }else{

          let index = novo_item.indexOf("OBSERVAÇÕES");
          let end = novo_item.indexOf("ANÁLISE QUÍMICA");
          for(var h = index+1; h < end; h++ )
          {
            document.hasChildNodes
            //console.log(this._items[0].items[i].str);


            this.htmlDom = document.createElement('tr');
            let td = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');

            let tr_ingles = document.createElement('tr');
            let td_ingles = document.createElement('td');
            let td2_ingles = document.createElement('td');
            let td3_ingles = document.createElement('td');
            
            var t = novo_item[h];
            var rt = novo_item[h+1];
            console.log(t + " " + rt);

            td.colSpan = 3
            td.innerText = novo_item[h];
            td2.colSpan = 1
            td2.className = "font-weight-bold"
            td.style.padding = "10px";
            
            let divi:string = novo_item[h+1];
            let corta:string = "";
            let stringResposta = [];
            if(novo_item[h] == "LIMITE DE RESISTÊNCIA A TRAÇÃO")
            {
               corta = "KSI"
               let resto = divi.split(corta);
               stringResposta = [resto[0]+ " " + corta, resto[1]+ " " + corta]
            }
            if(novo_item[h] == "ESPESSURA" || novo_item[h] == "LARGURA")
            {
              corta = "MM"
              let resto = divi.split(corta);
              stringResposta = [resto[0]+ " " + corta, resto[1]+ " " + corta]
            }
            if(novo_item[h] == "CONDUTIVIDAD" || novo_item[h] == "CONDUTIVIDADE")
            {
              if("CONDUTIVIDAD")
              {
                td.innerText = novo_item[h]+"E";
                novo_item[h+1] =  novo_item[h+1].slice(1)
              }
              corta = "MIN."
              let resto = divi.split(corta);
              stringResposta = [resto[0]+ " " , corta + " " + resto[1]]
            }
          
            if(novo_item[h] == "TESTE DE DOBRA")
            {
              
              stringResposta = ["OK","120º"]
            }

            if(novo_item[h] == "DUREZA")
            {
              corta = "HRF"
              let resto = divi.split(corta);
              stringResposta = [resto[0]+ " " + corta, resto[1]+ " " + corta]
            }
            
            if(novo_item[h] == "RESISTIVIDADE ELETRICA")
            {
              corta = "MIN."
              let resto = divi.split(corta);
              stringResposta = [resto[0]+ " " , corta + " " + resto[1]]
            }
            

            

            td2.innerText = stringResposta[0];
            td3.colSpan = 2 
            td3.innerText = stringResposta[1];
            td3.style.borderRight = " 7px solid black";


            this.htmlDom.append(td);
            this.htmlDom.append(td2);
            this.htmlDom.append(td3)

            td_ingles.colSpan = 3
            td_ingles.innerText = possiveisCampos_ingles[Campos_ingles.indexOf(td.innerText)]
            td2_ingles.colSpan = 1
            td2_ingles.className = "font-weight-bold"
            td_ingles.style.padding = "10px";
            td2_ingles.innerText = stringResposta[0];
            td3_ingles.colSpan = 2;
            td3_ingles.innerText = stringResposta[1];
            td3_ingles.style.borderRight = " 7px solid black";

            tr_ingles.append(td_ingles);
            tr_ingles.append(td2_ingles);
            tr_ingles.append(td3_ingles);

            document.querySelector("#node").append(this.htmlDom)
            document.querySelector("#node_ingles").append(tr_ingles);

            h++
          }
          
        }
      }

      this.loading = false;
    }, 2000);


  }

  corridaIngles(a: string) {
    if (a.indexOf('CONFORME') !== -1) {
      let indice: number = a.indexOf('CONFORME');
      a = a.replace('CONFORME', 'ACCORDING TO')
    }
    return a;
  }

  analiseQuimicaIngles(an: string): string {
    if (an.indexOf("RESTANTE") != -1) {
      an = an.replace('RESTANTE', 'REMAINDER')
    }
    return an;
  }

  gerarCertificado(pdf: any, ingles: boolean) {

    if (this.formulario.status == "VALID") {
      this.criarNovoPdf(ingles)

      let _certificado = new Certificado(this.formulario.value.Clientes[0].nome, this.formulario.value.Clientes[0].cnpj, this.formulario.value.certificado, this.formulario.value.emissao);
      this._bd.gerarCertificado(_certificado)

      this._bd.setNCertificado(this.formulario.value.certificado + 1).then(res => {
        console.log(res);
        this.formulario.controls['certificado'].setValue(this.formulario.value.certificado + 1);
      });

    } else
      alert("Preencha os campos necessários")
    this.pdfConverter(pdf).then(res => {
      console.log(res);
    })
  }

  criarNovoPdf(ingles: boolean) {

    let myWindow;
    myWindow = window.open('', '', 'width=1000,height=900');
    myWindow.document.write('<html><head><style>tr td { border: 1px solid black; color: black;}</style><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">  </style></head><body>')
    if (!ingles) {
      myWindow.document.write(document.querySelector("#tabela").innerHTML);
    } else {
      myWindow.document.write(document.querySelector("#tabela_ingles").innerHTML);
    }

    myWindow.document.write("</body></html>")


    myWindow.document.close(); //missing code

    setTimeout(() => {
      myWindow.print()
    }, 2000);

  }

  pdfConverter(pdfA: any): Promise<any> {
    var file = pdfA.files[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader();
    var typedarray: any;

    return new Promise(resolve => {

      let items: Array<any> = []

      fileReader.onload = function () {
        //Step 4:turn array buffer into typed array
        typedarray = new Uint8Array(this.result as ArrayBuffer);

        var pdfA = PDFJS.getDocument(typedarray).promise
        return pdfA.then(function (pdf) { // get all pages text
          var texts;
          var maxPages = pdf.numPages;
          var countPromises = []; // collecting all page promises
          for (var j = 1; j <= maxPages; j++) {
            var page = pdf.getPage(j);

            var txt = "";
            countPromises.push(page.then(function (page) { // add page promise
              var textContent = page.getTextContent();
              return textContent.then(function (text) {
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
