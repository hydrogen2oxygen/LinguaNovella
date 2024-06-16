import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Vocabulary, Word} from "../domains/word";

@Injectable({
  providedIn: 'root'
})
export class LinguaService {
  baseUrl:string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  ping():Observable<any> {
    return this.http.get(`${this.baseUrl}ping`, {responseType: 'text'});
  }

  trainReading(text:string, from_lang:string, to_lang:string):Observable<Vocabulary> {
    return this.http.post<Vocabulary>(`${this.baseUrl}trainReading`, {text: text, from_lang: from_lang, to_lang: to_lang});
  }
}
