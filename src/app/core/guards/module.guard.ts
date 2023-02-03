import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot , CanActivate , CanActivateChild , Router , RouterStateSnapshot , UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Injectable( {
	providedIn : 'root'
} )
export class ModuleGuard implements CanActivate {
	constructor(
		private auth : AuthService ,
		private router : Router
	) { }

	canActivate( route : ActivatedRouteSnapshot , state : RouterStateSnapshot ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const queryParams = { redirect : state.url };
		if ( !this.auth.isLoggedIn() ) {
			void this.router.navigate( [ '/login' ] , { queryParams } );
			return false;
		}
		if ( !this.auth.useCases || this.auth.useCases.length === 0 ) {
			void this.router.navigate( [ 'unauthorized' ] );
			return false;
		}
		return true;
	}
}
