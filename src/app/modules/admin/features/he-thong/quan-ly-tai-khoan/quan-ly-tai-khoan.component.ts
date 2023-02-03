import { Component , OnInit , ViewChild , ElementRef } from '@angular/core';
import { FormBuilder , FormGroup , Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '@core/services/role.service';
import { UserService } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { DEFAULT_MODAL_OPTIONS } from '@shared/utils/syscat';
import { debounceTime , firstValueFrom , forkJoin , Observable , of , Subject , Subscription , switchMap } from 'rxjs';
import { User } from '@core/models/user';
import { Role } from '@core/models/role';
import { OvicRightContextMenu } from '@shared/models/ovic-right-context-menu';
import { ProfileService } from '@core/services/profile.service';
import { map } from 'rxjs/operators';
import { APP_CONFIGS } from '@env';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { OvicTableStructure } from '@shared/models/ovic-models';
import { OvicButton } from '@core/models/buttons';

@Component( {
	selector    : 'app-quan-ly-tai-khoan' ,
	templateUrl : './quan-ly-tai-khoan.component.html' ,
	styleUrls   : [ './quan-ly-tai-khoan.component.css' ]
} )

@AutoUnsubscribeOnDestroy()
export class QuanLyTaiKhoanComponent implements OnInit {

	@ViewChild( 'tplCreateAccount' ) tplCreateAccount : ElementRef;

	formSave : FormGroup;

	isUpdateForm : boolean;

	formTitle : string;

	editUserId : number;

	dsNhomQuyen : Role[] = [];

	data : User[] = [];

	cols : OvicTableStructure[] = [
		{
			fieldType   : 'media' ,
			field       : [ 'avatar' ] ,
			rowClass    : 'ovic-img-minimal text-center img-child-max-width-30' ,
			header      : 'Media' ,
			placeholder : true ,
			sortable    : false ,
			headClass   : 'ovic-w-90px text-center'
		} ,
		{
			fieldType : 'normal' ,
			field     : [ 'username' ] ,
			rowClass  : '' ,
			header    : 'Tên tài khoản' ,
			sortable  : true ,
			headClass : ''
		} ,
		{
			fieldType : 'normal' ,
			field     : [ 'display_name' ] ,
			rowClass  : '' ,
			header    : 'Tên hiển thị' ,
			sortable  : false ,
			headClass : ''
		} ,
		{
			fieldType : 'normal' ,
			field     : [ 'email' ] ,
			rowClass  : '' ,
			header    : 'Email' ,
			sortable  : false ,
			headClass : ''
		} ,
		{
			fieldType : 'normal' ,
			field     : [ 'u_role' ] ,
			innerData : true ,
			rowClass  : '' ,
			header    : 'Vai trò' ,
			sortable  : false ,
			headClass : ''
		}
	];

	formFields = {
		display_name : [ '' , Validators.required ] ,
		// username     : [ '' , [ Validators.required , Validators.pattern( '^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$' ) ] ] ,
		username : [ '' , [ Validators.required , Validators.pattern( '^\\S*$' ) ] ] ,
		phone    : [ '' , Validators.required ] ,
		email    : [ '' , [ Validators.required , Validators.pattern( '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$' ) ] ] ,
		password : [ '' , [ Validators.required , Validators.minLength( 6 ) ] ] ,
		donvi_id : [ '' ] ,
		role_ids : [ [] , Validators.required ] ,
		status   : [ 1 , Validators.required ]
	};

	/*
	 ^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$
	 └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
	 │         │         │            │           no _ or . at the end
	 │         │         │            │
	 │         │         │            allowed characters
	 │         │         │
	 │         │         no __ or _. or ._ or .. inside
	 │         │
	 │         no _ or . at the beginning
	 │
	 username is 3-20 characters long
	 */

	canEdit : boolean;

	canAdd : boolean;

	canDelete : boolean;

	isAdmin : boolean;

	changPassState : boolean;

	defaultPass : string;

	schoolName = '';

	userDonviId : number;

	subscriptions = new Subscription();

	rightContextMenu : OvicRightContextMenu[] = [
		{
			label : 'Xem trước' ,
			icon  : 'fa fa-eye' ,
			slug  : 'preview'
		} ,
		{
			label : 'Chi tiết' ,
			icon  : 'fa fa-info-circle' ,
			slug  : 'detail'
		} ,
		{
			label : 'Tải xuống' ,
			icon  : 'fa fa-cloud-download' ,
			slug  : 'download'
		} ,
		{
			label : 'Share' ,
			icon  : 'fa fa-share-alt' ,
			slug  : 'shared' ,
			child : [
				{ label : 'Công khai' , icon : 'fa fa-globe' , slug : 'SharedPublic' } ,
				{ label : 'Trong nhóm' , icon : 'fa fa-users' , slug : 'sharedGroup' } ,
				{ label : 'Chỉ mình tôi' , icon : 'fa fa-lock' , slug : 'private' }
			]
		} ,
		{
			label : 'Link file' ,
			icon  : 'fa fa-link' ,
			slug  : 'linkFile'
		} ,
		{
			label : 'Xóa file' ,
			icon  : 'fa fa-trash' ,
			slug  : 'deleteFile'
		}
	];

	currentRoute = 'he-thong/quan-ly-tai-khoan';

	headButtons = [
		{
			label           : 'Import' ,
			name            : 'ADD_NEW_ROW_FROM_EXCEL' ,
			icon            : 'pi-file-excel pi' ,
			class           : 'p-button-rounded p-button-success' ,
			tooltip         : 'Thêm mới tài khoản từ file excel' ,
			tooltipPosition : 'left'
		} ,
		{
			label           : 'Refresh' ,
			name            : 'REFRESH_LIST' ,
			icon            : 'pi-refresh pi' ,
			class           : 'p-button-rounded p-button-secondary ml-3' ,
			tooltip         : 'Làm mới danh sách' ,
			tooltipPosition : 'left'
		} ,
		{
			label           : 'Thêm mới' ,
			name            : 'ADD_NEW_ROW' ,
			icon            : 'pi-plus pi' ,
			class           : 'p-button-rounded p-button-primary ml-3 mr-2' ,
			tooltip         : 'Thêm tài khoản mới' ,
			tooltipPosition : 'left'
		}
	];

	private _reloadData$ = new Subject<any>();

	constructor(
		private notificationService : NotificationService ,
		private roleService : RoleService ,
		private userService : UserService ,
		private fb : FormBuilder ,
		private modalService : NgbModal ,
		private profileService : ProfileService ,
		private auth : AuthService
	) {
		this.formSave          = this.fb.group( this.formFields );
		this.data              = [];
		this.isUpdateForm      = false;
		this.formTitle         = 'Tạo tài khoản';
		const listenReloadData = this._reloadData$.asObservable().pipe( debounceTime( 200 ) ).subscribe( { next : () => this.loadData() } );
		this.subscriptions.add( listenReloadData );
	}

	ngOnInit() : void {
		this.canEdit     = this.auth.userCanEdit( this.currentRoute );
		this.canAdd      = this.auth.userCanAdd( this.currentRoute );
		this.canDelete   = this.auth.userCanDelete( this.currentRoute );
		this.isAdmin     = this.auth.userHasRole( 'admin' );
		this.userDonviId = this.auth.user.donvi_id;
		this.f[ 'donvi_id' ].setValue( this.userDonviId );
		const actions = [];
		if ( this.canEdit ) {
			this.cols.push( {
				fieldType : 'switch' ,
				field     : [ 'status' ] ,
				rowClass  : 'round text-center' ,
				header    : 'Active' ,
				sortable  : false ,
				headClass : 'ovic-w-80px text-center'
			} );
			actions.push( 'edit' );
		}
		if ( this.canDelete ) {
			actions.push( 'delete' );
		}
		if ( actions.length ) {
			this.cols.push( {
				tooltip   : 'tài khoản' ,
				fieldType : 'actions' ,
				field     : actions ,
				rowClass  : 'text-center' ,
				header    : 'Thao tác' ,
				sortable  : false ,
				headClass : 'ovic-w-120px text-center'
			} );
		}
		this.loadData();
	}

	loadUsersRoles( users : User[] ) : Observable<[ User[] , Role[] ]> {
		const setIds = new Set<string>();
		users.forEach( u => {
			if ( u.role_ids && u.role_ids.length ) {
				u.role_ids.forEach( r => r ? setIds.add( r ) : null );
			}
		} );
		if ( setIds.size ) {
			const ids = Array.from( setIds ).join( ',' );
			return forkJoin( [
				of( users ) ,
				this.roleService.listRoles( ids ).pipe( map( rs => rs.filter( r => r.realm === APP_CONFIGS.realm ) ) )
			] );
		} else {
			return of( [ users , [] ] );
		}
	}

	loadData() {
		this.data = [];
		this.notificationService.isProcessing( true );
		const userCanLoad                  = ( this.canEdit || this.canAdd || this.canDelete );
		const loader$ : Observable<User[]> = userCanLoad ? this.userService.listUsers( this.userDonviId ) : of( [ this.auth.user ] );
		loader$.pipe(
			map( users => userCanLoad ? ( users.length ? users.filter( u => u.id !== this.auth.user.id ) : [] ) : users ) ,
			switchMap( users => this.loadUsersRoles( users ) )
		).subscribe( {
			next  : ( [ users , roles ] ) => {
				users.map( u => {
					const uRoles = [];
					if ( u.role_ids && u.role_ids.length ) {
						u.role_ids.forEach( r => {
							const index = r ? roles.findIndex( i => i.id === parseInt( r , 10 ) ) : -1;
							if ( index !== -1 ) {
								uRoles.push( '<span class="--user-role-label --role-' + roles[ index ].name + '">' + roles[ index ].title + '</span>' );
							}
						} , [] );
					}
					u[ 'u_role' ] = uRoles.join( ', ' );
					return u;
				} );
				this.data = users;
				this.notificationService.isProcessing( false );
			} ,
			error : () => {
				this.notificationService.isProcessing( false );
				this.notificationService.toastError( 'Load dữ liệu không thành công' );
			}
		} );
	}

	switchEvent( id ) {
		const index = this.data.findIndex( dt => dt.id === id );
		if ( index !== -1 ) {
			const status   = this.data[ index ].status ? 0 : 1;
			const username = this.data[ index ].username;
			this.userService.updateUserInfo( id , { status , username } ).subscribe( {
				next  : () => {
					this.data[ index ].status = status;
					this.notificationService.toastSuccess( 'Thay đổi trạng thái tài khoản thành công' );
				} ,
				error : () => this.notificationService.toastError( 'Thay đổi trạng thái thất bại' )
			} );
		}
	}

	editUser( id ) {
		this.changPassState = false;
		const user          = this.data.find( u => u.id === id );
		if ( user ) {
			this.f[ 'role_ids' ].setValue( user.role_ids );
			this.editUserId   = id;
			this.isUpdateForm = true;
			this.formTitle    = 'Cập nhật tài khoản';
			this.f[ 'display_name' ].setValue( user.display_name );
			this.f[ 'username' ].setValue( user.username );
			this.f[ 'phone' ].setValue( user.phone );
			this.f[ 'email' ].setValue( user.email );
			this.f[ 'password' ].setValue( user.password );
			this.f[ 'donvi_id' ].setValue( user.donvi_id );
			this.f[ 'role_ids' ].setValue( user.role_ids.toString() );
			this.f[ 'status' ].setValue( user.status );
			this.callActionForm( this.tplCreateAccount ).then( () => this.loadData() , () => this.loadData() );
			this.defaultPass = user.password;
		}
	}

	async deleteUser( id ) {
		const confirm = await this.notificationService.confirmDelete();
		if ( confirm ) {
			this.userService.deleteUser( id ).subscribe(
				{
					next  : () => {
						this.notificationService.toastSuccess( 'Xóa tài khoản thành công' );
						this.loadData();
					} ,
					error : () => this.notificationService.toastError( 'Xóa tài khoản thất bại' )
				}
			);
		}
	}

	async creatUser( frmTemplate ) {
		this.changPassState = true;
		this.isUpdateForm   = false;
		this.formTitle      = 'Tạo tài khoản';
		this.resetForm( this.formSave );
		try {
			await this.callActionForm( frmTemplate );
			this.loadData();
		} catch ( e ) {

		}
	}

	// loadAcceptableRoles() : Promise<Role[]> {
	// const observer = this.roleService.listRolesFiltered();
	// return lastValueFrom( observer );
	// }

	async callActionForm( template ) : Promise<any> {
		if ( this.dsNhomQuyen.length === 0 ) {
			const u = await this.loadRolesUserCanSet();
			if ( u.error ) {
				this.notificationService.toastError( 'Không load được dữ liệu vui lòng kiểm tra lại kết nối mạng' );
				return Promise.resolve();
			} else {
				if ( u.roles && u.roles.length ) {
					this.dsNhomQuyen = u.roles;
				} else {
					return this.notificationService.alertInfo( 'Lỗi phân quyền' , 'Bạn chưa được phân quyền tạo tài khoản trên hệ thống này, vui lòng liên hệ quản trị viên để được giải đáp' , 'Đóng' );
				}
			}
		}
		const createUserForm = this.modalService.open( template , DEFAULT_MODAL_OPTIONS );
		return createUserForm.result;
	}

	get f() {
		return this.formSave.controls;
	}

	taoTaiKhoan( form : FormGroup ) {
		form.get( 'donvi_id' ).setValue( this.userDonviId );
		if ( form.valid ) {
			const data    = { ... form.value };
			data.role_ids = data.role_ids.split( ',' ).map( elm => parseInt( elm , 10 ) );
			if ( data.role_ids.some( r => r === 6 ) ) {
				data.display_name.split( ' ' );
				this.userService.creatUser( data ).subscribe(
					{
						next  : () => this.notificationService.toastSuccess( 'Thêm mới tài khoản thành công' ) ,
						error : () => null
					} );
			} else {
				this.userService.creatUser( data ).subscribe( {
					next  : () => this.notificationService.toastSuccess( 'Thêm mới tài khoản thành công' ) ,
					error : () => null
				} );
			}
		} else {
			if ( form.get( 'role_ids' ).invalid ) {
				return this.notificationService.toastInfo( 'Chọn nhóm quyền cho tài khoản' );
			}
			if ( form.get( 'email' ).invalid ) {
				return this.notificationService.toastInfo( 'Email chưa đúng định dạng' );
			}
			form.markAllAsTouched();
			this.notificationService.toastError( 'Vui lòng kiểm tra lại' , 'Lỗi nhập liệu' );
		}
	}

	capNhatTaiKhoan( form : FormGroup ) {
		if ( form.valid ) {
			const data = { ... form.value };
			if ( !this.changPassState ) {
				delete data.password;
			}
			data.role_ids     = data.role_ids.split( ',' ).map( elm => parseInt( elm , 10 ) );
			const currentUser = this.data.find( u => u.id === this.editUserId );
			if ( !currentUser ) { return; }
			this.userService.updateUserInfo( this.editUserId , data ).subscribe( {
				next  : () => {
					this.notificationService.toastSuccess( 'Cập nhật tài khoản thành công' );
					this.modalService.dismissAll( '' );
				} ,
				error : () => null
			} );
		} else if ( form.get( 'role_ids' ).invalid ) {
			return this.notificationService.toastInfo( 'Chọn nhóm quyền cho tài khoản' );
		}
	}

	resetForm( form : FormGroup ) {
		form.reset( { role_ids : '' , status : 0 } );
	}

	clickChangedPass() {
		const state         = this.changPassState;
		this.changPassState = !state;
		if ( !this.changPassState ) {
			this.f[ 'password' ].setValue( this.defaultPass );
		}
	}

	rClick( data ) {
		console.log( data );
	}

	creatUserChangeActive( value : number ) {
		this.f[ 'status' ].setValue( value );
	}

	userActions( btn : OvicButton ) {
		switch ( btn.name ) {
			case 'DELETE':
				void this.deleteUser( btn.data );
				break;
			case 'EDIT':
				this.editUser( btn.data );
				break;
			case 'SWITCH':
				this.switchEvent( btn.data );
				break;
			case 'ADD_NEW_ROW':
				void this.creatUser( this.tplCreateAccount );
				break;
			case 'ADD_NEW_ROW_FROM_EXCEL':
				console.log( 'ADD_NEW_ROW_FROM_EXCEL' );
				break;
			case 'REFRESH_LIST':
				this.triggerReloadData();
				break;
			default :
				break;
		}
	}

	triggerReloadData() {
		this._reloadData$.next( '_reloadData' );
	}

	async loadRolesUserCanSet() : Promise<{ roles : Role[], error : boolean }> {
		const userRoleIds = this.auth.user.role_ids;
		if ( Array.isArray( userRoleIds ) && userRoleIds.length > 1 ) {
			const u   = userRoleIds.map( u => parseInt( u , 10 ) );
			const min = Math.min( ... u );
			const s   = u.filter( e => e !== min );
			this.notificationService.startLoading();
			try {
				const error = false;
				const roles = await firstValueFrom( this.roleService.listRolesFiltered( s.join( ',' ) , 'id,title,realm' ).pipe( map( r => r.filter( r => r.realm === APP_CONFIGS.realm ) ) ) );
				this.notificationService.stopLoading();
				return Promise.resolve( { error , roles } );
			} catch ( e ) {
				this.notificationService.stopLoading();
				return Promise.resolve( { error : true , roles : [] } );
			}
		} else {
			return Promise.resolve( { error : false , roles : [] } );
		}
	}

}
