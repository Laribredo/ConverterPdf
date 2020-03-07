import * as firebase from 'firebase';
import { Clientes } from "../models/clientes";
import { Certificado } from "../models/certificados";
import { Usuario } from "../models/usuario";
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';

@Injectable()
export class BD{

    constructor(
        private router:Router
    ){
    }

    public id_token:string = null

    cadastrarCliente(_cliente: Clientes){
        console.log("cadastro");
        
        firebase.database().ref("clientes").
        push(_cliente)
        .then(res =>{
            alert("Usuário Cadastrado");    
            this.router.navigate(['/menu']);          
        })
    }

    getNCertificado(): Promise<any>{
        console.log("aqui")
        let _certificado: number;
        return firebase.database().ref("certificado")
            .once('value')
            .then(res =>{
                return res.val();
            });        
    }

    setNCertificado(new1:number):Promise<any>{
        return firebase.database()
        .ref()
        .update({"certificado": new1})
        .then(res =>{
            console.log(res);            
        })
    }

    cadastrarUsuario(_usuario: Usuario) : Promise<any>{
        return firebase.auth().createUserWithEmailAndPassword(_usuario.email, _usuario.senha)
        .then(res =>{
            alert("Usuário Cadastrado");      
        }).catch(err =>{
            alert("Ocorreu um erro ao cadastrar o empregado")
        })
    }

    alterarSenha(senhaAntiga:any,senha:any): Promise<any>{

        return firebase.auth().signInWithEmailAndPassword(localStorage.getItem('email'),senhaAntiga)
        .then(res =>{
            firebase.auth().currentUser.updatePassword(senha).then(res =>{
                alert("Troca de Senha Efetuada");
                this.router.navigate(['/menu']);
            })         
        }).catch((error) =>{
            console.log(error);
            alert("A Senha Antiga não é semalhante a atual")
        })
    }

    
    autenticar(email:string, senha:string):Promise<any>{
        return firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(res =>{
            firebase.auth().currentUser.getIdToken().then(res =>{
                this.id_token = res
                localStorage.setItem('idToken', this.id_token)
                localStorage.setItem('email',email);
                this.router.navigate(['/menu'])
            })         
        })
    }

    getClientes(): Promise<any>{
        return new Promise((resolve,reject) =>{
            let _clientes: Array<Clientes> = []

            firebase.database().ref("clientes")
            .orderByKey()
            .once('value')
            .then(res =>{
                res.forEach(cl =>{
                    
                    _clientes.push(new Clientes(cl.key,cl.val().nome, cl.val().cnpj, cl.val().endereco, cl.val().complemente, cl.val().cidade,
                                                cl.val().estado,cl.val().cep))
                }) 
            });

            resolve(_clientes.reverse());

        })
    }

    updateClientes(_cliente: Clientes): Promise<any>{
        return new Promise((resolve) =>{
            firebase.database().ref("clientes/"+ _cliente.key)
            .update(_cliente)
            .then(res => {
                alert("Cliente Editado com Sucesso.")              
            }).catch(() =>{
                alert("Ocorreu um Erro ao Editar o Cliente.")
            })
        })
    }

    deleteClientes(_cliente): Promise<any>{
        return new Promise((resolve)=>{
           let cli =  firebase.database().ref("clientes/"+ _cliente.key);
           cli.remove().then(()=>{
               alert("Cliente Removido com sucesso")
           })
            
        })
    }

    gerarCertificado(_certificado: Certificado){
        firebase.database().ref("certificadosGerados").
        push(_certificado)
        .then(()=>{
            console.log("certificado criado;");
            
        })
    }

    getCertificados(){
        return new Promise((resolve,reject) =>{
            let _certificado: Array<Certificado> = []

            firebase.database().ref("certificadosGerados")
            .orderByKey()
            .once('value')
            .then(res =>{
                res.forEach(cl =>{
                    _certificado.push(new Certificado(cl.val().nomeCliente,cl.val().cnpj,cl.val().numeroCertificado,cl.val().dataEmissao))
                }) 
            });

            resolve(_certificado.reverse());

        })
    }

}