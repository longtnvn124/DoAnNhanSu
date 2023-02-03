
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { getRoute } from '@env';
import { map } from 'rxjs/operators';
import { NsQuatrinhXuatngoai } from '../models/ns-quatrinh';


@Injectable({
  providedIn: 'root'
})
export class NgQuatrinhXoatngoaiService {
  private readonly api = getRoute('quatrinh-xuatngoai/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(xoatngoai_id: number, filter?: { search: string }): Observable<NsQuatrinhXuatngoai[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'ma_ns',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%'
        },
      ];
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));

  }

  delete_xuatngoai(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_xuatngoai(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }

  add_xuatngoai(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }

}


