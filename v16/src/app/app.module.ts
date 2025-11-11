import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { PrimeNgModule } from './primeng.module';
import { HttpClientModule } from '@angular/common/http';
import { AppModalComponent } from './components/shared/app-modal/app-modal.component';
import { UserFormComponent } from './components/shared/user-form/user-form.component';
import { DeleteConfirmModalComponent } from './components/shared/delete-confirm-modal/delete-confirm-modal.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    AppModalComponent,
    UserFormComponent,
    DeleteConfirmModalComponent,
    UserDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PrimeNgModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
