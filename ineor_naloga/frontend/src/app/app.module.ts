// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './components/form/form.component';
import { BarbersService } from './data/services/barbers.service';
import { CommonModule, DatePipe } from '@angular/common';
import { SuccessComponent } from './components/success/success.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent, SuccessComponent], 
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, CommonModule, ReactiveFormsModule ],
  providers: [BarbersService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
