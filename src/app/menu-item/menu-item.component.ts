import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Mod } from '../../datastructure/mod'
import { MenuItem } from '../../datastructure/mod'

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items: MenuItem[] = [];
  @ViewChild('childMenu') public childMenu: any;
  
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

}
