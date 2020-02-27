
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { appService } from "./../services/app.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private route: Router,
        private _service : appService
        ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {        
        console.log(this._service.autenticado());        
       return this._service.autenticado();
    }
}