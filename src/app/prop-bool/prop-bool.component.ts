import { Component, OnInit,Input } from '@angular/core';
import { KeyValue } from '@angular/common';

import { WebsocketService } from '../websocket.service';

import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';

@Component({
  selector: 'app-prop-bool',
  templateUrl: './prop-bool.component.html',
  styleUrls: ['./prop-bool.component.css']
})
export class PropBoolComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  @Input() data: any;  


  constructor(public ws:WebsocketService) { }

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


}
