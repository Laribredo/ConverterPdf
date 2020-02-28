import { Component, OnInit } from '@angular/core';
import  {appService} from '../../services/app.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private _app : appService
  ) { }

  ngOnInit(): void {}

  logout():void{
    this._app.sair();
  }



}
