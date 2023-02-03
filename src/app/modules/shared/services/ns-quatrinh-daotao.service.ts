import { getRoute } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { HelperService } from '@core/services/helper.service';

import { Observable } from 'rxjs';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { map } from 'rxjs/operators';
import { NsQuaTrinhDaoTao } from '../models/ns-quatrinh';

@Injectable({
  providedIn: 'root'
})
export class NsQuatrinhDaotaoService {

  private readonly api = getRoute('quatrinh-daotao/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(danhhieu_id: number, filter?: { search: string }): Observable<NsQuaTrinhDaoTao[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'ma_ns',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },
      ]
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }

  delete_daotao(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_daotao(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }


  add_daotao(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }

}
