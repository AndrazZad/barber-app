import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package } from '../classes/package.model';

@Injectable({
  providedIn: 'root'
})
export class BarbersService {


  private apiUrl = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  getBarbers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "/barbers");
    
  }

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "/services");
  }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "/appointments");
  }

  postAppointment(packageData: Package): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl + "/appointments", packageData);
  }

  
}
