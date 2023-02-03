import { Injectable } from '@angular/core';
import { OvicConditionParam } from '@core/models/dto';
import { HttpParams } from '@angular/common/http';

@Injectable( {
	providedIn : 'root'
} )
export class HttpParamsHeplerService {

	constructor() { }

	paramsConditionBuilder( conditions : OvicConditionParam[] , params : HttpParams = null ) : HttpParams {
		const initHttpParams = params || new HttpParams();
		return conditions.reduce( ( httpParams , condition , i ) => {
			const key     = 'condition[' + i + '][key]';
			const value   = 'condition[' + i + '][value]';
			const compare = 'condition[' + i + '][compare]';
			httpParams    = httpParams.append( key , condition.conditionName || '' );
			httpParams    = httpParams.append( value , condition.value || '' );
			httpParams    = httpParams.append( compare , condition.condition || '' );
			if ( condition[ 'orWhere' ] ) {
				const type = 'condition[' + i + '][type]';
				httpParams = httpParams.append( type , condition[ 'orWhere' ] );
			}
			return httpParams;
		} , initHttpParams );
	}

	paramsBuilder( params : { [ T : string ] : string | number | boolean } ) : HttpParams {
		let httpParams = new HttpParams();
		const prmNames = params ? Object.keys( params ) : [];
		if ( prmNames.length ) {
			prmNames.forEach( k => httpParams = httpParams.set( k , params[ k ] ) );
		}
		return httpParams;
	}
}
