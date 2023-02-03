import { DoiTuongThiDuaCaNhan , QuaTrinhCongTac , QuaTrinhHoatDongCachMang } from '@shared/models/doi-tuong-thi-dua';
import { QuaTrinhCongTacService } from '@shared/services/qua-trinh-cong-tac.service';
import { Observable , of } from 'rxjs';
import { map , tap } from 'rxjs/operators';
import { RevolutionState , WorkingProcessState } from '@shared/models/employee';
import { BaseComponent } from '@core/utils/base-component';
import { QuaTrinhHoatDongCachMangService } from '@shared/services/qua-trinh-hoat-dong-cach-mang.service';

interface workProcess {
	tungay : string,
	denngay : string,
	donvi : string,
	chucvu : string,
	chuyenmon : string,
	diachi : string,
	ghichu : string,
	files : []
	status : number
}

interface Revolution {
	id : number;
	giaidoan : string; //Trước 1945; từ 1945-1954; từ 1954-1975; từ 1975 đến nay
	tungay : string;
	denngay : string;
	donvi : string;
	chucvu : string;
	chuyenmon : string;
	diachi : string; //địa chỉ đơn vị công tác
	ghichu : string;
	files : [];
	status : number;
}

export class Employee extends BaseComponent {
	private _employee : DoiTuongThiDuaCaNhan;

	private _workingProcessState : WorkingProcessState = {
		data     : [] ,
		error    : false ,
		loading  : true ,
		present  : 'TABLE' ,
		sending  : 'INIT' ,
		selected : null
	};

	private _revolutionState : RevolutionState = {
		data     : [] ,
		error    : false ,
		loading  : true ,
		present  : 'TABLE' ,
		sending  : 'INIT' ,
		selected : null
	};

	get employee() : DoiTuongThiDuaCaNhan {
		return this._employee;
	}

	set employee( object : DoiTuongThiDuaCaNhan ) {
		this._employee = object;
	}

	get workingProcessState() : WorkingProcessState {
		return this._workingProcessState;
	}

	get revolutionState() : RevolutionState {
		return this._revolutionState;
	}

	constructor(
		private _quaTrinhCongTacService : QuaTrinhCongTacService ,
		private _quaTrinhHoatDongCachMangService : QuaTrinhHoatDongCachMangService
	) {
		super();
	}

	/*******************************************************
	 * Lấy thông tin quá trình làm việc của đối tượng
	 * ****************************************************/
	getEmployeeWorkingProcess( employee : DoiTuongThiDuaCaNhan = null ) : Observable<QuaTrinhCongTac[]> {
		let request$ : Observable<QuaTrinhCongTac[]> = of( [] );
		if ( employee ) {
			request$ = this._quaTrinhCongTacService.getAllStaffWorkingProcess( employee.id );
		} else if ( this.employee ) {
			this.workingProcessState.loading = true;
			this.workingProcessState.present = 'TABLE';
			request$                         = this._quaTrinhCongTacService.getAllStaffWorkingProcess( this.employee.id ).pipe(
				map( res => {
					res.map( row => {
						const tungay                   = row.tungay ? this.dateFormatWithTimeZone( row.tungay ) : null;
						const denNgay                  = row.denngay ? this.dateFormatWithTimeZone( row.denngay ) : null;
						row[ '__tungay_transference' ] = tungay ? [ tungay.getDate().toString( 10 ).padStart( 2 , '0' ) , ( 1 + tungay.getMonth() ).toString( 10 ).padStart( 2 , '0' ) , tungay.getFullYear().toString( 10 ) ].join( '/' ) : '';
						row[ '__dengay_transference' ] = denNgay ? [ denNgay.getDate().toString( 10 ).padStart( 2 , '0' ) , ( 1 + denNgay.getMonth() ).toString( 10 ).padStart( 2 , '0' ) , denNgay.getFullYear().toString( 10 ) ].join( '/' ) : '';
						return row;
					} );
					return res;
				} ) ,
				tap( {
					next  : workingProcess => {
						this.workingProcessState.data    = workingProcess;
						this.workingProcessState.loading = false;
						this.workingProcessState.error   = false;
					} ,
					error : () => {
						this.workingProcessState.data    = [];
						this.workingProcessState.loading = false;
						this.workingProcessState.error   = true;
					}
				} )
			);
		} else {
			request$ = of( [] );
		}
		return request$;
	}

	/*******************************************************
	 * cập nhật quá trình công tác
	 * ****************************************************/
	updateWorkingProcess( id : number , data : any ) : Observable<any> {
		return this._quaTrinhCongTacService.update( id , data );
	}

	/*******************************************************
	 * Xóa quá trình công tác
	 * ****************************************************/
	deleteWorkingProcess( id : number ) : Observable<any> {
		return this._quaTrinhCongTacService.delete( id );
	}

	/*******************************************************
	 * Thêm mới quá trình công tác
	 * ****************************************************/
	addNewWorkingProcess( data : workProcess ) : Observable<number> {
		data[ 'doituong' ] = this.employee.id;
		return this._quaTrinhCongTacService.create( data );
	}

	dateFormatWithTimeZone( date : Date | string , timeZone = 'Asia/Ho_Chi_Minh' ) : Date {
		if ( typeof date === 'string' ) {
			return new Date(
				new Date( date ).toLocaleString( 'en-US' , { timeZone } )
			);
		}
		return new Date(
			date.toLocaleString( 'en-US' , { timeZone } )
		);
	}

	/*******************************************************
	 * Thêm mới quá trình hoạt động cách mạng
	 * ****************************************************/
	addNewRevolutionaryActivity( data : Revolution ) : Observable<number> {
		data[ 'doituong' ] = this.employee.id;
		return this._quaTrinhHoatDongCachMangService.create( data );
	}

	/*******************************************************
	 * Cập nhật một quá trình hoạt động cách mạng
	 * ****************************************************/
	updateRevolutionaryActivity( id : number , data : any ) : Observable<any> {
		return this._quaTrinhHoatDongCachMangService.update( id , data );
	}

	/*******************************************************
	 * Xóa một quá trình hoạt động cách mạng
	 * ****************************************************/
	deleteRevolutionaryActivity( id : number ) : Observable<any> {
		return this._quaTrinhHoatDongCachMangService.delete( id );
	}

	/*******************************************************
	 * Tải quá trình hoạt động cách mạng
	 * ****************************************************/
	loadRevolutionaryActivities( employee : DoiTuongThiDuaCaNhan = null ) : Observable<any> {
		let request$ : Observable<QuaTrinhHoatDongCachMang[]> = of( [] );
		if ( employee ) {
			request$ = this._quaTrinhHoatDongCachMangService.getAllRevolutionaryActivities( employee.id );
		} else if ( this.employee ) {
			this.revolutionState.loading = true;
			this.revolutionState.present = 'TABLE';
			request$                     = this._quaTrinhHoatDongCachMangService.getAllRevolutionaryActivities( this.employee.id ).pipe(
				map( res => {
					res.map( row => {
						const tungay                   = row.tungay ? this.dateFormatWithTimeZone( row.tungay ) : null;
						const denNgay                  = row.denngay ? this.dateFormatWithTimeZone( row.denngay ) : null;
						row[ '__tungay_transference' ] = tungay ? [ tungay.getDate().toString( 10 ).padStart( 2 , '0' ) , ( 1 + tungay.getMonth() ).toString( 10 ).padStart( 2 , '0' ) , tungay.getFullYear().toString( 10 ) ].join( '/' ) : '';
						row[ '__dengay_transference' ] = denNgay ? [ denNgay.getDate().toString( 10 ).padStart( 2 , '0' ) , ( 1 + denNgay.getMonth() ).toString( 10 ).padStart( 2 , '0' ) , denNgay.getFullYear().toString( 10 ) ].join( '/' ) : '';
						return row;
					} );
					return res;
				} ) ,
				tap( {
					next  : process => {
						this.revolutionState.data    = process;
						this.revolutionState.loading = false;
						this.revolutionState.error   = false;
					} ,
					error : () => {
						this.revolutionState.data    = [];
						this.revolutionState.loading = false;
						this.revolutionState.error   = true;
					}
				} ) );
		} else {
			request$ = of( [] );
		}
		return request$;
	}
}
