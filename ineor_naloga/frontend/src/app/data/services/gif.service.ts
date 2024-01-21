import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GifService {

  private apiUrl = 'http://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber';

  constructor(private http: HttpClient) { }

  searchGifs(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const gifs = response.data;
        if(gifs && gifs.length > 0) {
          const randomIndex = Math.floor(Math.random() * gifs.length);
          return gifs[randomIndex];
        } else {
          return null;
        }
      })
    );
  }
}
