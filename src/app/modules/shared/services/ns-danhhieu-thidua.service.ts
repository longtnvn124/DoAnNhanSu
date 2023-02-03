
import { getRoute } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { HelperService } from '@core/services/helper.service';

import { Observable } from 'rxjs';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { map } from 'rxjs/operators';
import { NsDanhhieuThidua } from '../models/ns-quatrinh';

@Injectable({
  providedIn: 'root'
})
export class NsDanhhieuThiduaService {
  private readonly api = getRoute('danhhieu-thidua/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(danhhieu_id: number, filter?: { search: string }): Observable<NsDanhhieuThidua[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: "ten_danhhieu",
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%'
        },
        {
          conditionName: "ma_ns",
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere:'or'
        },
      ]
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }

  delete_danhhieu(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_danhhieu(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }


  add_danhhieu(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }
}
