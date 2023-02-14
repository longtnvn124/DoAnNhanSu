import { HttpClient, HttpParams } from '@angular/common/http';
import { OvicConditionParam, OvicQueryCondition, Dto } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';
import { DanhSachQuyHoach } from './../models/quy-hoach';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QhDanhsachService {

  private readonly api = getRoute('danhsach-quyhoach/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }


  list(vanhoa_id: number, filter?: { search: string }): Observable<DanhSachQuyHoach[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'nhiem_ky',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },
        {
          conditionName: 'ma_quyhoach',
          condition: OvicQueryCondition.equal,
          value: filter.search,
          orWhere: 'or'
        },
      ];
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));

  }

  delete(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }


  add(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }
}
