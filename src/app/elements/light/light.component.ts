import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { BaseChartDirective } from 'ng2-charts';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { MatTable } from '@angular/material/table';


@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.css']
})
export class LightComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  @Input() elt!: string;
  @Input() grid2! :Array<{[key: string]: any}>;
  subsPush: any;
  @ViewChild(BaseChartDirective) public chartGXY?: BaseChartDirective;  

  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red
  

  constructor(public ws:WebsocketService) { }


  ngOnInit(): void {
  }

}
