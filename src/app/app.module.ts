import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BD} from './../services/bd.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { LoginComponent } from './login/login.component';
import { IncluirClientesComponent } from './incluir-clientes/incluir-clientes.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DocumentosComponent,
    LoginComponent,
    IncluirClientesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BD],
  bootstrap: [AppComponent]
})
export class AppModule { }
