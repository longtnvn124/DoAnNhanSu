import { Injectable } from '@angular/core';
import { UserSignIn , GoogleSignIn , Auth , Permission , Token } from '@core/models/auth';
import { of , Observable , distinctUntilChanged , debounceTime , switchMap , forkJoin , BehaviorSubject , mergeMap , lastValueFrom , Subject } from 'rxjs';
import { catchError , filter , map , tap } from 'rxjs/operators';
import { APP_STORES , UCASE_KEY , ROLES_KEY , ENCRYPT_KEY , USER_KEY , EXPIRED_KEY , META_KEY , APP_CONFIGS , ACCESS_TOKEN , REFRESH_TOKEN , getRoute , SWITCH_DONVI_ID } from '@env';
import { User , UserMeta } from '@core/models/user';
import { Ucase , UcaseAdvance } from '@core/models/ucase';
import { UserService } from '@core/services/user.service';
import * as CryptoJS from 'crypto-js';
import { TranslateService } from '@ngx-translate/core';
import { LangChangeEvent } from '@ngx-translate/core/lib/translate.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Dto } from '@core/models/dto';

interface AppChangeLangEvent {
	lang : string;
	updateMetaData : boolean;
}

@Injectable( {
	providedIn : 'root'
} )
export class AuthService {

	private jwtHelper = new JwtHelperService();

	private _user : User;

	private _userMeta : UserMeta[];

	private auth : Auth;

	private _languageSettings : LangChangeEvent;

	private appLanguage$ = new BehaviorSubject<LangChangeEvent>( null );

	private triggerChangeLanguages$ = new Subject<AppChangeLangEvent>();

	private onSetUser$ = new BehaviorSubject<User>( null );

	private onSignIn$ = new BehaviorSubject<string>( null );

	private onSignOut$ = new BehaviorSubject<string>( null );

	private _roles : string[] = [];

	private _useCases : Ucase[] = [];

	private _mapPms = new Map<string , UcaseAdvance>();

	private _options : {};

	constructor(
		private http : HttpClient ,
		private userService : UserService ,
		private translate : TranslateService
	) {
		this.translate.onLangChange.asObservable().pipe( distinctUntilChanged() ).subscribe( settings => this.setLanguageSettings( settings ) );
		this.triggerChangeLanguages$.asObservable().pipe( filter( value => value !== undefined && value !== null ) , debounceTime( 100 ) , mergeMap( lang => this.updateUserMetaLanguage( lang ) ) ).subscribe( lang => this.translate.use( lang ) );
		// load stored data
		this.loadStoredUserLanguage();
		this.loadStoredUseCases();
		this.loadStoredRoles();
		this.loadStoredUser();
		this.loadStoredUserMeta();

		if ( this.isLoggedIn() ) {
			this.onSignIn$.next( this.accessToken );
		}
	}

	login( user : UserSignIn ) : Observable<boolean> {
		return this.http.post<Auth>( getRoute( 'login' ) , user ).pipe(
			switchMap( auth => this.startSession( auth ) ) ,
			catchError( () => of( false ) )
		);
	}

	googleLogin( signIn : GoogleSignIn ) : Observable<boolean> {
		return this.http.post<Auth>( getRoute( 'login-google' ) , signIn ).pipe(
			switchMap( auth => this.startSession( auth ) ) ,
			catchError( () => of( false ) )
		);
	}

	async logout() : Promise<boolean> {
		try {
			await lastValueFrom( this.http.post<any>( getRoute( 'logout' ) , null ) );
			this.removeSession();
			return Promise.resolve( true );
		} catch {
			this.removeSession();
			return Promise.resolve( false );
		}
	}

	isLoggedIn() {
		let isLoggedIn : boolean;
		if ( this.refreshToken ) {
			// isLoggedIn = this.accessToken && !this.jwtHelper.isTokenExpired( this.accessToken );
			isLoggedIn = !!( this.accessToken );
		} else {
			const time    = localStorage.getItem( EXPIRED_KEY );
			const expired = time ? new Date( time ) : new Date();
			isLoggedIn    = expired && expired > new Date();
		}
		return isLoggedIn;
	}

	get accessToken() : string {
		return localStorage.getItem( ACCESS_TOKEN );
	}

	set accessToken( token : string ) {
		localStorage.setItem( ACCESS_TOKEN , token );
	}

	get refreshToken() : string {
		return localStorage.getItem( REFRESH_TOKEN );
	}

	set refreshToken( token : string ) {
		localStorage.setItem( REFRESH_TOKEN , token );
	}

	get refreshTokenActor() {
		return this.http.post<{ data : string }>( getRoute( 'refresh-token' ) , { 'refresh_token' : this.refreshToken } ).pipe( tap( ( { data } ) => this.accessToken = data ) );
	}

	private startSession( info : Auth | Token ) : Observable<boolean> {
		let userInfo$ : Observable<User>;
		// if ( info.hasOwnProperty( 'access_token' ) ) {
		if ( 'access_token' in info ) {
			userInfo$ = this.saveToken( info as Token );
			this.onSignIn$.next( info[ 'access_token' ] );
		} else {
			userInfo$ = this.saveAuth( info as Auth );
			this.onSignIn$.next( info[ 'session_id' ] );
		}
		const loadUserMeta$ : Observable<UserMeta[]>        = this.userService.getUserMeta();
		const loadUserPermissions$ : Observable<Permission> = this.http.get<Permission>( getRoute( 'permission' ) );
		return forkJoin<[ User , UserMeta[] , Permission ]>( [ userInfo$ , loadUserMeta$ , loadUserPermissions$ ] ).pipe( tap( ( [ user , meta , { data } ] ) => {
			this.updateUser( user );
			// const menu = menus.map( o => {
			// 	if ( o.id === 'he-thong' ) {
			// 		o.child = o.child.filter( i => i.id !== 'he-thong/quan-ly-nhom-quyen' );
			// 	}
			// 	return o;
			// } );

			// const a = [
			// 	{
			// 		id       : 'dashboard' ,
			// 		title    : 'Dashboard' ,
			// 		icon     : 'fa fa-tachometer' ,
			// 		position : 'left',
			// 		hide     : false ,
			// 	} ,
			// 	{
			// 		id       : 'he-thong' ,
			// 		title    : 'Hệ thống' ,
			// 		icon     : 'fa fa-cogs' ,
			// 		position : 'left' ,
			// 		hide     : false ,
			// 		child    : [
			// 			{
			// 				id       : 'he-thong/thong-tin-tai-khoan' ,
			// 				title    : 'Thông tin tài khoản' ,
			// 				icon     : 'fa fa-key' ,
			// 				hide     : false ,
			// 				position : 'left'
			// 			} ,
			// 			{
			// 				id       : 'he-thong/quan-ly-nhom-quyen' ,
			// 				title    : 'Quản lý nhóm quyền' ,
			// 				icon     : 'fa fa-users' ,
			// 				hide     : false ,
			// 				position : 'left'
			// 			} ,
			// 			{
			// 				id       : 'he-thong/quan-ly-tai-khoan' ,
			// 				title    : 'Quản lý tài khoản' ,
			// 				icon     : 'fa fa-wrench' ,
			// 				hide     : false ,
			// 				position : 'left'
			// 			} ,
			// 			{
			// 				id       : 'he-thong/thong-tin-he-thong' ,
			// 				title    : 'Thông tin hệ thống' ,
			// 				icon     : 'fa fa-user-circle-o' ,
			// 				hide     : false ,
			// 				position : 'left'
			// 			}
			// 		]
			// 	} ,
			// 	{
			// 		id       : 'message' ,
			// 		title    : 'Tin nhắn' ,
			// 		icon     : 'fa fa-comments-o' ,
			// 		position : 'left' ,
			// 		hide     : false ,
			// 		child    : [
			// 			{
			// 				id       : 'message/notifications' ,
			// 				title    : 'Thông báo' ,
			// 				icon     : 'fa fa-bell-o' ,
			// 				hide     : false ,
			// 				position : 'left'
			// 			} ,
			// 			{
			// 				id       : 'message/notification-details' ,
			// 				title    : 'Chi tiết Thông báo' ,
			// 				icon     : 'fa fa-bell-o' ,
			// 				hide     : true ,
			// 				position : 'left'
			// 			} ,
			// 			{
			// 				id       : 'message/chat' ,
			// 				title    : 'Trò chuyện' ,
			// 				icon     : 'fa fa-commenting-o' ,
			// 				hide     : false ,
			// 				position : 'left'
			// 			}
			// 		]
			// 	}
			// ];
			//
			// const defaultFeature = {
			// 	id       : 'message' ,
			// 	title    : 'Tin nhắn' ,
			// 	icon     : 'fa fa-comments-o' ,
			// 	position : 'left' ,
			// 	pms      : [ 1 , 1 , 1 , 1 ] ,
			// 	child    : [
			// 		{
			// 			id       : 'message/notifications' ,
			// 			title    : 'Thông báo' ,
			// 			icon     : 'fa fa-bell-o' ,
			// 			position : 'left' ,
			// 			pms      : [ 1 , 1 , 1 , 1 ]
			// 		} ,
			// 		{
			// 			id       : 'message/chat' ,
			// 			title    : 'Trò chuyện' ,
			// 			icon     : 'fa fa-commenting-o' ,
			// 			position : 'left' ,
			// 			pms      : [ 1 , 1 , 1 , 1 ]
			// 		}
			// 	]
			// };
			// menu.push( defaultFeature );

			if ( APP_CONFIGS.multiLanguage ) {
				const metaLang = meta.find( m => m.meta_key === APP_CONFIGS.metaKeyLanguage );
				const lang     = metaLang ? metaLang.meta_value : APP_CONFIGS.defaultLanguage.name;
				this.storeUserLanguage( lang , false );
			} else {
				this.storeUserLanguage( APP_CONFIGS.defaultLanguage.name , false );
			}
			this.setUserMeta( meta );
			this.storeRoles( data.roles );
			this.storeUseCases( data.menus );
		} ) , map( () => true ) );
	}

	syncUserMeta() {
		this.userService.getUserMeta().subscribe( meta => this.setUserMeta( meta ) );
	}

	updateUserMeta( data : UserMeta ) : Observable<UserMeta[]> {
		return this.userService.updateMeta( data ).pipe( switchMap( () => this.userService.getUserMeta() ) , tap( meta => this.setUserMeta( meta ) ) );
	}

	removeSession() {
		this.onSignOut$.next( 'removeSession' );
		this.auth      = null;
		this.user      = null;
		this._roles    = [];
		this._useCases = [];
		this._mapPms.clear();
		localStorage.removeItem( USER_KEY );
		localStorage.removeItem( EXPIRED_KEY );
		localStorage.removeItem( UCASE_KEY );
		localStorage.removeItem( ROLES_KEY );
		localStorage.removeItem( META_KEY );
		localStorage.removeItem( ACCESS_TOKEN );
		localStorage.removeItem( REFRESH_TOKEN );
	}

	forgetPassword( email : string ) : Observable<any> {
		const home_url = location.protocol + '//' + location.host;
		const callback = location.protocol + '//' + location.host + '/reset-password';
		return this.http.post( getRoute( 'forget-password' ) , { to : email , callback , home_url } );
	}

	get user() : User {
		return this._user;
	}

	set user( user : User ) {
		this._user = JSON.parse( JSON.stringify( user ) );
		if ( user ) {
			const none        = new Date().valueOf();
			this._user.avatar = user.avatar ? [ user.avatar , '?v=' , none.toString() ].join( '' ) : '../../assets/images/a_none.jpg';
			this.onSetUser$.next( this._user );
		}
	}

	updateUser( user : User ) {
		this.user     = user;
		const encrypt = this.encryptData( JSON.stringify( user ) );
		localStorage.setItem( USER_KEY , encrypt );
	}

	onSetUpUser() : Observable<User> {
		return this.onSetUser$;
	}

	private saveToken( token : Token ) : Observable<User> {
		// this.updateUser( auth.user );
		// const { data } : { data : User } = this.jwtHelper.decodeToken( token.access_token );
		const { user_id } : { exp : number; iat : number; session_id : string; user_id : number; } = this.jwtHelper.decodeToken( token.access_token );

		// this.updateUser( extracted.data );
		this.accessToken  = token.access_token;
		this.refreshToken = token.refresh_token;
		localStorage.removeItem( EXPIRED_KEY );
		return this.http.get<Dto>( getRoute( 'profile' ) ).pipe( map( res => Array.isArray( res.data ) ? res.data[ 0 ] : res.data ) );
	}

	private saveAuth( auth : Auth ) : Observable<User> {
		// this.updateUser( auth.user );
		localStorage.setItem( ACCESS_TOKEN , auth.session_id );
		localStorage.setItem( EXPIRED_KEY , auth.expires );
		localStorage.removeItem( REFRESH_TOKEN );
		return of( auth.data );
	}

	private loadStoredUser() {
		const u       = localStorage.getItem( USER_KEY );
		const decrypt = u ? this.decryptData( u ) : null;
		this.user     = decrypt ? JSON.parse( decrypt ) : null;
	}

	private storeRoles( roles : string[] ) {
		this._roles   = roles;
		const _data   = ( roles && roles.length ) ? roles : [];
		const encrypt = this.encryptData( JSON.stringify( _data ) );
		localStorage.setItem( ROLES_KEY , encrypt );
	}

	get roles() : string[] {
		return this._roles;
	}

	private loadStoredRoles() {
		const stored  = localStorage.getItem( ROLES_KEY );
		const decrypt = stored ? this.decryptData( stored ) : '';
		this._roles   = decrypt ? JSON.parse( decrypt ) : [];
	}

	private storeUseCases( useCases : Ucase[] ) {
		this.setUseCases( useCases );
		const _data   = ( useCases && useCases.length ) ? useCases : [];
		const encrypt = this.encryptData( JSON.stringify( _data ) );
		localStorage.setItem( UCASE_KEY , encrypt );
	}

	get useCases() : Ucase[] {
		return this._useCases;
	}

	private setUseCases( useCases : Ucase[] ) {
		this._useCases = useCases;
		this._mapPms.clear();
		useCases.forEach( node => {
			this._mapPms.set( node.id , {
				id        : node.id ,
				icon      : node.icon ,
				title     : node.title ,
				position  : node.position ,
				pms       : node.pms ,
				canAccess : !!( node.pms[ 0 ] ) ,
				canAdd    : !!( node.pms[ 1 ] ) ,
				canEdit   : !!( node.pms[ 2 ] ) ,
				canDelete : !!( node.pms[ 3 ] )
			} );
			if ( node.child && node.child.length ) {
				node.child.forEach( child => this._mapPms.set( child.id , {
					id        : child.id ,
					icon      : child.icon ,
					title     : child.title ,
					position  : child.position ,
					pms       : child.pms ,
					canAccess : !!( child.pms[ 0 ] ) ,
					canAdd    : !!( child.pms[ 1 ] ) ,
					canEdit   : !!( child.pms[ 2 ] ) ,
					canDelete : !!( child.pms[ 3 ] )
				} ) );
			}
		} );
	}

	private loadStoredUseCases() {
		const stored  = localStorage.getItem( UCASE_KEY );
		const decrypt = stored ? this.decryptData( stored ) : '';
		this.setUseCases( decrypt ? JSON.parse( decrypt ) : [] );
	}

	userCanAccess( route : string ) : boolean {
		if ( this._mapPms.size === 0 || !this._mapPms.has( route ) ) {
			return false;
		}
		return this._mapPms.get( route ).canAccess;
	}

	userCanAdd( route : string ) : boolean {
		if ( this._mapPms.size === 0 || !this._mapPms.has( route ) ) {
			return false;
		}
		return this._mapPms.get( route ).canAdd;
	}

	userCanEdit( route : string ) : boolean {
		if ( this._mapPms.size === 0 || !this._mapPms.has( route ) ) {
			return false;
		}
		return this._mapPms.get( route ).canEdit;
	}

	userCanDelete( route : string ) : boolean {
		if ( this._mapPms.size === 0 || !this._mapPms.has( route ) ) {
			return false;
		}
		return this._mapPms.get( route ).canDelete;
	}

	getUseCase( route : string ) : Ucase {
		return this._mapPms.get( route );
	}

	userHasRole( roleName : string ) : boolean {
		return -1 !== this._roles.findIndex( r => roleName === r );
	}

	get userLanguage() : LangChangeEvent {
		return this._languageSettings;
	}

	appLanguageSettings() : Observable<LangChangeEvent> {
		return this.appLanguage$.asObservable();
	}

	setLanguageSettings( settings : LangChangeEvent ) {
		this._languageSettings = settings;
		this.appLanguage$.next( settings );
	}

	changeUserLanguage( lang : string ) {
		this.storeUserLanguage( lang , true );
	}

	storeUserLanguage( lang : string , updateMetaData = false ) {
		// localStorage.setItem( 'lang' , lang );
		this.triggerChangeLanguages$.next( { lang , updateMetaData } );
	}

	loadStoredUserLanguage() {
		let stored = APP_CONFIGS.multiLanguage ? localStorage.getItem( 'lang' ) : APP_CONFIGS.defaultLanguage.name;
		this.triggerChangeLanguages$.next( {
			lang           : stored || APP_CONFIGS.defaultLanguage.name ,
			updateMetaData : false
		} );
	}

	get userMeta() : UserMeta[] {
		return this._userMeta;
	}

	setUserMeta( meta : UserMeta[] ) {
		this._userMeta = meta;
		const _data    = ( meta && meta.length ) ? meta : [];
		const encrypt  = this.encryptData( JSON.stringify( _data ) );
		localStorage.setItem( META_KEY , encrypt );
	}

	get cloudStore() : string {
		const meta = this._userMeta && Array.isArray( this._userMeta ) ? this._userMeta.find( m => m.meta_key === APP_CONFIGS.metaKeyStore ) : null;
		return meta ? meta.meta_value : null;
	}

	private loadStoredUserMeta() {
		const stored   = localStorage.getItem( META_KEY );
		const decrypt  = stored ? this.decryptData( stored ) : '';
		this._userMeta = decrypt ? JSON.parse( decrypt ) : [];
	}

	encryptData( data : string ) : string {

		// const raw = 'Ban tin goc ban dau';
		// const key = '12345678901234567890123456789012';
		// const _key         = CryptoJS.enc.Utf8.parse( ENCRYPT_KEY );
		// const encryptedECB = CryptoJS.AES.encrypt( raw.trim() , _key , {
		// 	mode    : CryptoJS.mode.ECB ,
		// 	padding : CryptoJS.pad.NoPadding
		// } ).toString();

		try {
			return CryptoJS.AES.encrypt( data , ENCRYPT_KEY ).toString();
		} catch ( e ) {
			return '';
		}
	}

	decryptData( data : string ) : string {
		try {
			const bytes = CryptoJS.AES.decrypt( data , ENCRYPT_KEY );
			if ( bytes.toString() ) {
				return bytes.toString( CryptoJS.enc.Utf8 );
			}
			return data;
		} catch ( e ) {
			return '';
		}
	}

	getOption( keyName : string ) {
		this.getStoredAuthOptions();
		return !!( keyName && this._options[ keyName ] ) ? this._options[ keyName ] : null;
	}

	setOption( keyName : string , value : any ) {
		this.getStoredAuthOptions();
		this._options[ keyName ] = value;
		const encrypt            = this.encryptData( JSON.stringify( this._options ) );
		localStorage.setItem( APP_STORES , encrypt );
	}

	private getStoredAuthOptions() {
		if ( !this._options ) {
			const stored  = localStorage.getItem( APP_STORES );
			const decrypt = stored ? this.decryptData( stored ) : '';
			this._options = decrypt ? JSON.parse( decrypt ) : {};
		}
		return this._options;
	}

	private updateUserMetaLanguage( settings : AppChangeLangEvent ) : Observable<string> {
		if ( this.user && settings.updateMetaData ) {
			return this.userService.updateMeta( {
				user_id    : this.user.id ,
				meta_key   : APP_CONFIGS.metaKeyLanguage ,
				meta_title : 'User language' ,
				meta_value : settings.lang
			} ).pipe( tap( () => localStorage.setItem( 'lang' , settings.lang ) ) , map( () => settings.lang ) );
		} else {
			return of( settings.lang );
		}
	}

	get onSignIn() : Observable<string> {
		return this.onSignIn$;
	}

	get onSignOut() : Observable<string> {
		return this.onSignOut$;
	}

	resetPassword( info : { token : string, password : string, password_confirmation : string } ) : Observable<any> {
		return this.http.post( getRoute( 'reset-password' ) , info );
	}

	get userDonViId() : number {
		return ( this.roles && -1 !== this.roles.findIndex( u => u === 'admin' ) && sessionStorage.getItem( SWITCH_DONVI_ID ) ) ? parseInt( sessionStorage.getItem( SWITCH_DONVI_ID ) , 10 ) : this.user.donvi_id;
	}
}
