import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class appService{
    
    constructor(
        private http : HttpClient,
        private router:Router
    ){

    }

    consultarCep(cep: string) : Promise<any>{
        var url = "https://viacep.com.br/ws/"+cep+"/json/"
        console.log("consulta cep");
        
        return this.http.get<any>(url).toPromise().then((res:Response) =>{
            console.log(res);  
            return res
        })
    }

    public autenticado():boolean{       
        let isAuth:boolean = localStorage.getItem('idToken') == null || localStorage.getItem('idToken') === undefined ? false : true    

        if(!isAuth)
            this.router.navigate(['/login'])

        return  isAuth
    }
}