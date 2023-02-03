import { Component , ElementRef , OnInit , ViewChild } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/models/user';
import { FileService } from '@core/services/file.service';
import { NotificationService } from '@core/services/notification.service';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { debounceTime , Observable , of , Subject , Subscription , switchMap } from 'rxjs';
import { distinctUntilChanged , filter , map } from 'rxjs/operators';
import { UserService } from '@core/services/user.service';
import { FormBuilder , FormGroup , Validators } from '@angular/forms';

@Component( {
	selector    : 'app-thong-tin-tai-khoan' ,
	templateUrl : './thong-tin-tai-khoan.component.html' ,
	styleUrls   : [ './thong-tin-tai-khoan.component.css' ]
} )

@AutoUnsubscribeOnDestroy()
export class ThongTinTaiKhoanComponent implements OnInit {

	@ViewChild( 'fileChooser' ) fileChooser : ElementRef<HTMLInputElement>;

	user : User;

	subscriptions = new Subscription();

	translations = {
		title                                   : 'Thông tin tài khoản' ,
		subtitle                                : 'Cập nhật thông tin tài khoản' ,
		errorAvatarType                         : 'Chỉ chấp nhận các file có định dạng .png, .jpg, .jpeg' ,
		errorAvatarSize                         : 'Kích thước tệp hình ảnh không được lớn hơn 15Mb' ,
		lblCreateStorageSpaceHead               : 'Khởi tạo không gian lưu trữ' ,
		lblCreateStorageSpaceMessage            : 'Vui lòng khởi tạo không gian lưu trữ của bạn' ,
		lblCreateStorageSpaceMessageBeforeUsing : 'Vui lòng khởi tạo không gian lưu trữ trước khi lưu trũ dữ liệu' ,
		lblCreateNow                            : 'Khởi tạo' ,
		lblRemindLate                           : 'Để sau' ,
		headCreateStoreFail                     : 'Lỗi' ,
		messageCreateStoreFail                  : 'Quá trình khởi tạo không gian lưu trữ thất bại' ,
		headCreateStoreSuccess                  : 'Thành công' ,
		messageCreateStoreSuccess               : 'Đã khởi tạo không gian lưu trữ thành công' ,
		messageUpdateAvatarSuccess              : 'Cập nhật avatar thành công' ,
		messageUpdateAvatarFail                 : 'Cập nhật avatar thất bại' ,
		headUpdateUserSuccess                   : 'Cập nhật thông tin thành công' ,
		headUpdateUserFail                      : 'Cập nhật thông tin thất bại'
	};

	isUpdatePassword = false;

	timeOut : any;

	form : FormGroup;

	emailControl = {
		error        : false ,
		checking     : false ,
		alreadyExist : false
	};

	phoneControl = {
		error        : false ,
		checking     : false ,
		alreadyExist : false
	};

	buttons = {
		submit  : {
			icon      : 'pi pi-check' ,
			label     : 'Cập nhật' ,
			class     : 'p-button p-button--fade p-disabled' ,
			isLoading : false
		} ,
		refresh : {
			icon      : 'pi pi-refresh' ,
			label     : 'Làm mới' ,
			class     : 'p-button p-button-success' ,
			isLoading : false
		}
	};

	submitEvent$ = new Subject<string>();

	refreshEvent$ = new Subject<string>();

	dataChanged = false;

	constructor(
		private fileService : FileService ,
		private auth : AuthService ,
		private notificationService : NotificationService ,
		private userService : UserService ,
		private fb : FormBuilder
	) {
		this.form                   = this.fb.group( {
			display_name : [ this.auth.user.display_name , [ Validators.required , Validators.minLength( 3 ) ] ] ,
			username     : [ { value : this.auth.user.username , disabled : true } ] ,
			//phone      : [ '' , [ Validators.required , Validators.pattern( /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/ ) ] ] ,
			phone    : [ this.auth.user.phone , [ Validators.required , Validators.minLength( 8 ) , Validators.maxLength( 20 ) ] ] ,
			email    : [ this.auth.user.email , [ Validators.required , Validators.pattern( /^[a-zA-Z0-9_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/ ) ] ] ,
			password : [ { value : '*********' , disabled : true } , [ Validators.required , Validators.minLength( 8 ) , Validators.pattern( '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$' ) ] ]
		} );
		const observerTranslate     = this.auth.appLanguageSettings().pipe( filter( v => v !== null && v !== undefined ) , map( res => res && res.translations ? res.translations.thongTinTaiKhoan : null ) ).subscribe( {
			next : ( translations : any ) => this.translations = translations
		} );
		const observerChangeEmail   = this.form.get( 'email' ).valueChanges.pipe(
			debounceTime( 400 ) ,
			switchMap( newEmail => this.checkEmailValid( newEmail ) )
		).subscribe( {
			next  : valid => {
				this.emailControl.error = false;
				if ( !valid ) {
					this.f[ 'email' ].setErrors( { incorrect : true } );
					this.f[ 'email' ].markAllAsTouched();
				}
				this.checkSubmitButtonVisible();
			} ,
			error : () => {
				this.emailControl.error        = true;
				this.emailControl.checking     = false;
				this.emailControl.alreadyExist = false;
				this.f[ 'email' ].setErrors( { incorrect : true } );
				this.f[ 'email' ].markAllAsTouched();
			}
		} );
		const observerChangePhone   = this.form.get( 'phone' ).valueChanges.pipe(
			debounceTime( 400 ) ,
			switchMap( newPhoneNumber => this.checkNewPhoneIsValid( newPhoneNumber ) )
		).subscribe( {
			next  : valid => {
				this.phoneControl.error = false;
				if ( !valid ) {
					this.f[ 'phone' ].setErrors( { incorrect : true } );
					this.f[ 'phone' ].markAllAsTouched();
				}
				this.checkSubmitButtonVisible();
			} ,
			error : () => {
				this.phoneControl.error        = true;
				this.phoneControl.checking     = false;
				this.phoneControl.alreadyExist = false;
				this.f[ 'phone' ].setErrors( { incorrect : true } );
				this.f[ 'phone' ].markAllAsTouched();
			}
		} );
		const observerSubmitProcess = this.submitEvent$.pipe( debounceTime( 100 ) ).subscribe( { next : () => this.handleSubmitEvent() } );
		const observerRefreshForm   = this.refreshEvent$.pipe( debounceTime( 100 ) ).subscribe( { next : () => this.handleRefreshEvent() } );
		const checkFormInvalid      = this.form.valueChanges.pipe( debounceTime( 50 ) , distinctUntilChanged() , map( () => this.form.valid ) ).subscribe( {
			next : () => {
				this.dataChanged = true;
				this.checkSubmitButtonVisible();
			}
		} );
		this.subscriptions.add( observerTranslate );
		this.subscriptions.add( observerChangeEmail );
		this.subscriptions.add( observerChangePhone );
		this.subscriptions.add( observerRefreshForm );
		this.subscriptions.add( observerSubmitProcess );
		this.subscriptions.add( checkFormInvalid );
	}

	ngOnInit() : void {
		this.user = this.auth.user;
	}

	get f() {
		return this.form.controls;
	}

	async changeAvatar() {
	}

	async onFileInput( fileList : FileList , fileChooser : HTMLInputElement ) {
	}

	changeUpdatePasswordMode() {
		this.isUpdatePassword = !this.isUpdatePassword;
		if ( this.timeOut ) {
			clearTimeout( this.timeOut );
		}
		this.timeOut = setTimeout( () => {
			if ( this.isUpdatePassword ) {
				this.f[ 'password' ].enable( { emitEvent : true } );
				this.f[ 'password' ].setValue( '' );
				this.f[ 'password' ].markAsUntouched();
			} else {
				this.f[ 'password' ].disable( { emitEvent : false } );
				this.f[ 'password' ].setValue( '*********' );
			}
		} , 50 );
	}

	checkEmailValid( newEmail : string ) : Observable<boolean> {
		this.emailControl.error = false;
		if ( this.form.get( 'email' ).valid ) {
			this.emailControl.checking = true;
			return this.userService.validateUserEmail( newEmail , this.user.email ).pipe( map( isValid => {
				this.emailControl.checking     = false;
				this.emailControl.alreadyExist = !isValid;
				return isValid;
			} ) );
		} else {
			this.emailControl.checking     = false;
			this.emailControl.alreadyExist = false;
			return of( false );
		}
	}

	checkNewPhoneIsValid( newPhoneNumber : string ) : Observable<boolean> {
		this.phoneControl.error = false;
		if ( this.form.get( 'phone' ).valid ) {
			this.phoneControl.checking = true;
			return this.userService.validateUserPhone( newPhoneNumber , this.user.phone ).pipe( map( isValid => {
				this.phoneControl.checking     = false;
				this.phoneControl.alreadyExist = !isValid;
				return isValid;
			} ) );
		} else {
			this.phoneControl.checking     = false;
			this.phoneControl.alreadyExist = false;
			return of( false );
		}
	}


	handleSubmitEvent() {
		if ( this.form.valid ) {
			this.notificationService.isProcessing( true );
			const data = { ... this.form.value , username : this.auth.user.username };
			this.userService.updateUserInfo( this.user.id , data ).pipe( switchMap( () => this.userService.getUser( this.auth.user.id ) ) ).subscribe( {
				next  : ( user ) => {
					this.auth.updateUser( user );
					this.notificationService.isProcessing( false );
					void this.notificationService.toastSuccess( this.translations.headUpdateUserSuccess );
					this.buttons.submit.icon      = 'pi pi-check';
					this.buttons.submit.isLoading = false;
					this.handleRefreshEvent();
				} ,
				error : () => {
					this.notificationService.isProcessing( false );
					void this.notificationService.toastError( this.translations.headUpdateUserFail );
					this.buttons.submit.icon      = 'pi pi-check';
					this.buttons.submit.isLoading = false;
					this.handleRefreshEvent();
				}
			} );
		} else {
			this.buttons.submit.icon      = 'pi pi-check';
			this.buttons.submit.isLoading = false;
		}
	}

	btnSubmitClick() {
		if ( !this.buttons.submit.isLoading ) {
			this.buttons.submit.icon      = 'pi pi-spin pi-spinner';
			this.buttons.submit.isLoading = true;
			this.submitEvent$.next( 'submitEvent' );
		}
	}

	btnRefreshClick() {
		if ( !this.buttons.refresh.isLoading && this.form.valid && this.dataChanged ) {
			this.buttons.refresh.icon      = 'pi pi-spin pi-spinner';
			this.buttons.refresh.isLoading = true;
			this.refreshEvent$.next( 'refreshEvent' );
		}
	}

	handleRefreshEvent() {
		const options = { onlySelf : true , emitEvent : false };
		this.form.reset( {
			display_name : this.auth.user.display_name ,
			username     : this.auth.user.username ,
			phone        : this.auth.user.phone ,
			email        : this.auth.user.email ,
			password     : '*********'
		} , options );
		this.form.get( 'password' ).disable( { emitEvent : false } );
		this.form.get( 'password' ).setValue( '*********' );
		this.form.markAsUntouched();
		this.buttons.refresh.icon      = 'pi pi-refresh';
		this.buttons.refresh.isLoading = false;
		this.dataChanged               = false;
		this.buttons.submit.class      = 'p-button p-button--fade p-disabled';
		this.checkSubmitButtonVisible();
	}

	checkSubmitButtonVisible() {
		const ready               = this.dataChanged && this.form.valid && !this.emailControl.checking && !this.phoneControl.checking;
		this.buttons.submit.class = ready ? 'p-button p-button-primary' : 'p-button p-button--fade p-disabled';
	}

}
