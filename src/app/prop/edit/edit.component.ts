import { Component, OnInit,Input,Inject, Directive, ElementRef, HostListener, AfterViewInit,signal}  from '@angular/core';
import { KeyValue } from '@angular/common';
import {MatDialogRef as MatDialogRef,MatDialog as MatDialog, MAT_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSelectModule as MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule as MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';

import { WebsocketService } from '../../websocket.service';
import {} from '@angular/material/dialog';


import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';

export function determineId(id: any): string {
  if (id.constructor.name === 'array' && id.length > 0) {
     return '' + id[0];
  }
  return '' + id;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public focusedElement:string='';
  tempselts: {[key: string]: any} ={};
  datePickerEvents = signal<string[]>([]);  

  constructor(@Inject(MAT_DIALOG_DATA) public data: {mod:string,propname:string,prop: Prp,focus: string,line:number,gridaction:string},public dialogRef: MatDialogRef<EditComponent>, public ws:WebsocketService) {
  }
  ngOnInit(): void {
    this.tempselts={};
    if (this.data.gridaction=='editprop') {
      Object.entries(this.data.prop.elts).forEach(([key, value], index) => {
        if (value.type!='date'&&value.type!='time') {
          this.tempselts[key]=value.value;
        }
        if (value.type=='date') {
          this.tempselts[key] = new Date(value.dateYear,value.dateMonth-1,value.dateDay);
        }
        if (value.type=='time') {
          this.tempselts[key] = value.timeHH.toString().padStart(2, '0')+":"+value.timeMM.toString().padStart(2, '0')+":"+value.timeSS.toString().padStart(2, '0')+"."+value.timeMS.toString().padStart(3, '0');
        }
      });
    }
    if (this.data.gridaction=='editline') {
      console.log(this.data);
      Object.entries(this.data.prop.gridheaders).forEach(([key, value], index) => {
          if ((this.data.prop.elts[value].type!='time')&&(this.data.prop.elts[value].type!='date')) {
            this.tempselts[value]=this.data.prop.grid[this.data.line][index];
          }
          if (this.data.prop.elts[value].type=='time') {
            var hh:string = this.data.prop.grid[this.data.line][index].hh.toString().padStart(2, '0');
            var mm:string = this.data.prop.grid[this.data.line][index].mm.toString().padStart(2, '0');
            var ss:string = this.data.prop.grid[this.data.line][index].ss.toString().padStart(2, '0');
            var ms:string = this.data.prop.grid[this.data.line][index].ss.toString().padStart(3, '0');
            this.tempselts[value]=hh+':'+mm+':'+ss+'.'+ms;

          }
          if (this.data.prop.elts[value].type=='date') {
            var day:number=this.data.prop.grid[this.data.line][index].day;
            var month:number=this.data.prop.grid[this.data.line][index].month;
            var year:number=this.data.prop.grid[this.data.line][index].year;
            this.tempselts[value]=new Date(year,month-1,day);
          }

          
      });
    }
      //console.log('init result = ',this.tempselts);

  }

  public originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return a.value.order < b.value.order ? -1 : (b.value.order < a.value.order ? 1 : 0);
  }
  public originalOrderLov = (a: KeyValue<string|number,string>, b: KeyValue<string|number,string>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }
  compareIds(id1: any, id2: any): boolean {
    const a1 = determineId(id1);
    const a2 = determineId(id2);
    return a1 === a2;
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
  datePickerEvent(type: string, elt:string,event: MatDatepickerInputEvent<Date>) {
    this.datePickerEvents.update(events => [...events, `${type}: ${event.value}`]);
    this.tempselts[elt] = event.value;
  }
  onTimerChange(event: any,elt:string) {
    var e = (event.target as HTMLSelectElement).value;
    this.tempselts[elt] = e;    
  }


}
