import { NgModule,signal,ChangeDetectionStrategy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatIcon, MatIconModule } from '@angular/material/icon'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu';
import { MatButtonModule as MatButtonModule} from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card';
import { MatSlider as MatSlider, MatSliderModule as MatSliderModule,MatSliderChange as MatSliderChange } from '@angular/material/slider';
import { MarkdownModule, MarkdownService } from 'ngx-markdown'; 
import { Marked, marked } from 'marked'
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule,MatDatepickerInputEvent} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

import { NgImageSliderModule } from 'ng-image-slider';
import { MatAccordion} from '@angular/material/expansion';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatDialogModule as MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule as MatTabsModule} from '@angular/material/tabs'; 
import { FormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket.service';
import { ModuleContentComponent } from './module-content/module-content.component';
import { PropComponent, DialogImage,DialogStats,DialogHisto } from './prop/prop.component';
import { EditComponent } from './prop/edit/edit.component';
//import { LineChartComponent } from './line-chart/line-chart.component';
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatTableModule as MatTableModule,MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { NgChartsModule,NgChartsConfiguration } from 'ng2-charts';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSortModule } from '@angular/material/sort';
import {MatSelectModule as MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule as MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule as MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule as MatProgressBarModule} from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { DragDropModule,CdkDrag } from '@angular/cdk/drag-drop';
import { ScreenOrientation } from '@capacitor/screen-orientation';


import * as moment from 'moment';
import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';
import { GraphXYComponent } from './elements/graph-xy/graph-xy.component';
import { LightComponent } from './elements/light/light.component';
import { GraphPhdComponent } from './elements/graph-phd/graph-phd.component';
import { GraphDyComponent } from './elements/graph-dy/graph-dy.component';
import { BobscornerComponent } from './bobscorner/bobscorner.component';

@NgModule({
  declarations: [
    AppComponent,
    ModuleContentComponent,
    PropComponent,
    DialogImage,
    DialogStats,
    DialogHisto,
    EditComponent,
    GraphXYComponent,
    LightComponent,
    GraphPhdComponent,
    GraphDyComponent,
    BobscornerComponent,
//    LineChartComponent
    
    
  ],

  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    NgImageSliderModule,
    MatExpansionModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    NgChartsModule,
    MatBadgeModule,
    MatSortModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,       
    MatGridListModule,
    DragDropModule,
    MatSliderModule,
    MatSnackBarModule,
    MarkdownModule.forRoot(),
    MatDatepickerModule,
  
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    provideNativeDateAdapter(),
    ],
  bootstrap: [AppComponent],
})
export class AppModule { 
  constructor (public ws:WebsocketService) { 
  }
}
