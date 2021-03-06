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
import { AuthGuard } from './auth.guard'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CertificadosComponent } from './certificados/certificados.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DocumentosComponent,
    LoginComponent,
    IncluirClientesComponent,
    IncluirUsuarioComponent,
    CertificadosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule
  ],
  providers: [BD, AuthGuard, appService],
  bootstrap: [AppComponent]
})
export class AppModule { }
