import { DmChucdanh, DmChucvu, DmDantoc, DmTongiao } from './../models/danh-muc';

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


  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }

  list(nhansu_id: number, filter?: { search: string }): Observable<NhanSu[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'hoten',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere:'or'
        },
        {
          conditionName: 'ma_ns',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },
        {
          conditionName: 'phongban',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },
        {
          conditionName: 'chucvu',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },
        {
          conditionName: 'chucdanh',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },
        {
          conditionName: 'dantoc',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },
        {
          conditionName: 'tongiao',
          condition: OvicQueryCondition.like,
          value: '%' + filter.search + '%',
          orWhere: 'or'
        },

      ]
      params = this.httpParamsHeplerService.paramsConditionBuilder(conditions);
    }
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
}
