import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TrainingData} from "../domains/TrainingData";

@Injectable({
  providedIn: 'root'
})
export class LinguaService {
  baseUrl:string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  ping():Observable<any> {
    return this.http.get(`${this.baseUrl}ping`, {responseType: 'text'});
  }

  trainReading(trainingData:TrainingData):Observable<TrainingData> {
    console.log("---")
    console.log(trainingData)
    return this.http.post<TrainingData>(`${this.baseUrl}trainReading`, trainingData);
  }
}
