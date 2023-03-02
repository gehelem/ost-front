import { Component, OnInit,Input,Inject,ViewChild } from '@angular/core';
import { KeyValue } from '@angular/common';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { WebsocketService } from '../websocket.service';

import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { EditComponent} from './edit/edit.component'

@Component({
  selector: 'app-prop',
  templateUrl: './prop.component.html',
  styleUrls: ['./prop.component.css']
})
export class PropComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  subsPush: any;
  @ViewChild(BaseChartDirective) public chart?: BaseChartDirective;
  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red

  constructor(public ws:WebsocketService,public imagedialog: MatDialog,public editdrop:MatDialog ) { }

  ngOnInit(): void {
    this.subsPush = this.ws.datastore.mods[this.mod].prps[this.prop].getSubsPush()
    .subscribe( msg => this.OnPushVal(msg));    

    
  }
  OnPushVal(msg: any) {
    //console.log("OnPushVal = ",this.mod,'/',this.prop,':',msg);
    this.chart?.update();
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
  openEditProp(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('editprop:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.editdrop.open(EditComponent,{data:{mod:this.mod,propname:this.prop,prop:myprop,focus:focus,line:gridline,gridaction:gridaction}});
  }
  lineDel(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('lineDel:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.ws.lineDelete(this.mod,this.prop,gridline);
  }
  lineUp(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('lineUp:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.ws.lineUp(this.mod,this.prop,gridline);
  }
  lineDown(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('lineDown:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.ws.lineDown(this.mod,this.prop,gridline);
  }

}
@Component({
  selector: 'showimage',
  templateUrl: 'showimage.html',
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {url: string}) {}
}

