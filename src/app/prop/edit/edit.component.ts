import { Component, OnInit,Input,Inject, Directive, ElementRef, HostListener, AfterViewInit,}  from '@angular/core';
import { KeyValue } from '@angular/common';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { WebsocketService } from '../../websocket.service';
import {} from '@angular/material/dialog';


import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public focusedElement:string='';
  tempselts: {[key: string]: any} ={};

  constructor(@Inject(MAT_DIALOG_DATA) public data: {mod:string,propname:string,prop: Prp,focus: string,line:number,gridaction:string},public dialogRef: MatDialogRef<EditComponent>, public ws:WebsocketService) {
  }
  ngOnInit(): void {
    this.tempselts={};
    console.log('edit gridaction=',this.data.gridaction);
    if (this.data.gridaction=='editprop') {
      Object.entries(this.data.prop.elts).forEach(([key, value], index) => {
        //console.log('init elt',key,value);
        this.tempselts[key]=value.value;
        });
    }
    if (this.data.gridaction=='editline') {
      console.log('editline init=',this.data.prop.grid2[this.data.line]);
      Object.entries(this.data.prop.grid2[this.data.line]).forEach(([key, value], index) => {
        this.tempselts[key]=value;
      });
    }
      //console.log('init result = ',this.tempselts);

  }

  public originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return 0;
  }
  isNumber(val: any): boolean { return typeof val === 'number'; }
  isBoolean(val: any): boolean { return typeof val === 'boolean'; }
  isString(val: any): boolean { return typeof val === 'string'; } 
  onSet() {
    //console.log("set",this.tempselts);
    if (this.data.gridaction=='editprop') {
      this.ws.setValues(this.data.mod,this.data.propname,this.tempselts);
    }  
    if (this.data.gridaction=='editline') {
      this.ws.lineUpdate(this.data.mod,this.data.propname,this.data.line,this.tempselts);
    }  
    if (this.data.gridaction=='add') {
      this.ws.lineCreate(this.data.mod,this.data.propname,this.tempselts);
    }  
    this.dialogRef.close();
  } 
  onCancel() {
   //console.log("cancel");
    //this.closeModalEvent.emit(false);
    this.dialogRef.close();
  } 

}
