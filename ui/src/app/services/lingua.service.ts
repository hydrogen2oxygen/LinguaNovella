import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LinguaService {
  baseUrl:string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  ping():Observable<any> {
    return this.http.get(`${this.baseUrl}ping`, {responseType: 'text'});
  }
}
