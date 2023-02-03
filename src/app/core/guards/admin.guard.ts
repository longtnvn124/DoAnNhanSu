import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot , CanActivate , CanActivateChild , Router , RouterStateSnapshot , UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Injectable( {
	providedIn : 'root'
} )
export class AdminGuard implements CanActivateChild {
	constructor(
		private auth : AuthService ,
		private router : Router
	) { }

	canActivateChild( childRoute : ActivatedRouteSnapshot , state : RouterStateSnapshot ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const routeActive = state.url.replace( '/admin/' , '' ).split( '?' )[ 0 ];
		// if ( routeActive !== 'content-none' && !this.auth.userPermissions.reduce( ( find , a ) => find || a.route === routeActive , false ) ) {
		if ( routeActive !== 'content-none' && !this.auth.userCanAccess( routeActive ) ) {
			void this.router.navigate( [ '/admin/content-none' ] );
			return false;
		}
		return true;
	}
}
