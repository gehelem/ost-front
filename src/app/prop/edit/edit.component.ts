import { Component, OnInit,Input,Inject }  from '@angular/core';
import { KeyValue } from '@angular/common';

import { WebsocketService } from '../../websocket.service';

import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @Input() prop!: string;
  tempselts: {[key: string]: any} ={};
  constructor(public ws:WebsocketService) {
  }
  ngOnInit(): void {
    console.log('init dialog');
    this.tempselts={};
    Object.entries(this.ws.datastore.tempProp.elts).forEach(([key, value], index) => {
      console.log('init elt',key,value);
      this.tempselts[key]=value.value;
      });
      console.log('init result = ',this.tempselts);

  }

  public originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return 0;
  }
  isNumber(val: any): boolean { return typeof val === 'number'; }
  isBoolean(val: any): boolean { return typeof val === 'boolean'; }
  isString(val: any): boolean { return typeof val === 'string'; }  
}
