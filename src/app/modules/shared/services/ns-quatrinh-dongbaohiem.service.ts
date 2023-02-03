import { NsQuatrinhDongbaohiem } from './../models/ns-quatrinh';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NsQuatrinhDongbaohiemService {
  private readonly api = getRoute('quatrinh-dongbaohiem/');

  constructor(private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(danhhieu_id: number, filter?: { search: string }): Observable<NsQuatrinhDongbaohiem[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
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


  delete_baohiem(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_baohiem(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }


  add_baohiem(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }
}
