import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OvicConditionParam, OvicQueryCondition, Dto } from '@core/models/dto';
import { HelperService } from '@core/services/helper.service';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { getRoute } from '@env';
import { Observable, map } from 'rxjs';
import { HoSoHocTap, KeHoacHocTapBoiTuong } from '../models/hoctap-boiduong';
import { DmPhongban } from '../models/danh-muc';

@Injectable({
  providedIn: 'root'
})
export class HtBdDanhsachService {

  private readonly api = getRoute('danhsach-hoctap-boiduong/');
  private readonly api_dmphongban = getRoute('danhmuc-phongban/');

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private httpParamsHeplerService: HttpParamsHeplerService
  ) { }


  list(vanhoa_id: number, filter?: { search: string }): Observable<HoSoHocTap[]> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      const conditions: OvicConditionParam[] = [
        {
          conditionName: 'ma_kehoach',
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

  getdata_phongban(): Observable<DmPhongban[]> {
    return this.http.get<Dto>(this.api_dmphongban).pipe(map(res => res.data));
  }
}
