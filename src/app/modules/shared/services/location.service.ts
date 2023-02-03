import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { Dto , OvicQueryCondition } from '@core/models/dto';
import { getRoute } from '@env';
import { Observable } from 'rxjs';
import { DiaDanh } from '@shared/models/location';
import { map } from 'rxjs/operators';

@Injectable( {
	providedIn : 'root'
} )
export class LocationService {

	constructor(
		private http : HttpClient ,
		private httpParamsHelper : HttpParamsHeplerService
	) { }

/*	getProvinceById( id : number ) : Observable<DiaDanh> {
		return this.http.get<Dto>( getRoute( 'cities/' ) + id.toString( 10 ) ).pipe( map( res => res.data[0] ) );
	}*/

	listProvinces() : Observable<DiaDanh[]> {
		return this._getChildByParentId( null , getRoute( 'cities/' ) );
	}

	listDistrictByProvinceId( provinceId : number ) : Observable<DiaDanh[]> {
		return this._getChildByParentId( provinceId , getRoute( 'districts/' ) );
	}

	listWardsByDistrictId( provinceId : number ) : Observable<DiaDanh[]> {
		return this._getChildByParentId( provinceId , getRoute( 'wards/' ) );
	}

	private _getChildByParentId( parent_id = 0 , api : string ) : Observable<DiaDanh[]> {
		const fromObject = {
			limit   : -1 ,
			orderby : 'name' ,
			order   : 'ASC'
		};
		const params     = parent_id ? this.httpParamsHelper.paramsConditionBuilder( [ {
			conditionName : 'parent_id' ,
			condition     : OvicQueryCondition.equal ,
			value         : parent_id.toString( 10 )
		} ] , new HttpParams( { fromObject } ) ) : new HttpParams( { fromObject } );
		return this.http.get<Dto>( api , { params } ).pipe( map( res => res.data ) );
	}
}
