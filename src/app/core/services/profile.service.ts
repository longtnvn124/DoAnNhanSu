import { Injectable } from '@angular/core';
import { getRoute } from '@env';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Dto } from '@core/models/dto';
import { Profile } from '@core/models/profile';
import { map } from 'rxjs/operators';

interface UpdateProfile {
	display_name? : string;
	password? : string;
	phone? : string;
	email? : string;
	avatar? : string;
}

@Injectable( {
	providedIn : 'root'
} )
export class ProfileService {

	private readonly api = getRoute( 'profile' );

	constructor( private http : HttpClient ) { }

	get() : Observable<Profile> {
		return this.http.get<Dto>( this.api ).pipe( map( res => res.data ) );
	}

	update( data : UpdateProfile ) : Observable<any> {
		return this.http.put<Dto>( this.api , data ).pipe( map( res => res.data ) );
	}
}
