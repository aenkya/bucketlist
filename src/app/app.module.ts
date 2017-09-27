import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CoreModule } from './shared/core/core.module';
import { CustomMaterialModule } from './custom-material.module';

import { rootRouterConfig } from './app.routing';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { BucketlistComponent } from './bucketlist';
import { BucketlistDetailComponent } from './bucketlist-detail';
import { CreateBucketlistComponent } from './create-bucketlist';

import { AuthService } from './shared/auth.service';
import { BucketlistService } from './shared/bucketlist.service';

import { AuthGuard } from './shared/auth.guard';
import { DialogsService } from './shared/core/dialogs.service';

import { ConfirmDialog } from './shared/core/confirm.dialog';
import { CreateDialog } from './shared/core/create.dialog';
import { UpdateDialog } from './shared/core/update.dialog';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    rootRouterConfig,
    CustomMaterialModule,
    CoreModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    BucketlistComponent,
    BucketlistDetailComponent,
    CreateBucketlistComponent,
    ConfirmDialog,
    CreateDialog,
    UpdateDialog,
  ],
  entryComponents: [
    CreateBucketlistComponent,
    ConfirmDialog,
    CreateDialog,
    UpdateDialog
  ],
  providers: [
    AuthService,
    AuthGuard,
    BucketlistService,
    DialogsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
