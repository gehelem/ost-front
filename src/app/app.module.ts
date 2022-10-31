import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatIcon, MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule} from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatAccordion} from '@angular/material/expansion';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs'; 
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket.service';
import { ModuleContentComponent } from './module-content/module-content.component';
import { PropComponent } from './prop/prop.component';
import { EditComponent } from './prop/edit/edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'


@NgModule({
  declarations: [
    AppComponent,
    ModuleContentComponent,
    PropComponent,
    EditComponent
    
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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor (public ws:WebsocketService) { 
  }
}
