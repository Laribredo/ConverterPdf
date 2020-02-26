import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class appService{
    
    constructor(
        private http : HttpClient
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
}