import { Injectable } from '@angular/core';
import { getRoute } from '@env';
import { HttpClient , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dto , OvicQueryCondition } from '@core/models/dto';
import { map } from 'rxjs/operators';
import { Role } from '@core/models/role';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';

@Injectable( {
	providedIn : 'root'
} )
export class RoleService {

	private readonly api = getRoute( 'roles/' );

	constructor(
		private http : HttpClient ,
		private appHttpParamsService : HttpParamsHeplerService
	) { }

	getRoleById( id : number , pluck = '' ) : Observable<Role> {
		const url     = ''.concat( this.api , id.toString() );
		const options = { params : pluck ? new HttpParams().set( 'pluck' , pluck ) : new HttpParams() };
		return this.http.get<Dto>( url , options ).pipe( map( res => res.data && res.data.length ? res.data : null ) );
	}

	filterRoles( roleId : string ) : Observable<Role[]> {
		const params = this.appHttpParamsService.paramsConditionBuilder( [ {
			conditionName : 'id' ,
			condition     : OvicQueryCondition.greaterThan ,
			value         : roleId
		} ] );
		return this.http.get<Dto>( this.api , { params } ).pipe( map( res => res.data ) );
	}

	listRoles( roleIds : string ) : Observable<Role[]> {
		const url = roleIds ? ''.concat( this.api , roleIds ) : this.api;
		return this.http.get<Dto>( url ).pipe( map( res => res.data ) );
	}

	listRolesFiltered( roleIds : string , pluck = '' ) : Observable<Role[]> {
		const url     = roleIds ? ''.concat( this.api , roleIds ) : this.api;
		const options = { params : pluck ? new HttpParams().set( 'pluck' , pluck ) : new HttpParams() };
		return this.http.get<Dto>( url , options ).pipe( map( res => res.data ) );
	}

	// getSimpleRoles( roleIds : string ) : Observable<Role[]> {
	// 	if ( roleIds ) {
	// 		return this.http.get<Dto>( this.api.concat( roleIds ) , { params : new HttpParams().set( 'pluck' , 'id,name,title,description,ucase_ids,ordering,status' ) } ).pipe(
	// 			map( res => res.data )
	// 		);
	// 	} else {
	// 		return of( [] );
	// 	}
	// }
}
