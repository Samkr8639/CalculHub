import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiInsightResponse {
  insight: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);

  getCalorieInsights(data: any): Observable<AiInsightResponse> {
    const payload = {
      calculatorType: 'calorie',
      data: data
    };
    return this.http.post<AiInsightResponse>('/api/ai-insight', payload);
  }
}
