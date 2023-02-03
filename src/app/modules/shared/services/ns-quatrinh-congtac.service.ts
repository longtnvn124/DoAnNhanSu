
import { getRoute } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { HelperService } from '@core/services/helper.service';
import { Observable } from 'rxjs';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { map } from 'rxjs/operators';
import { NsQuatrinhCongtac } from '../models/ns-quatrinh';

@Injectable({
  providedIn: 'root'
})
export class NsQuatrinhCongtacService {
  private readonly api = getRoute('quatrinh-congtac/');
  constructor(private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService) { }

  list(congtac_id: number, filter?: { search: string }): Observable<NsQuatrinhCongtac[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'noi_congtac',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%'
        },
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

  delete_congtac(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_congtac(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }


  add_congtac(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }
}
