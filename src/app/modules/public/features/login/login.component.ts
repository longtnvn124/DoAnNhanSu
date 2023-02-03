import { Component , OnInit , TemplateRef } from '@angular/core';
import { FormBuilder , FormGroup , Validators } from '@angular/forms';
import { ActivatedRoute , Router , Params } from '@angular/router';
import { APP_CONFIGS } from '@env';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime , Subject , Subscription } from 'rxjs';
import { NORMAL_MODAL_OPTIONS } from '@core/utils/syscat';
import { UserSignIn } from '@core/models/auth';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Title } from '@angular/platform-browser';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';

interface FieldPasswordState {
	field : 'text' | 'password';
	icon : 'fa fa-eye' | 'fa fa-eye-slash';
	next : 'hide' | 'show';
}

interface FieldPasswordControl {
	hide : FieldPasswordState;
	show : FieldPasswordState;
}

interface LoginButton {
	isLoading : boolean;
	name : 'signIn' | 'googleSignIn';
}

@Component( {
	selector    : 'app-login' ,
	templateUrl : './login.component.html' ,
	styleUrls   : [ './login.component.css' ]
} )

@AutoUnsubscribeOnDestroy()
export class LoginComponent implements OnInit {

	isRealEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

	loginForm : FormGroup = this.formBuilder.group( {
		username : [ '' , Validators.required ] ,
		password : [ '' , Validators.required ]
	} );

	resetPasswordForm : FormGroup = this.formBuilder.group(
		{
			email : [ '' , [ Validators.required , Validators.pattern( this.isRealEmail ) ] ]
		}
	);

	params? : Params;

	showEmailInvalid = false;

	resetPasswordLoading = false;

	fieldPasswordControl : FieldPasswordControl = {
		hide : {
			field : 'password' ,
			icon  : 'fa fa-eye-slash' ,
			next  : 'show'
		} ,
		show : {
			field : 'text' ,
			icon  : 'fa fa-eye' ,
			next  : 'hide'
		}
	};

	formFieldPassword = this.fieldPasswordControl.hide;

	signInButton : LoginButton = { isLoading : false , name : 'signIn' };

	currentLoginButton = this.signInButton;

	isLoading = true;

	modalResetPasswordRef? : NgbModalRef;

	loginEvent$ = new Subject<UserSignIn>();

	resetPasswordEvent$ = new Subject<string>();

	subscriptions = new Subscription();

	constructor(
		private formBuilder : FormBuilder ,
		private activatedRoute : ActivatedRoute ,
		private modalService : NgbModal ,
		private router : Router ,
		private notificationService : NotificationService ,
		private title : Title ,
		private auth : AuthService
	) {
		const observerRouterActive$  = this.activatedRoute.queryParams.subscribe( params => this.params = params );
		const observerLogin$         = this.loginEvent$.pipe( debounceTime( 100 ) ).subscribe( info => this.checkLogin( info ) );
		const observerResetPassword$ = this.resetPasswordEvent$.pipe( debounceTime( 100 ) ).subscribe( email => this.requestResetPassword( email ) );
		this.subscriptions.add( observerLogin$ );
		this.subscriptions.add( observerResetPassword$ );
		this.subscriptions.add( observerRouterActive$ );
	}

	ngOnInit() : void {
		void this.checkUserLoginStatus();
	}

	async checkUserLoginStatus() {
		if ( this.auth.isLoggedIn() ) {
			const redirect  = this.params && this.params.hasOwnProperty( 'redirect' ) ? this.params[ 'redirect' ] : APP_CONFIGS.defaultRedirect;
			const pageTitle = APP_CONFIGS.pageTitle || 'admin area';
			this.title.setTitle( pageTitle );
			await this.router.navigate( [ redirect ] , { queryParams : this.params } );
			this.isLoading = false;
		} else {
			this.title.setTitle( 'Login Account' );
			this.isLoading = false;
		}
	}

	get f() { return this.loginForm.controls; }

	async btnSignIn( button : LoginButton ) {
		if ( this.isLoading || button.isLoading ) {
			return;
		}
		this.currentLoginButton = button;
		if ( button.name === 'signIn' && this.loginForm.valid ) {
			const signInfo = {
				username : this.loginForm.controls[ 'username' ].value ,
				password : this.loginForm.controls[ 'password' ].value
			};
			this.loginEvent$.next( signInfo );
		}
	}

	checkLogin( info : UserSignIn ) {
		this.isLoading                    = true;
		this.currentLoginButton.isLoading = true;
		this.auth.login( info ).subscribe( {
			next  : () => {
				this.currentLoginButton.isLoading = false;
				void this.checkUserLoginStatus();
			} ,
			error : () => {
				this.isLoading                    = false;
				this.currentLoginButton.isLoading = false;
			}
		} );
	}

	enterOnPasswordField( event : KeyboardEvent ) {
		if ( event.key === 'Enter' ) {
			event.preventDefault();
			event.stopPropagation();
			void this.btnSignIn( this.signInButton );
		}
	}

	toggleShowPassword() {
		this.formFieldPassword = this.fieldPasswordControl[ this.formFieldPassword.next ];
	}

	async openResetPasswordPanel( template : TemplateRef<any> ) {
		this.resetPasswordForm.reset( {
			email : ''
		} );
		this.modalResetPasswordRef = this.modalService.open( template , NORMAL_MODAL_OPTIONS );
		try {
			const status = await this.modalResetPasswordRef.result;
			if ( status ) {
				const userEmail   = this.resetPasswordForm.controls[ 'email' ].value;
				const bodyMessage = `<p class="text-muted">Yêu cầu RESET mật khẩu của bạn đã được chấp nhận, Chúng tôi đã gửi đến <b class="text-primary">${ userEmail }</b> một email hướng dẫn khôi phục mật khẩu, nếu bạn không nhận được email vui lòng kiểm tra trong Spam.</p>`;
				this.notificationService.popup( bodyMessage , 'Thao tác thành công' ).then( () => null , () => null );
			}
		} catch ( e ) {

		}
	}

	closeModalResetPassword() {
		this.modalResetPasswordRef?.close( false );
	}

	btnClickSendRequestPassword() {
		if ( this.resetPasswordForm.valid ) {
			this.resetPasswordEvent$.next( 'reset' );
		}
	}

	requestResetPassword( email : string ) {
		if ( !this.resetPasswordLoading ) {
			this.resetPasswordLoading = true;
			this.auth.forgetPassword( email ).subscribe( {
				next  : () => {
					this.resetPasswordLoading = false;
					this.closeModalResetPassword();
				} ,
				error : () => {
					this.resetPasswordLoading = false;
					this.notificationService.toastError( 'Thác tác thất bại' );
				}
			} );
		}
	}
}
