import { AfterViewInit, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormComponent } from '../form/form.component';
import { BarbersService } from '../../data/services/barbers.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormMobileComponent } from '../form-mobile/form-mobile.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ FormsModule, FormComponent, CommonModule, FormMobileComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements AfterViewInit {

  isScreenLarge: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScreenLarge = window.innerWidth > 1300; 
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScreenLarge = window.innerWidth > 1300; 
    }
  }

 
}
