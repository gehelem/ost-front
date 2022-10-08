import { Component, OnInit,Input } from '@angular/core';
import { KeyValue } from '@angular/common';

import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-module-content',
  templateUrl: './module-content.component.html',
  styleUrls: ['./module-content.component.css']
})
export class ModuleContentComponent implements OnInit {
  @Input() mod!: string;
  @Input() dev!: string;
  @Input() grp!: string;
  @Input() data: any;  
  constructor() { }

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
}