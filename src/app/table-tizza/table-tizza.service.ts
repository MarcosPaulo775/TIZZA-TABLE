import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

import { environment } from 'src/environments/environment';

interface Result {
    total_count: number;
    items: object[];
}

@Injectable({
    providedIn: 'root'
})
export class TableTizzaService {

    constructor(private http: HttpClient) { }

    listOS(options: { query: object, sort: string, order: string, page: number, limit: number, search?: string }): Observable<Result> {
        const href = environment.dataserver + '/os/list1';

        let requestUrl = `${href}?sort=${options.sort}&order=${options.order}&page=${options.page}&limit=${options.limit}`;

        if (options.search) {
            requestUrl += `&search=${options.search}`;
        }

        return this.http.get<Result>(requestUrl, {
            headers: new HttpHeaders({
                Authorization: localStorage.getItem('session'),
                query: JSON.stringify(options.query)
            })
        });
    }

}
