import { Component , OnDestroy , OnInit , ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { RoleService } from '@core/services/role.service';
import { Router } from '@angular/router';
import { BUTTON_NO , BUTTON_YES } from '@core/models/buttons';
import { NotificationService } from '@core/services/notification.service';
import { OverlayPanel } from 'primeng/overlaypanel/overlaypanel';
import { filter } from 'rxjs/operators';

@Component( {
	selector    : 'admin-user-info' ,
	templateUrl : './user-info.component.html' ,
	styleUrls   : [ './user-info.component.css' ]
} )
export class UserInfoComponent implements OnInit , OnDestroy {

	currentUser = {
		avatar  : '../../../../assets/images/a_none.jpg' ,
		email   : 'Email' ,
		name    : 'User name' ,
		display : 'User name' ,
		role    : 'user role'
	};

	userMenu = {
		profile  : 'Profile' ,
		messages : 'messages' ,
		help     : 'help' ,
		lock     : 'lock' ,
		signOut  : 'signOut'
	};

	subscriptions = new Subscription();

	// trackWindowScroll = new Subscription();

	@ViewChild( 'panel' ) panel : OverlayPanel;

	constructor(
		private auth : AuthService ,
		private roleService : RoleService ,
		private notificationService : NotificationService ,
		private router : Router
	) {
	}

	ngOnDestroy() : void {
		this.subscriptions.unsubscribe();
	}

	ngOnInit() : void {
		const observerUpdateUser$ = this.auth.onSetUpUser().subscribe( {
			next : user => {
				this.currentUser.avatar  = user.avatar;
				this.currentUser.name    = user.username;
				this.currentUser.display = user.display_name;
				this.currentUser.email   = user.email;
			}
		} );

		const changeLanguage$ = this.auth.appLanguageSettings().pipe( filter( value => value !== undefined && value !== null ) ).subscribe(
			{
				next : ( settings ) => {
					this.userMenu.profile  = settings.translations.systems.profile;
					this.userMenu.messages = settings.translations.systems.messages;
					this.userMenu.help     = settings.translations.systems.help;
					this.userMenu.lock     = settings.translations.systems.lock;
					this.userMenu.signOut  = settings.translations.systems.logout;
				}
			}
		);

		this.subscriptions.add( changeLanguage$ );
		this.subscriptions.add( observerUpdateUser$ );
	}

	async signOut() {
		this.notificationService.isProcessing( true );
		await this.auth.logout();
		this.router.navigate( [ 'login' ] ).then( () => this.notificationService.isProcessing( false ) , () => this.notificationService.isProcessing( false ) );
	}

	async confirmSignOut( panel : OverlayPanel ) {
		panel.hide();
		const headText = this.auth.userLanguage.translations.dashboard.confirm_logout;
		const question = this.auth.userLanguage.translations.dashboard.confirm_logout_mess;
		const confirm  = await this.notificationService.confirmRounded( `<p class="text-danger">${ question }</p>` , headText , [ BUTTON_NO , BUTTON_YES ] );
		if ( confirm && confirm.name && confirm.name === BUTTON_YES.name ) {
			await this.signOut();
		}
	}

	routeLink( panel : OverlayPanel , router : string ) {
		panel.hide();
		this.router.navigateByUrl( router ).then( () => null );
	}
}
