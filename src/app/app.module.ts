import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BD} from './../services/bd.service'
import { appService } from './../services/app.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { LoginComponent } from './login/login.component';
import { IncluirClientesComponent } from './incluir-clientes/incluir-clientes.component';
import { IncluirUsuarioComponent } from './incluir-usuario/incluir-usuario.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DocumentosComponent,
    LoginComponent,
    IncluirClientesComponent,
    IncluirUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [BD],
  bootstrap: [AppComponent]
})
export class AppModule { }
