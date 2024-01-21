import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SuccessComponent } from './components/success/success.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'form', component: FormComponent }, // Add this line for the form route
  { path: 'success', component: SuccessComponent }
  // Add more routes if needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
