import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIGS } from '@env';
import { delay , map } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { of , Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';

@Component( {
	selector    : 'app-unauthorized' ,
	templateUrl : './unauthorized.component.html' ,
	styleUrls   : [ './unauthorized.component.css' ]
} )
@AutoUnsubscribeOnDestroy()
export class UnauthorizedComponent implements OnInit {

	unauthorized = '';

	textButtonLogout = '';

	textLogoutFail = '';

	showLogoutButton = false;

	subscriptions = new Subscription();

	constructor(
		private translate : TranslateService ,
		private router : Router ,
		private notificationService : NotificationService ,
		private auth : AuthService
	) { }

	ngOnInit() : void {
		const translate         = this.translate.getTranslation( APP_CONFIGS.defaultLanguage.name ).pipe( map( t => t[ 'systems' ] ) ).subscribe(
			{
				next : transitions => {
					this.unauthorized     = transitions[ 'unauthorized' ];
					this.textButtonLogout = transitions[ 'logout' ];
					this.textLogoutFail   = transitions[ 'logoutFail' ];
				}
			}
		);
		const checkUserIsLogged = of( true ).pipe( delay( 1000 ) ).subscribe( { next : () => this.showLogoutButton = this.auth.isLoggedIn() } );
		this.subscriptions.add( translate );
		this.subscriptions.add( checkUserIsLogged );
	}

	async logout() {
		const logoutSuccess = await this.auth.logout();
		if ( logoutSuccess ) {
			await this.router.navigate( [ '/login' ] );
		} else {
			this.notificationService.toastError( this.textLogoutFail );
		}
	}
}
