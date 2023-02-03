import { HttpClient, HttpParams } from '@angular/common/http';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';
import { NsTrinhdoNgoaingu } from '../models/ns-trinhdo';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NsTrinhdoNgoainguService {

  private readonly api = getRoute('trinhdo-ngoaingu/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(nhansu_id: number, filter?: { search: string }): Observable<NsTrinhdoNgoaingu[]> {
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
  add_ngoaingu(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }
  edit_ngoaingu(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }
  delete_ngoaingu(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }




}
