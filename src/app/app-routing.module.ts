import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DocumentosComponent} from './documentos/documentos.component';
import {MenuComponent} from './menu/menu.component'
import {IncluirClientesComponent} from  './incluir-clientes/incluir-clientes.component'
import {IncluirUsuarioComponent} from './incluir-usuario/incluir-usuario.component'
import {LoginComponent} from './login/login.component'
import {AuthGuard} from './auth.guard'

const routes: Routes = [
  {path:'documentos', component:DocumentosComponent,canActivate:[AuthGuard]},
  {path:'menu', component:MenuComponent,canActivate:[AuthGuard]},
  {path:'', component: LoginComponent},
  {path:'incluir-clientes', component:IncluirClientesComponent},
  {path:'incluir-usuario', component:IncluirUsuarioComponent,canActivate:[AuthGuard] },
  {path:'login', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
