import { NsTrinhdoChuyenmon } from '../models/ns-trinhdo';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OvicConditionParam, OvicQueryCondition, Dto } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';
import { NsQuatrinhXuatngoai } from '../models/ns-quatrinh';

@Injectable({
  providedIn: 'root'
})
export class NsTrinhdoChuyenmonService {

  private readonly api = getRoute('trinhdo-chuyenmon/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(xoatngoai_id: number, filter?: { search: string }): Observable<NsTrinhdoChuyenmon[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'ma_ns',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere:'or'
        },
      ];
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));

  }

  delete_chuyenmon(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_chuyenmon(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }

  add_chuyenmon(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }
}
