import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Word} from "../domains/word";

@Injectable({
  providedIn: 'root'
})
export class LinguaService {
  baseUrl:string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  ping():Observable<any> {
    return this.http.get(`${this.baseUrl}ping`, {responseType: 'text'});
  }

  readText(text:string):Observable<Word[]> {
    return this.http.post<Word[]>(`${this.baseUrl}readText`, {text: text});
  }
}
