import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { BaseChartDirective } from 'ng2-charts';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-graph-dy',
  templateUrl: './graph-dy.component.html',
  styleUrls: ['./graph-dy.component.css']
})
export class GraphDyComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  subsPush: any;
  @ViewChild(BaseChartDirective) public chartGDY?: BaseChartDirective;


  constructor(public ws:WebsocketService) { }

  ngOnInit(): void {
    this.subsPush = this.ws.datastore.mods[this.mod].prps[this.prop].getSubsPush()
    .subscribe( msg => this.OnPushVal(msg));    
  }

  OnPushVal(msg: any) {
    this.chartGDY?.update();
  }



}
