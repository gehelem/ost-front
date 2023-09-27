import { Component, OnInit,AfterViewInit,AfterContentInit,Input,Inject,ViewChild } from '@angular/core';
import { KeyValue,CommonModule } from '@angular/common';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


import { WebsocketService } from '../websocket.service';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { EditComponent} from './edit/edit.component'
import { MatTable } from '@angular/material/table';
import { from } from 'rxjs';

export function determineId(id: any): string {
  if (id.constructor.name === 'array' && id.length > 0) {
     return '' + id[0];
  }
  return '' + id;
}

declare var Celestial: any;

@Component({
  selector: 'app-prop',
  templateUrl: './prop.component.html',
  styleUrls: ['./prop.component.css']
})
export class PropComponent implements OnInit,AfterViewInit,AfterContentInit {
  @Input() mod!: string;
  @Input() prop!: string;
  subsPush: any;
  subsPush2!: Array<any>;
  @ViewChild(BaseChartDirective) public chartGDY?: BaseChartDirective;
  @ViewChild(BaseChartDirective) public chartGXY?: BaseChartDirective;
  @ViewChild(BaseChartDirective) public chartGXY2?: BaseChartDirective;
  @ViewChild(BaseChartDirective) public chartGPHD?: BaseChartDirective;
  @ViewChild(MatTable)  mytable?: MatTable<mytabledatasource>;
  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red
  viewskychart :boolean = false;
  constructor(public ws:WebsocketService,public imagedialog: MatDialog,public statsdialog: MatDialog, public editdrop:MatDialog ) { }
  ngAfterContentInit(): void {

  }

  ngOnInit(): void {
    this.subsPush = this.ws.datastore.mods[this.mod].prps[this.prop].getSubsPush()
    .subscribe( msg => this.OnPushVal(msg));    

  } 
  ngAfterViewInit(): void {

  }


  OnPushVal(msg: any) {
    //console.log("OnPushVal = ",this.mod,'/',this.prop,':',msg);
    this.chartGDY?.update();
    this.chartGXY?.update();
    this.chartGPHD?.update();
    this.mytable?.renderRows();
  }
  OnPushVal2(msg: any) {
    //console.log("OnPushVal2 = ",this.mod,'/',this.prop,':',msg);
    this.chartGDY?.update();
    this.chartGXY?.update();
    this.chartGPHD?.update();
    this.mytable?.renderRows();
  }

  originalOrderMod = (a: KeyValue<string,Mod>, b: KeyValue<string,Mod>): number => {
    return a.value.label > b.value.label ? -1 : (b.value.label > a.value.label ? 1 : 0);
  }
  originalOrderPrp = (a: KeyValue<string,Prp>, b: KeyValue<string,Prp>): number => {
    if(a.key=='extextRW'||b.key=='extextRW') {
      //console.log("order prp ",a.key,a.value.order,b.key,b.value.order);
      //console.log(a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0));
    }
    return a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0);

  }
  originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    if(a.key=='NS'||b.key=='code'||b.key=='RA'||b.key=='DEC') {
      //console.log("order prp ",a.key,a.value.order,b.key,b.value.order);
      //console.log(a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0));
    }
    return a.value.order > b.value.order ? 1 : (b.value.order > a.value.order ? -1 : 0);

  }
  originalOrderString = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }
  originalOrderLov = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }
  onLovChange(event: any,elt:string) {
    this.ws.setElt(this.mod,this.prop,elt,event.value);    
  }
  onKeyDown(event: any) {
    //console.log("------------------" + (event.target as HTMLSelectElement).value);
    // uggly : 
    this.ws.setValue(this.mod,this.prop,(event.target as HTMLSelectElement).value);    
  }
  onKeyDownElt(event: any,elt:string) {
    //console.log("-----------set elt -------" + (event.target as HTMLSelectElement).value);
    // uggly : 
    this.ws.setElt(this.mod,this.prop,elt,(event.target as HTMLSelectElement).value);    
  }

  isNumber(val: any): boolean { return typeof val === 'number'; }
  isBoolean(val: any): boolean { return typeof val === 'boolean'; }
  isString(val: any): boolean { return typeof val === 'string'; }
  
  openImage(elt:Elt) {
    this.imagedialog.open(DialogImage,{
      data:{elt:elt,serverurl:this.ws.serverurl},
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',      
      panelClass: 'full-screen-modal'

    });
  }
  openStats(elt:Elt) {
    this.statsdialog.open(DialogStats,{
      data:{elt:elt,serverurl:this.ws.serverurl},
    });
  }
  openEditProp(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('editprop:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.editdrop.open(EditComponent,{data:{mod:this.mod,propname:this.prop,prop:myprop,focus:focus,line:gridline,gridaction:gridaction}});
  }
  lineDel(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('lineDel:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.ws.lineDelete(this.mod,this.prop,gridline);
  }
  lineUp(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('lineUp:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.ws.lineUp(this.mod,this.prop,gridline);
  }
  lineDown(myprop: Prp,focus:string,gridaction:string,gridline:number) {
    console.log('lineDown:',myprop.label,' -- focus=',focus,'gridaction=',gridaction,'gridline=',gridline);
    this.ws.lineDown(this.mod,this.prop,gridline);
  }
  clickRow(row: any) {
    this.ws.lineSelect(this.mod,this.prop,row);
  }
  hidecelestial() {
    this.viewskychart=false;
  }
  showcelestial() {
    this.viewskychart=true;
    this.loadcelestial();

  }
  
  loadcelestial() {
    
    const celconfig = { 
      width: 0,           // Default width, 0 = full parent element width; 
                          // height is determined by projection
      projection: "aitoff",    // Map projection used: see below
      projectionRatio: null,   // Optional override for default projection ratio
      transform: "equatorial", // Coordinate transformation: equatorial (default),
                              // ecliptic, galactic, supergalactic
      center: [0,0,0],       // Initial center coordinates in set transform
                          // [longitude, latitude, orientation] all in degrees 
                          // null = default center [0,0,0]
      orientationfixed: true,  // Keep orientation angle the same as center[2]
      geopos: null,       // optional initial geographic position [lat,lon] in degrees, 
                          // overrides center
      follow: "zenith",   // on which coordinates to center the map, default: zenith, if location enabled, 
                          // otherwise center
      zoomlevel: 5,    // initial zoom level 0...zoomextend; 0|null = default, 1 = 100%, 0 < x <= zoomextend
      zoomextend: 100,     // maximum zoom level
      adaptable: true,    // Sizes are increased with higher zoom-levels
      interactive: true,  // Enable zooming and rotation with mousewheel and dragging
      form: false,         // Display form for interactive settings. Needs a div with
                          // id="celestial-form", created automatically if not present
      location: false,    // Display location settings. Deprecated, use formFields below
      formFields: {"location": false,  // Set visiblity for each group of fields with the respective id
                  "general": false,  
                  "stars": false,  
                  "dsos": false,  
                  "constellations": false,  
                  "lines": false,  
                  "other": false,  
                  "download": false},  
      advanced: false,     // Display fewer form fields if false 
      daterange: [],      // Calender date range; null: displaydate-+10; [n<100]: displaydate-+n; [yr]: yr-+10; 
                          // [yr, n<100]: [yr-n, yr+n]; [yr0, yr1]  
      controls: true,     // Display zoom controls
      lang: "",           // Global language override for names, any name setting that has the chosen language available
                          // Default: desig or empty string for designations, other languages as used anywhere else
      culture: "",        // Source of constellations and star names, default "iau", other: "cn" Traditional Chinese
      container: "celestial-map",   // ID of parent element, e.g. div, null = html-body
      datapath: "data/",  // Path/URL to data files, empty = subfolder 'data'
      stars: {
        show: true,    // Show stars
        limit: 20,      // Show only stars brighter than limit magnitude
        colors: true,  // Show stars in spectral colors, if not use default color
        style: { fill: "#ffffff", opacity: 1 }, // Default style for stars
        designation: true, // Show star names (Bayer, Flamsteed, Variable star, Gliese or designation, 
                          // i.e. whichever of the previous applies first); may vary with culture setting
        designationType: "desig",  // Which kind of name is displayed as designation (fieldname in starnames.json)
        designationStyle: { fill: "#ddddbb", font: "11px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif", align: "left", baseline: "top" },
        designationLimit: 2.5,  // Show only names for stars brighter than nameLimit
        propername: false,   // Show proper name (if present)
        propernameType: "name", // Languge for proper name, default IAU name; may vary with culture setting 
                                // (see list below of languages codes available for stars)
        propernameStyle: { fill: "#ddddbb", font: "13px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif", align: "right", baseline: "bottom" },
        propernameLimit: 1.5,  // Show proper names for stars brighter than propernameLimit
        size: 7,       // Maximum size (radius) of star circle in pixels
        exponent: -0.28, // Scale exponent for star size, larger = more linear
        data: 'stars.8.json' // Data source for stellar data, 
                            // number indicates limit magnitude
      },
      dsos: {
        show: true,    // Show Deep Space Objects 
        limit: 16,      // Show only DSOs brighter than limit magnitude
        colors: true,  // // Show DSOs in symbol colors if true, use style setting below if false
        style: { fill: "#cccccc", stroke: "#cccccc", width: 2, opacity: 1 }, // Default style for dsos
        names: true,   // Show DSO names
        namesType: "name",  // Type of DSO ('desig' or language) name shown
                            // (see list below for languages codes available for dsos)
        nameStyle: { fill: "#cccccc", font: "11px Helvetica, Arial, serif", 
                    align: "left", baseline: "top" }, // Style for DSO names
        nameLimit: 6,  // Show only names for DSOs brighter than namelimit
        size: null,    // Optional seperate scale size for DSOs, null = stars.size
        exponent: 1.4, // Scale exponent for DSO size, larger = more non-linear
        data: 'dsos.bright.json', // Data source for DSOs, 
                                  // opt. number indicates limit magnitude
        symbols: {  //DSO symbol styles, 'stroke'-parameter present = outline
          gg: {shape: "circle", fill: "#ff0000"},          // Galaxy cluster
          g:  {shape: "ellipse", fill: "#ff0000"},         // Generic galaxy
          s:  {shape: "ellipse", fill: "#ff0000"},         // Spiral galaxy
          s0: {shape: "ellipse", fill: "#ff0000"},         // Lenticular galaxy
          sd: {shape: "ellipse", fill: "#ff0000"},         // Dwarf galaxy
          e:  {shape: "ellipse", fill: "#ff0000"},         // Elliptical galaxy
          i:  {shape: "ellipse", fill: "#ff0000"},         // Irregular galaxy
          oc: {shape: "circle", fill: "#ffcc00", 
              stroke: "#ffcc00", width: 1.5},             // Open cluster
          gc: {shape: "circle", fill: "#ff9900"},          // Globular cluster
          en: {shape: "square", fill: "#ff00cc"},          // Emission nebula
          bn: {shape: "square", fill: "#ff00cc", 
              stroke: "#ff00cc", width: 2},               // Generic bright nebula
          sfr:{shape: "square", fill: "#cc00ff", 
              stroke: "#cc00ff", width: 2},               // Star forming region
          rn: {shape: "square", fill: "#00ooff"},          // Reflection nebula
          pn: {shape: "diamond", fill: "#00cccc"},         // Planetary nebula 
          snr:{shape: "diamond", fill: "#ff00cc"},         // Supernova remnant
          dn: {shape: "square", fill: "#999999", 
              stroke: "#999999", width: 2},               // Dark nebula grey
          pos:{shape: "marker", fill: "#cccccc", 
              stroke: "#cccccc", width: 1.5}              // Generic marker
        }
      },
      planets: {  //Show planet locations, if date-time is set
        show: false,
        // List of all objects to show
        which: ["sol", "mer", "ven", "ter", "lun", "mar", "jup", "sat", "ura", "nep"],
        // Font styles for planetary symbols
        symbols: {  // Character and color for each symbol in 'which' above (simple circle: \u25cf), optional size override for Sun & Moon
          "sol": {symbol: "\u2609", letter:"Su", fill: "#ffff00", size:""},
          "mer": {symbol: "\u263f", letter:"Me", fill: "#cccccc"},
          "ven": {symbol: "\u2640", letter:"V", fill: "#eeeecc"},
          "ter": {symbol: "\u2295", letter:"T", fill: "#00ccff"},
          "lun": {symbol: "\u25cf", letter:"L", fill: "#ffffff", size:""}, // overridden by generated crecent, except letter & size
          "mar": {symbol: "\u2642", letter:"Ma", fill: "#ff6600"},
          "cer": {symbol: "\u26b3", letter:"C", fill: "#cccccc"},
          "ves": {symbol: "\u26b6", letter:"Ma", fill: "#cccccc"},
          "jup": {symbol: "\u2643", letter:"J", fill: "#ffaa33"},
          "sat": {symbol: "\u2644", letter:"Sa", fill: "#ffdd66"},
          "ura": {symbol: "\u2645", letter:"U", fill: "#66ccff"},
          "nep": {symbol: "\u2646", letter:"N", fill: "#6666ff"},
          "plu": {symbol: "\u2647", letter:"P", fill: "#aaaaaa"},
          "eri": {symbol: "\u26aa", letter:"E", fill: "#eeeeee"}
        },
        symbolStyle: { fill: "#00ccff", font: "bold 17px 'Lucida Sans Unicode', Consolas, sans-serif", 
                align: "center", baseline: "middle" },
        symbolType: "symbol",  // Type of planet symbol: 'symbol' graphic planet sign, 'disk' filled circle scaled by magnitude
                              // 'letter': 1 or 2 letters S Me V L Ma J S U N     
        names: false,          // Show name in nameType language next to symbol
        nameStyle: { fill: "#00ccff", font: "14px 'Lucida Sans Unicode', Consolas, sans-serif", align: "right", baseline: "top" },
        namesType: "desig"     // Language of planet name (see list below of language codes available for planets), 
                              // or desig = 3-letter designation
      },
      constellations: {
        names: true,      // Show constellation names 
        namesType: "iau", // Type of name Latin (iau, default), 3 letter designation (desig) or other language (see list below)
        nameStyle: { fill:"#cccc99", align: "center", baseline: "middle", 
                    font: ["14px Helvetica, Arial, sans-serif",  // Style for constellations
                            "12px Helvetica, Arial, sans-serif",  // Different fonts for diff.
                            "11px Helvetica, Arial, sans-serif"]},// ranked constellations
        lines: true,   // Show constellation lines, style below
        lineStyle: { stroke: "#cccccc", width: 1, opacity: 0.6 }, 
        bounds: false, // Show constellation boundaries, style below
        boundStyle: { stroke: "#cccc00", width: 0.5, opacity: 0.8, dash: [2, 4] }
      },  
      mw: {
        show: true,     // Show Milky Way as filled multi-polygon outlines 
        style: { fill: "#ffffff", opacity: 0.15 }  // Style for MW layers
      },
      lines: {  // Display & styles for graticule & some planes
        graticule: { show: true, stroke: "#cccccc", width: 0.6, opacity: 0.8,   
          // grid values: "outline", "center", or [lat,...] specific position
          lon: {pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif"}, 
          // grid values: "outline", "center", or [lon,...] specific position
          lat: {pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif"}},    
        equatorial: { show: true, stroke: "#aaaaaa", width: 1.3, opacity: 0.7 },  
        ecliptic: { show: true, stroke: "#66cc66", width: 1.3, opacity: 0.7 },     
        galactic: { show: false, stroke: "#cc6666", width: 1.3, opacity: 0.7 },    
        supergalactic: { show: false, stroke: "#cc66cc", width: 1.3, opacity: 0.7 }
      },
      background: {        // Background style
        fill: "#000000",   // Area fill
        opacity: 1, 
        stroke: "#000000", // Outline
        width: 1.5
      }, 
      horizon: {  //Show horizon marker, if location is set and map projection is all-sky
        show: false, 
        stroke: "#cccccc", // Line
        width: 1.0, 
        fill: "#000000",   // Area below horizon
        opacity: 0.5
      },  
      daylight: {  //Show day sky as a gradient, if location is set and map projection is hemispheric
        show: false
      }
    };
    Celestial.display(celconfig);
  }

  compareIds(id1: any, id2: any): boolean {
    const a1 = determineId(id1);
    const a2 = determineId(id2);
    return a1 === a2;
  }


}
export interface ImgStats {
  name: string;
  value: number|string;
  valueR: number|string;
  valueG: number|string;
  valueB: number|string;  
}


@Component({
  selector: 'showimage',
  templateUrl: 'showimage.html',
})
export class DialogImage {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {elt: Elt,serverurl:string},
    private dialogRef: MatDialogRef<DialogImage>
    ) 
  {
  }
  closedialog() {
    this.dialogRef.close(true);
  }
  

}

@Component({
  selector: 'showstats',
  templateUrl: 'showstats.html',
})
export class DialogStats {
  displayedColumns: string[] = [];
  dataSource: ImgStats[] = [];  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {elt: Elt,serverurl:string},
    private dialogRef: MatDialogRef<DialogStats>
    ) 
  {
    this.dataSource[0]= {name: 'Height', value: data.elt.imgheight, valueR:"", valueG: "", valueB: ""};
    this.dataSource[1]= {name: 'Width',  value: data.elt.imgwidth, valueR:"", valueG: "", valueB: ""};
    this.dataSource[2]= {name: 'SNR',  value: data.elt.imgSNR, valueR:"", valueG: "", valueB: ""};

    if (this.data.elt.imgchannels==3) {
      this.displayedColumns = ['name', 'value', 'valueR', 'valueG', 'valueB'];
      this.dataSource[3]= {name: 'Mean',  value: "", valueR:data.elt.imgmean[0], valueG: data.elt.imgmean[1], valueB: data.elt.imgmean[2]};
      this.dataSource[4]= {name: 'Median',  value: "", valueR:data.elt.imgmedian[0], valueG: data.elt.imgmedian[1], valueB: data.elt.imgmedian[2]};
      this.dataSource[5]= {name: 'Min',  value: "", valueR:data.elt.imgmin[0], valueG: data.elt.imgmin[1], valueB: data.elt.imgmin[2]};
      this.dataSource[6]= {name: 'Max',  value: "", valueR:data.elt.imgmax[0], valueG: data.elt.imgmax[1], valueB: data.elt.imgmax[2]};
      this.dataSource[7]= {name: 'StdDev',  value: "", valueR:data.elt.imgstddev[0], valueG: data.elt.imgstddev[1], valueB: data.elt.imgstddev[2]};
    }
    
    if (this.data.elt.imgchannels==1) {
      this.displayedColumns = ['name', 'value'];
      this.dataSource[3]= {name: 'Mean',  value: data.elt.imgmean[0], valueR:"", valueG: "", valueB: ""};
      this.dataSource[4]= {name: 'Median',  value: data.elt.imgmedian[0], valueR:"", valueG: "", valueB: ""};
      this.dataSource[5]= {name: 'Min',  value: data.elt.imgmin[0], valueR:"", valueG: "", valueB: ""};
      this.dataSource[6]= {name: 'Max',  value: data.elt.imgmax[0], valueR:"", valueG: "", valueB: ""};
      this.dataSource[7]= {name: 'StdDev',  value: data.elt.imgstddev[0], valueR:"", valueG: "", valueB: ""};
    }
  }
  closedialog() {
    this.dialogRef.close(true);
  }
  

}

