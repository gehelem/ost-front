import { EventEmitter} from '@angular/core';
import { fr } from "date-fns/locale";


export class Elt {
    pushVal: EventEmitter<any> = new EventEmitter();
    getSubsPush() {
        return this.pushVal;
    }
    label: string='';
    type: string='';
    graphtype: string='';
    X: string='';
    Y: string='';
    D: string='';
    value: string | number | boolean = false;
    valueN:number=0;
    hint:string='';
    min: number=0;
    max: number=0;
    step: number=0;
    order: string='';   
    listOfValues:{[key: string|number]: string} ={};

    url: string='';   
    imgurljpeg: string='';   
    imgalternates: Array<string>=[''];   
    imgurlfits: string='';   
    imgurlthumbnail: string='';   
    imgurloverlay: string='';   
    imgheight: number=0;   
    imgwidth: number=0;   
    imgchannels: number=0;   
    imgSNR: number=0;   
    imgHFRavg: number=0;   
    imgstars: number=0;   
    imgissolved: boolean=false;   
    imgsolverRA: number=0;   
    imgsolverDE: number=0;   
    imgmin: Array<number>=[0];   
    imgmax: Array<number>=[0];   
    imgmean: Array<number>=[0];   
    imgstddev: Array<number>=[0];   
    imgmedian: Array<number>=[0];   
    imghisto: Array<Array<number>>=[[0]];  
    prgtype:string='bar';   
    prgdynlabel:string='';   
    prgvalue: number=5;     
    showstats:boolean=false;
    dateYear:number=0;
    dateMonth:number=0;
    dateDay:number=0;
    timeHH:number=0;
    timeMM:number=0;
    timeSS:number=0;
    timeMS:number=0;
    timeUseMS:boolean=false;

    date = new Date((new Date().getTime() - 3888000000));
    time = new Date((new Date().getTime() - 3888000000));

    hasLOV=false;
    hasGlobalLOV=false;
    globallov:string='';
    directedit:boolean=false;    
    badge:boolean=false;    
    preicon:string='';
    posticon:string='';
    slider:number=0;    

    
    getLov(s:string|number):string {
        return this.listOfValues[s];
    }
    getLovAny(s:any):string {
        return this.listOfValues[s];
    }
    getValueString(s:any):string {
        return s as string;
    }
 
    isNumber(val: any): boolean { 
        return typeof val === 'number'; 
    }

    setValue (json:any) {
      if (json) {
            this.value=json['value'];
            this.badge=json['badge'];

            if (this.isNumber(json['value'])) {
                this.valueN=json['value'];
            }
            if (this.type=='prg') {
              this.prgvalue=json['value'];
              this.prgdynlabel=json['dynlabel'];
            }
            if (this.type=='video') {
              this.url=json['url']+"?"+ new Date().getTime();;
            }

            if (this.type=='img') {
              this.imgurljpeg=json['urljpeg']+"?"+ new Date().getTime();
              if (json['urlfits']) this.imgurlfits=json['urlfits']+"?"+ new Date().getTime();
              if (json['urlthumbnail']) this.imgurlthumbnail=json['urlthumbnail']+"?"+ new Date().getTime();
              if (json['urloverlay']) this.imgurloverlay=json['urloverlay']+"?"+ new Date().getTime();
              if (json['height']) this.imgheight=json['height'];
              if (json['width']) this.imgwidth=json['width'];
              if (json['channels']) this.imgchannels=json['channels'];
              if (json['snr']) this.imgSNR=json['snr'];
              if (json['hfravg']) this.imgHFRavg=json['hfravg'];
              if (json['stars']) this.imgstars=json['stars'];
              if (json['showstats']) this.showstats=json['showstats'];
              this.imgissolved=json['issolved'];
              this.imgsolverRA=json['solverra'];
              this.imgsolverDE=json['solverde'];

              for (let i=0;i<this.imgchannels;i++) {
                if (json['min']) this.imgmin[i]=json['min'][i];
                if (json['max']) this.imgmax[i]=json['max'][i];
                if (json['mean']) this.imgmean[i]=json['mean'][i];
                if (json['stddev']) this.imgstddev[i]=json['stddev'][i];
                if (json['median']) this.imgmedian[i]=json['median'][i];
                if (json['histogram']) 
                {
                  this.imghisto[i]=json['histogram'][i];
                } 

              }

              this.imgalternates.splice(0);
              if (json['alternates']) {
                var vals=json['alternates'];
                Object.entries(vals).forEach(([key, value], index) => {
                    this.imgalternates.push((value as string)+"?"+ new Date().getTime());
                });                
              }



              

            }  

            if (this.type=='date') {
              this.dateYear=json['year'];
              this.dateMonth=json['month'];
              this.dateDay=json['day'];
              this.date = new Date(json['year'],json['month']-1,json['day']);
            }

            if (this.type=='time') {
              this.timeHH=json['hh'];
              this.timeMM=json['mm'];
              this.timeSS=json['ss'];
              this.timeMS=json['ms'];
              if (this.timeUseMS) this.timeMS=json['ms']; else this.timeMS=0;
              this.time = new Date(0,0,1,this.timeHH,this.timeMM,this.timeSS,this.timeMS);
            }

        } 

    }
    setAll (json:any,propjson:any) {
        if (json) {
            this.type=json['type'];
            this.label=json['label'];
            this.value=json['value'];
            if (this.type=='bool') {
              if (!json['value']) {
                this.value=false;
              }
            }            
            if (this.isNumber(json['value'])) {
                this.valueN=json['value'];
            }
            this.min=json['min'];
            this.max=json['max'];
            this.step=json['step'];
            this.order=json['order'];
            this.badge=json['badge'];
            if (json['hint']) this.hint=json['hint'];
            if (this.type=='video') {
              this.url=json['url']+"?"+ new Date().getTime();;
            }

            if (this.type=='img') {
              this.imgurljpeg=json['urljpeg']+"?"+ new Date().getTime();
              if (json['urlfits']) this.imgurlfits=json['urlfits']+"?"+ new Date().getTime();
              if (json['urlthumbnail']) this.imgurlthumbnail=json['urlthumbnail']+"?"+ new Date().getTime();
              if (json['urloverlay']) this.imgurloverlay=json['urloverlay']+"?"+ new Date().getTime();
              if (json['height']) this.imgheight=json['height'];
              if (json['width']) this.imgwidth=json['width'];
              if (json['channels']) this.imgchannels=json['channels'];
              if (json['snr']) this.imgSNR=json['snr'];
              if (json['hfravg']) this.imgHFRavg=json['hfravg'];
              if (json['stars']) this.imgstars=json['stars'];
              if (json['showstats']) this.showstats=json['showstats'];
              this.imgissolved=json['issolved'];
              this.imgsolverRA=json['solverra'];
              this.imgsolverDE=json['solverde'];

              for (let i=0;i<this.imgchannels;i++) {
                if (json['min']) this.imgmin[i]=json['min'][i];
                if (json['max']) this.imgmax[i]=json['max'][i];
                if (json['mean']) this.imgmean[i]=json['mean'][i];
                if (json['stddev']) this.imgstddev[i]=json['stddev'][i];
                if (json['median']) this.imgmedian[i]=json['median'][i];
                if (json['histogram']) 
                {
                  this.imghisto[i]=json['histogram'][i];
                } 

              }

              this.imgalternates.splice(0);
              if (json['alternates']) {
                var vals=json['alternates'];
                Object.entries(vals).forEach(([key, value], index) => {
                  this.imgalternates.push((value as string)+"?"+ new Date().getTime());
                });                
              }

            }  
            if (json['directedit']) this.directedit=json['directedit'];
            if (json['slider']) this.slider=json['slider'];
            if (json['preicon']) this.preicon=json['preicon'];
            if (json['posticon']) this.posticon=json['posticon'];
            if (json['listOfValues']&&json['listOfValues']!='') {
                var vals=json['listOfValues'];
                this.hasLOV=true;
                Object.entries(vals).forEach(([key, value], index) => {
                    //console.log("vals ",key,"=",value);
                    this.listOfValues[key]=value as string;
                });
                //console.log("listOfValues ",this.listOfValues);
            }
            if (json['globallov']&&json['globallov']!='') {
                var vals=json['globallov'];
                this.hasLOV=false;
                this.hasGlobalLOV=true;
                this.globallov=json['globallov'];
            }
            if (this.type=='prg') {
              this.prgvalue=json['value'];
              this.prgtype=json['prgtype'];
              this.prgdynlabel=json['dynlabel'];
            }

            if (this.type=='date') {
              this.dateYear=json['year'];
              this.dateMonth=json['month'];
              this.dateDay=json['day'];
              this.date = new Date(json['year'],json['month']-1,json['day']);
            }

            if (this.type=='time') {
              this.timeHH=json['hh'];
              this.timeMM=json['mm'];
              this.timeSS=json['ss'];
              this.timeUseMS=json['usems'];
              if (this.timeUseMS) this.timeMS=json['ms']; else this.timeMS=0;
              this.time = new Date(0,0,1,this.timeHH,this.timeMM,this.timeSS,this.timeMS);
              console.log(this.time);
            }

            this.pushVal.emit('from elts '+this.label);
        } 
    }
    resetValues() {

    }
    pushValues(json:any) {
        this.pushVal.emit('toto');

    }
}
