import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CustomMaterialModule } from './custom-material.module';

import { rootRouterConfig } from './app.routing';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { BucketlistComponent } from './bucketlist';

import { AuthService } from './shared/auth.service';
import { BucketlistService } from './shared/bucketlist.service';

import { AuthGuard } from './shared/auth.guard';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    rootRouterConfig,
    CustomMaterialModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    BucketlistComponent
  ],
  entryComponents: [
  ],
  providers: [
    AuthService,
    AuthGuard,
    BucketlistService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
