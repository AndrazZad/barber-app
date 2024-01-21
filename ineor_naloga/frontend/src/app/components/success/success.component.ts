import { Component, OnInit } from '@angular/core';
import { GifService } from '../../data/services/gif.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {

  gif: any;

  constructor(private gifService: GifService) {}

  ngOnInit(): void {
      this.gifService.searchGifs().subscribe((data) => {
        this.gif = data;
        //console.log(this.gif);
      })
  }


}
