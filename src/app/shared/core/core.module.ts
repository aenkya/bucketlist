import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LoaderComponent } from './loader.component';
import { FeedLoaderComponent } from './feed-loader.component';
import { NoBucketsComponent } from './nobuckets.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    LoaderComponent,
    FeedLoaderComponent,
    NoBucketsComponent
  ],
  exports: [
    LoaderComponent,
    FeedLoaderComponent,
    NoBucketsComponent
  ]
})

export class CoreModule {

}
