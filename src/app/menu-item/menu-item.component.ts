import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Mod } from '../../datastructure/mod'
import { MenuItem } from '../../datastructure/mod'
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items: MenuItem[] = [];
  @Input() devcat: string='';
  @ViewChild('childMenu') public childMenu: any;
  
  constructor(public router: Router,public ws:WebsocketService) { }
  
  ngOnInit(): void {
  }
  selectDevcatGroup(dc:string,gr:string) {
    this.ws.datastore.currentDev=dc;
    this.ws.datastore.currentGrp=gr;
    console.log('************'+ dc+ "--" + gr);

  }

}
