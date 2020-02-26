import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DocumentosComponent} from './documentos/documentos.component';
import {MenuComponent} from './menu/menu.component'
import {IncluirClientesComponent} from  './incluir-clientes/incluir-clientes.component'


const routes: Routes = [
  {path:'documentos', component:DocumentosComponent},
  {path:'menu', component:MenuComponent},
  {path:'', component: MenuComponent},
  {path:'incluir-clientes', component:IncluirClientesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
