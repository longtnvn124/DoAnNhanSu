import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { HelperService } from '@core/services/helper.service';
import { getRoute } from '@env';
import { Observable } from 'rxjs';
import { HoSo } from '@shared/models/ho-so';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoSoService {

  private readonly api = getRoute('ho-so/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(donvi_id: number, filter?: { search: string }): Observable<HoSo[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'ten',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%'
        },
        {
          conditionName: 'loai_khen',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        }
      ];
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit(id: number, data: any) {
    return this.http.post<Dto>(this.api, data);
  }

  add(data: HoSo): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }

}

