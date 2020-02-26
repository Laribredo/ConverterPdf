import * as firebase from 'firebase';
import { Clientes } from "../models/clientes";
import { Usuario } from "../models/usuario";

export class BD{

    cadastrarCliente(_cliente: Clientes){
        console.log("cadastro");
        
        firebase.database().ref("clientes").
        push(_cliente)
        .then(res =>{
            console.log(res);            
        })
    }

    cadastrarUsuario(_usuario: Usuario){
        firebase.auth().createUserWithEmailAndPassword(_usuario.email, _usuario.senha)
        .then(res =>{
            return true;          
        }).catch(err =>{
            return false;
        })
    }
}