
import { NhanSu } from './../models/nhan-su';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OvicConditionParam, OvicQueryCondition, Dto } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { CheDo_NghiPhep } from '../models/nghi-chedo';

@Injectable({
  providedIn: 'root'
})
export class CdNghiphepService {

  private readonly api = getRoute('chedo-nghiphep/');
  private readonly api_nhansu = getRoute('danhsach-nhansu/');


  constructor(
    private http: HttpClient,
    private httpParamsHeplerService: HttpParamsHeplerService) { }

  list(filter?: { search?: string }): Observable<CheDo_NghiPhep[]> {

    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: "ma_ns",
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        }

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
