import { Injectable } from '@angular/core';
import { getRoute } from '@env';
import { HttpClient , HttpParams } from '@angular/common/http';
import { HttpParamsHeplerService } from '@core/services/http-params-hepler.service';
import { HelperService } from '@core/services/helper.service';
import { ThemeSettingsService } from '@core/services/theme-settings.service';
import { Observable } from 'rxjs';
import { Dto , OvicConditionParam , OvicQueryCondition } from '@core/models/dto';
import { map } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { DonVi } from '@shared/models/danh-muc';

@Injectable( {
	providedIn : 'root'
} )
export class DonViService {

	// private readonly api = getRoute( 'dm-donvi/' );

	private readonly api = getRoute( 'donvi/' );

	constructor(
		private http : HttpClient ,
		private httpParamsHelper : HttpParamsHeplerService ,
		private helperService : HelperService ,
		private themeSettingsService : ThemeSettingsService ,
		private auth : AuthService
	) { }

	createDonVi( data : any ) : Observable<number> {
		return this.http.post<Dto>( this.api , data ).pipe( map( res => res.data ) );
	}

	updateDonVi( id : number , data : any ) : Observable<any> {
		return this.http.put<Dto>( ''.concat( this.api , id.toString( 10 ) ) , data );
	}

	deleteDonVi( id : number ) : Observable<any> {
		const is_deleted = 1;
		const deleted_by = this.auth.user.id;
		return this.updateDonVi( id , { is_deleted , deleted_by } );
	}

	getParentList() : Observable<{ id : number, title : string, status : number }[]> {
		const fromObject = {
			orderby : 'title' ,
			order   : 'ASC' ,
			pluck   : 'id,title,status' ,
			limit   : '-1'
		};
		const params     = new HttpParams( { fromObject } );
		return this.http.get<Dto>( this.api , { params } ).pipe( map( res => res.data ) );
	}

	getDanhSachDonVi( paged : number , itemPerPage : number = null , hierarchy = 1 ) : Observable<{ recordsTotal : number, data : DonVi[] }> {
		const fromObject = {
			hierarchy : hierarchy ,
			paged     : paged ,
			limit     : itemPerPage || this.themeSettingsService.settings.rows ,
			orderby   : 'title' ,
			order     : 'ASC'
		};
		const params     = new HttpParams( { fromObject } );
		return this.http.get<Dto>( this.api , { params } ).pipe( map( res => ( { recordsTotal : res.recordsFiltered , data : this._preSetData( res.data ) } ) ) );
	}

	private _preSetData( data : DonVi[] ) : DonVi[] {
		return data && data.length ? data.map( d => {
			d[ '__status' ] = d.status === 0 ? '<span class="badge badge--size-normal badge-danger w-100">Inactive</span>' : '<span class="badge badge--size-normal badge-success w-100">Active</span>';
			return d;
		} ) : [];
	}

	getDonViByIds( ids : string , pluck : string = null ) : Observable<DonVi[]> {
		const fromObject = { orderby : 'title' , order : 'ASC' };
		if ( pluck ) {
			fromObject[ 'pluck' ] = pluck;
		}
		const params = new HttpParams( { fromObject } );
		return this.http.get<Dto>( ''.concat( this.api , ids ) , { params } ).pipe( map( res => res.data ) );
	}


	getDsDonVi() : Observable<any> {
		const fromObject = {
			limit   : -1 ,
			pluck   : 'description,id,status,title' ,
			orderby : 'id' ,
			order   : 'ASC'
		};
		const params     = new HttpParams( { fromObject } );
		return this.http.get<Dto>( this.api , { params } ).pipe( map( res => res.data ) );
	}
}
