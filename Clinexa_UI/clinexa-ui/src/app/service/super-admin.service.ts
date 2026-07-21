import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  private readonly baseUrl = `${environment.apiUrl}/super-admin`;

  constructor(private http: HttpClient) {}

  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admins`);
  }

  createAdmin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admins`, data, {
      responseType: 'text',
    });
  }

  updateAdminStatus(id: number, enabled: boolean): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/admins/${id}/status?enabled=${enabled}`,
      {},
      {
        responseType: 'text',
      },
    );
  }
}
