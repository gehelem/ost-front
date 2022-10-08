import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleContentComponent } from './module-content/module-content.component';

@NgModule({
  declarations: [
    AppComponent,
    ModuleContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor (public ws:WebsocketService) { 
  }
}
