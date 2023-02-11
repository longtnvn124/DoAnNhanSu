import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OvicConditionParam, OvicQueryCondition, Dto } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';

import { NhanSu } from '../models/nhan-su';
import { CheDo_NghiViec } from '../models/nghi-chedo';

@Injectable({
  providedIn: 'root'
})
export class CdNghiviecService {

  private readonly api = getRoute('chedo-nghiviec/');
  private readonly api_nhansu = getRoute('danhsach-nhansu/');


  constructor(private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService) { }

  list( filter?: { search: string }): Observable<CheDo_NghiViec[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: "ma_ns",
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%'
        },

      ]
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

  getdata_nhansu(): Observable<NhanSu[]> {
    return this.http.get<Dto>(this.api_nhansu).pipe(map(res => res.data));
  }
}
