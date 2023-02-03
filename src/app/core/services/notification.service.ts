import { Inject , Injectable , TemplateRef } from '@angular/core';
import { debounceTime , distinctUntilChanged , Observable , Subject , Subscription , fromEvent , BehaviorSubject } from 'rxjs';
import { ToastMessage } from '@core/models/message';
import { OvicButton } from '@core/models/buttons';
import { ALERT_MODAL_OPTIONS , NORMAL_MODAL_OPTIONS , NORMAL_MODAL_OPTIONS_ROUND } from '@core/utils/syscat';
import { ConfirmRoundedComponent } from '@core/components/confirm-rounded/confirm-rounded.component';
import { ConfirmComponent } from '@core/components/confirm/confirm.component';
import { PopupComponent } from '@core/components/popup/popup.component';
import { ConfirmDeleteComponent } from '@core/components/confirm-delete/confirm-delete.component';
import { AlertComponent } from '@core/components/alert/alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Overlay , OverlayRef } from '@angular/cdk/overlay';
import { Title } from '@angular/platform-browser';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter , take } from 'rxjs/operators';
import { AlertOptions } from '@core/models/alert';
import { APP_CONFIGS } from '@env';

export interface SideNavigationMenu {
	name? : string;
	template : TemplateRef<any>;
	size : number;
	offCanvas? : boolean;
	offsetTop? : string; // 60px | 20% ...
}

export interface StateLoadingV2 extends StateLoadingV2Input {
	loading? : boolean;
}

export interface StateLoadingV2Input {
	icon? : 'circle' | 'pill',
	text? : string,
	process? : { percent : number }
}

@Injectable( {
	providedIn : 'root'
} )
export class NotificationService {

	private OBSERVE_LOADING_ANIMATION = new Subject<boolean>();

	private OBSERVE_LOADING_ANIMATION_V2 = new Subject<StateLoadingV2>();

	private OBSERVE_TOAST_MESSAGE = new Subject<ToastMessage>();

	private OBSERVE_CLOSE_RIGHT_CONTEXT_MENU = new Subject<string>();

	private OBSERVE_CLOSE_OVIC_FLEXIBLE_TEMPLATES = new Subject<string>();

	private OBSERVE_OPEN_OVIC_FLEXIBLE_TEMPLATE = new Subject<string>();

	private OBSERVE_ON_WINDOW_SCROLL = new Subject<number>();

	private OBSERVE_OPEN_SIDE_NAVIGATION_MENU = new Subject<SideNavigationMenu>();

	private OBSERVE_CLOSE_SIDE_NAVIGATION_MENU = new Subject<string>();

	private OBSERVE_ON_SCREEN_RESIZE = new BehaviorSubject<{ width : number; height : number }>( { width : 0 , height : 0 } );

	private messCaution = 'Cảnh báo';

	private mesNotice = 'Thông báo';

	private mesYes = 'Có';

	private mesNo = 'Không';

	private mesOk = 'Ok';

	private messConfirmAction = 'Xác nhận hành động';

	private overlayRef : OverlayRef | null;

	private subscription : Subscription;

	private sound_error = new Audio( '../../assets/sound/error.wav' );

	private sound_failure = new Audio( '../../assets/sound/failure.wav' );

	private sound_confirm = new Audio( '../../assets/sound/confirm.wav' );

	constructor(
		private modalService : NgbModal ,
		private translate : TranslateService ,
		private titleService : Title ,
		private overlay : Overlay ,
		@Inject( DOCUMENT ) private document : Document
	) {
		this.translate.onLangChange.asObservable().pipe( debounceTime( 100 ) , distinctUntilChanged() ).subscribe( {
			next : settings => {
				this.messCaution       = settings.translations.notificationService.messCaution;
				this.mesNotice         = settings.translations.notificationService.mesNotice;
				this.messConfirmAction = settings.translations.notificationService.messConfirmAction;
				this.mesYes            = settings.translations.notificationService.mesYes;
				this.mesNo             = settings.translations.notificationService.mesNo;
				this.mesOk             = settings.translations.notificationService.mesOk;
			}
		} );
	}

	get onWindowScroll() : Observable<number> {
		return this.OBSERVE_ON_WINDOW_SCROLL.asObservable();
	}

	pushWindowScrollEvent( scrollY : number ) {
		this.OBSERVE_ON_WINDOW_SCROLL.next( scrollY );
	}

	get onAppToastMessage() : Observable<ToastMessage> {
		return this.OBSERVE_TOAST_MESSAGE.asObservable();
	}

	get onAppLoading() : Observable<boolean> {
		return this.OBSERVE_LOADING_ANIMATION.asObservable();
	}

	isProcessing( isLoading = true ) {
		this.OBSERVE_LOADING_ANIMATION.next( isLoading );
	}

	startLoading() {
		this.isProcessing( true );
	}

	stopLoading() {
		this.isProcessing( false );
	}

	get onLoadingAnimationV2() : Observable<StateLoadingV2> {
		return this.OBSERVE_LOADING_ANIMATION_V2.asObservable();
	}

	loadingAnimationV2( state : StateLoadingV2Input ) : void {
		this.OBSERVE_LOADING_ANIMATION_V2.next( { loading : true , ... state } );
	}

	disableLoadingAnimationV2() : void {
		const reset : StateLoadingV2 = {
			loading : false ,
			icon    : null ,
			text    : '' ,
			process : null
		};
		setTimeout( () => this.OBSERVE_LOADING_ANIMATION_V2.next( reset ) , 500 );
	}

	private toastMessage( message : ToastMessage ) {
		this.OBSERVE_TOAST_MESSAGE.next( message );
	}

	toastError( body : string , heading = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'error';
		const head = heading || this.messCaution;
		if ( sound ) {
			this.playSoundFailure();
		}
		this.toastMessage( { type , head , body } );
	}

	toastSuccess( body : string , heading = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'success';
		const head = heading || this.mesNotice;
		if ( sound ) {
			this.playSoundConfirm();
		}
		this.toastMessage( { type , head , body } );
	}

	toastInfo( body : string , heading = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'info';
		const head = heading || this.mesNotice;
		if ( sound ) {
			this.playSoundConfirm();
		}
		this.toastMessage( { type , head , body } );
	}

	toastWarning( body : string , heading = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'warn';
		const head = heading || this.messCaution;
		if ( sound ) {
			this.playSoundConfirm();
		}
		this.toastMessage( { type , head , body } );
	}

	confirmRounded( htmlBody : string , textHead = '' , buttons : OvicButton[] = [] ) : Promise<OvicButton> {
		const confirmModalRef                  = this.modalService.open( ConfirmRoundedComponent , NORMAL_MODAL_OPTIONS_ROUND );
		confirmModalRef.componentInstance.head = textHead || this.messConfirmAction;
		if ( htmlBody ) {
			confirmModalRef.componentInstance.body = htmlBody;
		}
		if ( buttons && buttons.length ) {
			confirmModalRef.componentInstance.buttons = buttons;
		}
		return confirmModalRef.result;
	}

	confirm( htmlBody : string , textHead = '' , buttons : OvicButton[] = [] ) : Promise<OvicButton> {
		const confirmModalRef                  = this.modalService.open( ConfirmComponent , NORMAL_MODAL_OPTIONS );
		confirmModalRef.componentInstance.head = textHead || this.messConfirmAction;
		if ( htmlBody ) {
			confirmModalRef.componentInstance.body = htmlBody;
		}
		if ( buttons && buttons.length ) {
			confirmModalRef.componentInstance.buttons = buttons;
		}
		return confirmModalRef.result;
	}

	popup( htmlBody : string , textHead = '' ) : Promise<any> {
		const confirmModalRef                  = this.modalService.open( PopupComponent , NORMAL_MODAL_OPTIONS );
		confirmModalRef.componentInstance.head = textHead || this.mesNotice;
		if ( htmlBody ) {
			confirmModalRef.componentInstance.body = htmlBody;
		}
		return confirmModalRef.result;
	}

	confirmDelete( message : string = null , head : string = null ) : Promise<boolean> {
		const c = this.modalService.open( ConfirmDeleteComponent , NORMAL_MODAL_OPTIONS );
		if ( head ) {
			c.componentInstance.head = head;
		}
		if ( message ) {
			c.componentInstance.message = message;
		}
		return c.result;
	}

	closeALlActiveModal( closed : any ) {
		this.modalService.dismissAll( closed );
	}

	/**********************************************
	 * open context menu
	 * *******************************************/
	openContextMenu( event : MouseEvent , menuTemplate : TemplateRef<any> , viewContainerRef , attached : any = null , disableScroll = true ) {
		this.closeContextMenu();
		if ( disableScroll ) {
			this.document.body.classList.add( 'ov-body-disable-scroll' );
		}
		const data             = {
			attached        : attached ,
			subMenuOpenLeft : document.body.clientWidth - event.pageX < 200
		};
		const positionStrategy = this.overlay.position().flexibleConnectedTo( { x : event.clientX , y : event.clientY } ).withPositions( [ { originX : 'end' , originY : 'bottom' , overlayX : 'end' , overlayY : 'top' } ] );

		this.overlayRef = this.overlay.create( { positionStrategy , scrollStrategy : this.overlay.scrollStrategies.close() } );

		this.overlayRef.attach( new TemplatePortal( menuTemplate , viewContainerRef , { $implicit : data } ) );

		this.subscription = fromEvent<MouseEvent>( document , 'click' ).pipe(
			filter( event => {
				const clickTarget = event.target as HTMLElement;
				return !!this.overlayRef && !this.overlayRef.overlayElement.contains( clickTarget );
			} ) ,
			take( 1 )
		).subscribe( () => this.closeContextMenu() );
	}

	/*******************************************************
	 * close context menu
	 * *****************************************************/
	closeContextMenu() {
		this.OBSERVE_CLOSE_RIGHT_CONTEXT_MENU.next( 'close' );
		this.document.body.classList.remove( 'ov-body-disable-scroll' );
		if ( this.subscription ) {
			this.subscription.unsubscribe();
		}
		if ( this.overlayRef ) {
			this.overlayRef.dispose();
			this.overlayRef = null;
		}
	}

	get eventCloseRightContextMenu$() : Observable<string> {
		return this.OBSERVE_CLOSE_RIGHT_CONTEXT_MENU.asObservable();
	}

	/********************************************************
	 * Disable context menu
	 * ******************************************************/
	disableContextMenu( event : MouseEvent ) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}

	/***************************************************
	 * Close ovic flexible templates
	 * ***************************************************/
	get onCloseOvicFlexibleTemplates() : Observable<string> {
		return this.OBSERVE_CLOSE_OVIC_FLEXIBLE_TEMPLATES.asObservable();
	}

	closeOvicFlexibleTemplate( message : string = null ) : void {
		this.OBSERVE_CLOSE_OVIC_FLEXIBLE_TEMPLATES.next( message );
	}

	/***************************************************
	 * open ovic flexible templates
	 * ***************************************************/
	get onOpenOvicFlexibleTemplate() : Observable<string> {
		return this.OBSERVE_OPEN_OVIC_FLEXIBLE_TEMPLATE.asObservable();
	}

	openOvicFlexibleTemplate( templateName : string ) : void {
		this.OBSERVE_OPEN_OVIC_FLEXIBLE_TEMPLATE.next( templateName );
	}

	/***************************************************
	 * Alert
	 * ***************************************************/
	alert( options : AlertOptions ) : Promise<OvicButton> {
		const c                     = this.modalService.open( AlertComponent , ALERT_MODAL_OPTIONS );
		c.componentInstance.options = options;
		return c.result;
	}

	/***************************************************
	 * Alert Success
	 * ***************************************************/
	alertSuccess( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'success' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/success.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Info
	 * ***************************************************/
	alertInfo( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'info' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/info.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Warning
	 * ***************************************************/
	alertWarning( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'warning' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/warning.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Error
	 * ***************************************************/
	alertError( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'error' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/error.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundFailure();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Confirm
	 * ***************************************************/
	alertConfirm( title : string , message : string , label : string[] = [ this.mesYes , this.mesNo ] , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'question' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/question.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : label || [ this.mesYes , this.mesNo ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	playSoundError() : void {
		if ( this.sound_error.duration ) {
			this.sound_error.currentTime = 0;
			void this.sound_error.play();
		}
	}

	playSoundFailure() : void {
		if ( this.sound_failure[ 'play' ] ) {
			this.sound_failure.muted       = false;
			this.sound_failure.currentTime = 0;
			void this.sound_failure.play();
		}
	}

	playSoundConfirm() : void {
		this.sound_confirm.currentTime = 0;
		void this.sound_confirm.play();
	}

	onSideNavigationMenuOpen() : Observable<SideNavigationMenu> {
		return this.OBSERVE_OPEN_SIDE_NAVIGATION_MENU.asObservable();
	}

	openSideNavigationMenu( settings : SideNavigationMenu ) : void {
		settings.name = settings.name || 'default-menu';
		this.OBSERVE_OPEN_SIDE_NAVIGATION_MENU.next( settings );
	}

	onSideNavigationMenuClosed() : Observable<string> {
		return this.OBSERVE_CLOSE_SIDE_NAVIGATION_MENU.asObservable();
	}

	closeSideNavigationMenu( menuName : string = 'close' ) : void {
		this.OBSERVE_CLOSE_SIDE_NAVIGATION_MENU.next( menuName );
	}

	get observeScreenSize() : Observable<{ width : number; height : number }> {
		return this.OBSERVE_ON_SCREEN_RESIZE.asObservable();
	}

	setScreenSize( data : { width : number; height : number } ) : void {
		this.OBSERVE_ON_SCREEN_RESIZE.next( data );
	}
}
