import { Component, OnInit,Input,AfterViewInit,ViewChild } from '@angular/core';
import { KeyValue } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatAccordion} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSort,Sort} from '@angular/material/sort';
import {MatTable,MatTableDataSource} from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MarkdownService,MarkdownModule } from 'ngx-markdown';


import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod, ostmessages } from 'src/datastructure/mod';
import { PropComponent } from '../prop/prop.component';
import { WebsocketService } from '../websocket.service';
import { Datastore } from 'src/datastructure/datastore';
import { Subscription } from 'rxjs';

declare var Celestial: any;

@Component({
  selector: 'app-module-content',
  templateUrl: './module-content.component.html',
  styleUrls: ['./module-content.component.css']
})
export class ModuleContentComponent implements OnInit,MatMenuModule,MatDialogModule,AfterViewInit {
  @Input() mod!: string;
  @Input() data: any;
  @Input() messagesSource!: MatTableDataSource<ostmessages>;
  @Input() datastore!: Datastore;
  @ViewChild(MatTable) table!: MatTable<ostmessages>;
  constructor(public ws:WebsocketService) { }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.messagesSource.sort = sort;
  }
  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red
  refreshMessages: any;
  
  messagesColumns: string[] = ['datetime', 'message'];

  ngOnInit(): void {
    this.refreshMessages = this.datastore.mods[this.mod].getRefreshMessages()
    .subscribe( msg => this.OnRefreshMessages(msg));    
    
  }
  ngAfterViewInit(): void {
    this.applyFilter();
  }
  OnRefreshMessages(msg: any) {
    console.log("OnRefreshMessages = ",this.mod,'/',msg);
    //this.chart?.update();
  }

  clickW () {
    this.data.showwarnings=!this.data.showwarnings;
    this.applyFilter ();
  }
  applyFilter () {
    this.messagesSource.filterPredicate = function(data, filter: string): boolean {
      var res: boolean = false;
      if ((data.type=='m')&&(filter.includes('m'))) {res=true;} ;
      if ((data.type=='w')&&(filter.includes('w'))) {res=true;} ;
      if ((data.type=='e')&&(filter.includes('e'))) {res=true;} ;
      return res;
    };
    var cm: string = (this.data.showinfos   ) ? 'm' : '-';
    var cw: string = (this.data.showwarnings) ? 'w' : '-';
    var ce: string = (this.data.showerrors  ) ? 'e' : '-';
    var concat:string = cm.concat(cw.concat(ce));
    this.messagesSource.filter=concat;

  }
  originalOrderMod = (a: KeyValue<string,Mod>, b: KeyValue<string,Mod>): number => {
    return a.value.label > b.value.label ? -1 : (b.value.label > a.value.label ? 1 : 0);
  }
  originalOrderPrp = (a: KeyValue<string,Prp>, b: KeyValue<string,Prp>): number => {
    if(a.key=='extextRW'||b.key=='extextRW') {
      console.log("order prp ",a.key,a.value.order,b.key,b.value.order);
      console.log(a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0));
    }
    return a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0);

  }
  originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0);
  }
  originalOrderString = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }  

  clearMessages() {
    this.datastore.mods[this.datastore.currentMod].clearMessages();
    this.ws.clearMessages(this.mod);
    this.table.renderRows();
  }    
}
