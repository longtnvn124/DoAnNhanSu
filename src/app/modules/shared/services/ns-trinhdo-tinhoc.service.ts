import { Injectable } from '@angular/core';
import { NsTrinhdoTinhoc } from '../models/ns-trinhdo';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OvicConditionParam, OvicQueryCondition, Dto } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NsTrinhdoTinhocService {

  private readonly api = getRoute('trinhdo-tinhoc/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(nhansu_id: number, filter?: { search: string }): Observable<NsTrinhdoTinhoc[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'ma_ns',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere:'or'
        },
      ]
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));

  }

  add_tinhoc(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }
  delete_tinhoc(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_tinhoc(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }



}
