import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TrainingData} from "../domains/TrainingData";
import {Phrase} from "../domains/Phrase";

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
    return this.http.post<TrainingData>(`${this.baseUrl}trainReading`, trainingData);
  }

  saveTrainingProgress(trainingData:TrainingData):Observable<TrainingData> {
    return this.http.put<TrainingData>(`${this.baseUrl}saveTrainingProgress`, trainingData);
  }

  getAllPhrases(from_lang:string, to_lang:string):Observable<Phrase[]> {
    return this.http.get<Phrase[]>(`${this.baseUrl}phrase?from_lang=${from_lang}&to_lang=${to_lang}`);
  }
}
