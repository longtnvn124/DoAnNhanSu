import { AfterViewInit , Component , ElementRef , HostListener , OnDestroy , OnInit , ViewChild } from '@angular/core';
import { NotificationService , StateLoadingV2 } from '@core/services/notification.service';
import { debounceTime , distinctUntilChanged , Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { APP_CONFIGS } from '@env';

@Component( {
	selector    : 'app-root' ,
	templateUrl : './app.component.html' ,
	styleUrls   : [ './app.component.css' ]
} )

@AutoUnsubscribeOnDestroy()
export class AppComponent implements OnInit , AfterViewInit , OnDestroy {

	private subscription = new Subscription();

	isLoading = false;

	stateLoadingV2 : StateLoadingV2 = {
		loading : false ,
		icon    : null ,
		text    : '' ,
		process : null
	};

	@HostListener( 'window:scroll' ) handleOnWindowScroll() {
		this.notification.pushWindowScrollEvent( window.scrollY );
	}

	@HostListener( 'window:resize') onResize() {
		this.checkScreenHeight();
	}

	@ViewChild( 'checkViewPortHeight' ) checkViewPortHeight : ElementRef<HTMLElement>;

	timeOutCloseAnimation : any;

	constructor(
		private messageService : MessageService ,
		private notification : NotificationService ,
		private translate : TranslateService ,
		private http : HttpClient ,
		private primengConfig : PrimeNGConfig
	) {
		const observerOnLoading = this.notification.onAppLoading.pipe( debounceTime( 50 ) , distinctUntilChanged() ).subscribe( isLoading => this.isLoading = isLoading );
		this.subscription.add( observerOnLoading );

		const observerOnLoadingV2 = this.notification.onLoadingAnimationV2.pipe( debounceTime( 10 ) ).subscribe( state => {
			if ( state.hasOwnProperty( 'loading' ) ) {
				this.stateLoadingV2.loading = state.loading;
			}
			if ( state.hasOwnProperty( 'icon' ) ) {
				this.stateLoadingV2.icon = state.icon;
			}
			if ( state.hasOwnProperty( 'text' ) ) {
				this.stateLoadingV2.text             = state.text;
				this.stateLoadingV2[ '__html_text' ] = state.text ? state.text.split( '' ).reduce( ( html , w ) => html += '<span class="app-loading-text-animation__letter">' + w + '</span>' , '' ) : '';
			}
			if ( state.hasOwnProperty( 'process' ) ) {
				const percent = Math.min( state.process.percent , 100 );
				if ( percent === 100 ) {
					this.timeOutCloseAnimation = setTimeout( () => this.stateLoadingV2.loading = false , 500 );
				} else {
					if ( this.timeOutCloseAnimation ) {
						clearTimeout( this.timeOutCloseAnimation );
					}
				}
				this.stateLoadingV2.process = { percent };
			}
		} );
		this.subscription.add( observerOnLoadingV2 );

		const observerOnPushNotification = this.notification.onAppToastMessage.subscribe( toast => this.messageService.add( { severity : toast.type , summary : toast.head , detail : toast.body , life : 3000 } ) );
		this.subscription.add( observerOnPushNotification );

		if ( APP_CONFIGS.multiLanguage ) {
			const languages = APP_CONFIGS.languages.map( l => l.name );
			translate.addLangs( languages );
			translate.setDefaultLang( APP_CONFIGS.defaultLanguage.name );
		}

		// private activatedRoute : ActivatedRoute ,
		// private router : Router ,
		// this.__validateHashCode();
		// const browserLang = translate.getBrowserLang();
		// translate.use( browserLang.match( /en|vn/ ) ? browserLang : 'en' );
	}

	ngAfterViewInit() : void {
		this.checkScreenHeight();
	}

	ngOnInit() : void {
		this.primengConfig.ripple               = true;
		document.documentElement.style.fontSize = '14px';
	}

	// private getCsrfToken() : Observable<any> {
	// 	const options : Object = {
	// 		headers      : new HttpHeaders( { 'content-type' : 'application/json' } ) ,
	// 		responseType : 'text'
	// 	};
	// 	return this.http.get<any>( environment.s( 'csrf-token' ) , options );
	// }

	// private static isCsrfTokenValidForAtLeastTwoMoreHours() : boolean {
	// 	const token   = localStorage.getItem( CSRF_TOKEN_KEY );
	// 	const time    = localStorage.getItem( CSRF_TOKEN_EXPIRED_KEY );
	// 	const expired = time ? parseInt( time , 10 ) : null;
	// 	return !!( token && !isNaN( expired ) && ( expired > Date.now() - 7200000 ) );
	// }
	//
	// private startCsrfToken() {
	// 	this.getCsrfToken().subscribe( {
	// 		next  : token => {
	// 			if ( typeof token === 'string' ) {
	// 				localStorage.setItem( CSRF_TOKEN_KEY , token );
	// 			}
	// 		} ,
	// 		error : () => this.getCsrfToken()
	// 	} );
	//
	// 	interval( 3600000 ).pipe( map( () => AppComponent.isCsrfTokenValidForAtLeastTwoMoreHours() ) , switchMap( valid => valid ? of( '' ) : this.getCsrfToken() ) ).subscribe(
	// 		{
	// 			next  : token => {
	// 				if ( token && typeof token === 'string' ) {
	// 					localStorage.setItem( CSRF_TOKEN_KEY , token );
	// 				}
	// 			} ,
	// 			error : r => console.error( r )
	// 		}
	// 	);
	// }

	checkScreenHeight() {
		if ( this.checkViewPortHeight && this.checkViewPortHeight.nativeElement.clientHeight ) {
			const width  = this.checkViewPortHeight.nativeElement.clientWidth;
			const height = this.checkViewPortHeight.nativeElement.clientHeight;
			document.body.style.setProperty( '--max-screen-height' , height + 'px' );
			document.body.style.setProperty( '--max-screen-width' , width + 'px' );
			this.notification.setScreenSize( { height , width } );
		}
	}

	ngOnDestroy() : void {
		if ( this.subscription ) {
			this.subscription.unsubscribe();
		}
		if ( this.timeOutCloseAnimation ) {
			clearTimeout( this.timeOutCloseAnimation );
		}
	}

	/*private __validateHashCode() {
	 const parsedUrl = new URL( window.location.href );
	 if ( parsedUrl.searchParams.get( '--hash-code' ) ) {
	 const code = Number.parseInt( parsedUrl.searchParams.get( '--hash-code' ) );
	 if ( Number.isNaN( code ) || code < ( Date.now() - ( 5 * 60000 ) ) ) {
	 parsedUrl.searchParams.set( '--hash-code' , Date.now().toString() );
	 window.location.replace( parsedUrl.toString() );
	 } else {
	 this.__cleanUrlApp();
	 }
	 }
	 }

	 private __cleanUrlApp() {
	 const snapshot = this.activatedRoute.snapshot;
	 const params   = { ... snapshot.queryParams };
	 delete params[ '--hash-code' ];
	 this.router.navigate( [] , { queryParams : params } );
	 }

	 private __reloadNewVersion() {
	 const parsedUrl = new URL( window.location.href );
	 parsedUrl.searchParams.set( '--hash-code' , Date.now().toString() );
	 window.location.replace( parsedUrl.toString() );
	 }*/

}
