import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatIcon, MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule} from '@angular/material/button'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket.service';
import { ModuleContentComponent } from './module-content/module-content.component';

@NgModule({
  declarations: [
    AppComponent,
    ModuleContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor (public ws:WebsocketService) { 
  }
}
