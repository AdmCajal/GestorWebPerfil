import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../../../../environments/app.config";
import { DtoLote } from "../model/DtoLote";
import { FiltroLote } from "../model/FiltroLote";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})


export class ImgService {

  constructor(private http: HttpClient) {}

  getImages() {
      return this.http
          .get<any>('crudImg.json')
          .toPromise()
          .then((res) => <any[]>res.data)
          .then((data) => {
              return data;
          });
  }
}