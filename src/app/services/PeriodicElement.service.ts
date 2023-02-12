import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodicElement } from '../models/PeriodicElement';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class PeriodicElementService {
    elementApiUrl = 'http://localhost:8080/periodic-elements'
    constructor(private http: HttpClient) { }

    getElements(): Observable<PeriodicElement[]> {
        console.log(this.http.get<PeriodicElement[]>(this.elementApiUrl))
        return this.http.get<PeriodicElement[]>(this.elementApiUrl);
    }

    createElement(element: PeriodicElement): Observable<PeriodicElement> {
        return this.http.post<PeriodicElement>(this.elementApiUrl, element);
    }

    editElement(element: PeriodicElement): Observable<PeriodicElement> {
        return this.http.put<PeriodicElement>(`${this.elementApiUrl}?id=$(id)`, element);
    }

    deleteElement(id: number): Observable<any> {
        return this.http.delete<any>(`${this.elementApiUrl}?id=$(id)`);
    }

}