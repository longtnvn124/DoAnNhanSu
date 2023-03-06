import { DmChucdanh, DmChucvu, DmDantoc, DmTongiao, DmTrinhdoChinhtri, DmTrinhdoVanhoa } from './../models/danh-muc';

import { NhanSu } from './../models/nhan-su';
import { getRoute } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { HelperService } from '@core/services/helper.service';
import { Observable } from 'rxjs';
import { Dto, OvicConditionParam, OvicQueryCondition } from '@core/models/dto';
import { map } from 'rxjs/operators';
import { DmPhongban } from '../models/danh-muc';



@Injectable({
  providedIn: 'root'
})
export class NhansuService {
  private readonly api = getRoute('danhsach-nhansu/');
  private readonly api_dmtongiao = getRoute('danhmuc-tongiao/');
  private readonly api_dmdantoc = getRoute('danhmuc-dantoc/');
  private readonly api_dmphongban = getRoute('danhmuc-phongban/');
  private readonly api_dmchucvu = getRoute('danhmuc-chucvu/');
  private readonly api_dmchucdanh = getRoute('danhmuc-chucdanh/');
  private readonly api_dmtrinhdovanhoa = getRoute('danhmuc-trinhdo-vanhoa/');
  private readonly api_dmtrinhdochinhtri = getRoute('danhmuc-trinhdo-chinhtri/');


  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(filter?: { search?: string, key?: string, value?: string }): Observable<NhanSu[]> {
    const conditions: OvicConditionParam[] = [];
    let params: HttpParams = new HttpParams();
    if (filter) {
      if (filter.search) {
        conditions.push(
          {
            conditionName: 'hoten',
            condition: OvicQueryCondition.like,
            value: '%' + filter.search + '%'
          },
        );
      }

      if (filter.value && filter.key) {
        conditions.push(
          {
            conditionName: filter.key,
            condition: OvicQueryCondition.equal,
            value: filter.value,
            orWhere: 'and'
          },
        );
      }

    }
    params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));

  }

  delete_nhansu(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api + id.toString());
  }

  edit_nhansu(id: number, data: any) {
    return this.http.put<Dto>(this.api + id.toString(), data);
  }


  add_nhansu(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data);
  }


  getdata_phongban(): Observable<DmPhongban[]> {
    return this.http.get<Dto>(this.api_dmphongban).pipe(map(res => res.data));
  }
  getdata_chucdanh(): Observable<DmChucdanh[]> {
    return this.http.get<Dto>(this.api_dmchucdanh).pipe(map(res => res.data));
  }
  getdata_chucvu(): Observable<DmChucvu[]> {
    return this.http.get<Dto>(this.api_dmchucvu).pipe(map(res => res.data));
  }
  getdata_dantoc(): Observable<DmDantoc[]> {
    return this.http.get<Dto>(this.api_dmdantoc).pipe(map(res => res.data));
  }
  getdata_tongiao(): Observable<DmTongiao[]> {
    return this.http.get<Dto>(this.api_dmtongiao).pipe(map(res => res.data));
  }

  getdata_trinhdo_vanhoa(): Observable<DmTrinhdoVanhoa[]> {
    return this.http.get<Dto>(this.api_dmtrinhdovanhoa).pipe(map(res => res.data));
  }
  getdata_trinhdo_chinhtri(): Observable<DmTrinhdoChinhtri[]> {
    return this.http.get<Dto>(this.api_dmtrinhdochinhtri).pipe(map(res => res.data));
  }
}
