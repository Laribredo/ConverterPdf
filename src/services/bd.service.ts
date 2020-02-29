import * as firebase from 'firebase';
import { Clientes } from "../models/clientes";
import { Usuario } from "../models/usuario";
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

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
            this.router.navigate(['/menu']);   
        }).catch(err =>{
            return false;
        })
    }

    autenticar(email:string, senha:string):Promise<any>{
        return firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(res =>{
            firebase.auth().currentUser.getIdToken().then(res =>{
                this.id_token = res
                localStorage.setItem('idToken', this.id_token)
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
                    
                    _clientes.push(new Clientes(cl.val().nome, cl.val().cnpj, cl.val().endereco, cl.val().complemente, cl.val().cidade,
                                                cl.val().estado,cl.val().cep))
                }) 
            });

            resolve(_clientes.reverse());

        })
    }
}