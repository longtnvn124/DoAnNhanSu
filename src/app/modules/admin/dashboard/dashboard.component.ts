import { state , style , trigger } from '@angular/animations';
import { Component , OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationEnd , Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { HelperService } from '@core/services/helper.service';
import { NotificationService , SideNavigationMenu } from '@core/services/notification.service';
import { delay , filter , switchMap , tap } from 'rxjs/operators';
import { APP_CONFIGS } from '@env';
import { debounceTime , of , Subscription } from 'rxjs';
import { Ucase } from '@core/models/ucase';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { ThemeSettingsService } from '@core/services/theme-settings.service';
import { LangChangeEvent } from '@ngx-translate/core/lib/translate.service';

@Component( {
	selector    : 'app-dashboard' ,
	templateUrl : './dashboard.component.html' ,
	styleUrls   : [ './dashboard.component.css' ] ,
	animations  : [
		trigger( 'overlayAnimations' , [
			state( 'open' , style( {
				opacity    : 1 ,
				visibility : 'visible'
			} ) ) ,
			state( 'close' , style( {
				opacity    : 0 ,
				visibility : 'hidden'
			} ) )
		] ) ,
		trigger( 'dropdown' , [
			state( 'open' , style( {
				top        : '100%' ,
				opacity    : 1 ,
				visibility : 'visible'
			} ) ) ,
			state( 'close' , style( {
				top        : 'calc(100% + 13px)' ,
				opacity    : 0 ,
				visibility : 'hidden'
			} ) )
		] ) ,
		trigger( 'navigationMenuEffect' , [ state( 'open' , style( { right : 0 } ) ) ] )
	]
} )
@AutoUnsubscribeOnDestroy()
export class DashboardComponent implements OnInit {

	isLoading = false;

	menuCollapse = false;

	mobileMenuOpen = false;

	menuActive : MenuItem = { label : 'Bảng điều khiển' , icon : 'fi-rr-dashboard' };

	verticalMenu : MenuItem[] = [];

	subscriptions = new Subscription();

	menuSize = '300px';

	defaultNavigationOffsetTop = '60px';

	navigationOffsetTop = this.defaultNavigationOffsetTop;

	initRight = '-310px';

	sideNavigationMenuSettings : SideNavigationMenu;

	navigationMenuState : 'open' | 'close' = 'close';

	sideNavigationOffCanvasSize = '0';

	constructor(
		private helperService : HelperService ,
		private router : Router ,
		private notificationService : NotificationService ,
		private themeSettingsService : ThemeSettingsService ,
		private auth : AuthService
	) {
		const observerRouterEvents = router.events.pipe( filter( e => e instanceof NavigationEnd ) ).subscribe( ( e : NavigationEnd ) => {
			e.toString();
			const useCase   = this.auth.getUseCase( e.url.substring( 7 ).split( '?' )[ 0 ] );
			this.menuActive = useCase ? { label : useCase.title , icon : useCase.icon } : { label : 'Bảng điều khiển' , icon : 'fi-rr-dashboard' };
		} );
		this.subscriptions.add( observerRouterEvents );

		const observerChangeLanguage = this.auth.appLanguageSettings().pipe( filter( value => value !== undefined && value !== null ) ).subscribe(
			( settings ) => {
				const lang        = APP_CONFIGS.multiLanguage ? settings : null;
				this.verticalMenu = this.useCase2ToMenuItem( this.auth.useCases , lang );
			}
		);
		this.subscriptions.add( observerChangeLanguage );

		const observerOpenSideNavigation = this.notificationService.onSideNavigationMenuOpen().pipe(
			debounceTime( 100 ) ,
			switchMap( settings => {
					this.sideNavigationMenuSettings  = settings;
					this.menuSize                    = settings.size ? `${ settings.size }px` : '100%';
					this.initRight                   = '-' + ( settings.size ? `${ settings.size + 10 }px` : '110%' );
					this.navigationOffsetTop         = settings.offsetTop ? settings.offsetTop : this.defaultNavigationOffsetTop;
					this.sideNavigationOffCanvasSize = settings[ 'offCanvas' ] ? Math.max( 0 , ( settings.size + 10 ) ) + 'px' : '0';
					return of( '' );
				}
			) , delay( 50 ) ).subscribe( () => this.navigationMenuState = 'open' );
		this.subscriptions.add( observerOpenSideNavigation );

		const observerCloseSideNavigation = this.notificationService.onSideNavigationMenuClosed().pipe( debounceTime( 100 ) ).subscribe( () => {
			this.navigationMenuState         = 'close';
			this.sideNavigationOffCanvasSize = '0';
		} );
		this.subscriptions.add( observerCloseSideNavigation );
	}

	ngOnInit() : void {
		this.themeSettingsService.settingInit( this.auth.userMeta );
		this.menuCollapse = this.themeSettingsService.getSetting( 'menuCollapse' );
	}

	useCase2ToMenuItem( data : Ucase[] , lang : LangChangeEvent = null ) : MenuItem[] {
		const t                 = lang ? lang.translations.route : null;
		let result : MenuItem[] = [];
		if ( data.length ) {
			data.filter(u => u.position ==='left').forEach( node => {
				const menu = {
					label : t && t.hasOwnProperty( node.id ) ? t[ node.id ] : node.title ,
					icon  : node.icon
				};
				if ( node.child && node.child.length ) {
					menu[ 'items' ] = [];
					node.child.filter(u => u.position ==='left').forEach( nodeChild => {
						menu[ 'items' ].push( {
							label      : t && t.hasOwnProperty( nodeChild.id ) ? t[ nodeChild.id ] : nodeChild.title ,
							icon       : nodeChild.icon ,
							routerLink : nodeChild.id
						} );
					} );
				} else {
					menu[ 'routerLink' ] = node.id;
				}
				result.push( menu );
			} );
		}
		return result;
	}

	toggleMenu() {
		this.menuCollapse = !this.menuCollapse;
		this.themeSettingsService.changeThemeSettings( [ { item : 'menuCollapse' , value : this.menuCollapse } ] , false ).pipe( tap( () => this.auth.syncUserMeta() ) ).subscribe();
	}

	toggleMenuForMobile( event : Event | null ) {
		if ( event ) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}

	closePanel( name : string ) {
		this.notificationService.closeSideNavigationMenu( name );
	}
}
