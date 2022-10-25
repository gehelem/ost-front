import { Component, OnInit,Input,Inject } from '@angular/core';
import { KeyValue } from '@angular/common';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { WebsocketService } from '../websocket.service';

import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';


@Component({
  selector: 'app-prop',
  templateUrl: './prop.component.html',
  styleUrls: ['./prop.component.css']
})
export class PropComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  
  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red

  constructor(public ws:WebsocketService,public imagedialog: MatDialog,public editdrop:MatDialog ) { }

  ngOnInit(): void {
  }
  originalOrderMod = (a: KeyValue<string,Mod>, b: KeyValue<string,Mod>): number => {
    return 0;
  }
  originalOrderPrp = (a: KeyValue<string,Prp>, b: KeyValue<string,Prp>): number => {
    return 0;
  }
  originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return 0;
  }
  originalOrderString = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    return 0;

  }  
  isNumber(val: any): boolean { return typeof val === 'number'; }
  isBoolean(val: any): boolean { return typeof val === 'boolean'; }
  isString(val: any): boolean { return typeof val === 'string'; }
  
  openDialog(myurl:string) {
    this.imagedialog.open(DialogContentExampleDialog,{data:{url:myurl}});
  }
  openEditProp(myprop: Prp) {
    this.ws.datastore.tempProp = new Prp();
    this.ws.datastore.tempProp = myprop;
    console.log(myprop);
    this.editdrop.open(EditPropertyDialog);
  }

}
@Component({
  selector: 'showimage',
  templateUrl: 'showimage.html',
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {url: string}) {}
}

@Component({
  selector: 'editproperty',
  templateUrl: 'editproperty.html',
})
export class EditPropertyDialog{
  constructor(public ws:WebsocketService) {
  }

  originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return 0;
  }
  isNumber(val: any): boolean { return typeof val === 'number'; }
  isBoolean(val: any): boolean { return typeof val === 'boolean'; }
  isString(val: any): boolean { return typeof val === 'string'; }  

}
