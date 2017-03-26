import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

import {TestRootComponent} from './test.root.component';

@NgModule({
  declarations: [
    TestRootComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [TestRootComponent]
})
export class TestRootModule {}
