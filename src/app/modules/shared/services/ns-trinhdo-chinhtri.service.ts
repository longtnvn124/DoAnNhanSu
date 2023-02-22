import { Injectable } from '@angular/core';
import { NsTrinhdoChinhtri } from '../models/ns-trinhdo';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OvicConditionParam, OvicQueryCondition, Dto } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';
import { DmTrinhdoChinhtri } from '../models/danh-muc';

@Injectable({
  providedIn: 'root'
})
export class NsTrinhdoChinhtriService {

  private readonly api = getRoute('trinhdo-chinhtri/');
  private readonly api_dm_trinhdo_chinhtri = getRoute('danhmuc-trinhdo-chinhtri/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(nhansu_id: number, filter?: { search: string }): Observable<NsTrinhdoChinhtri[]> {
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

  delete_chinhtri(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_chinhtri(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }


  add_chinhtri(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }

  getdata_danhmuc_danhhieu(): Observable<DmTrinhdoChinhtri[]> {
    return this.http.get<Dto>(this.api_dm_trinhdo_chinhtri).pipe(map(res => res.data));
  }
}
