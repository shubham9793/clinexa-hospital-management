import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private baseUrl = 'http://localhost:8081/activities';

  constructor(private http: HttpClient) {}

  getActivities() {
    return this.http.get<any[]>(this.baseUrl);
  }

}
