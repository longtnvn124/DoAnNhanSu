import { DoiTuongThiDuaCaNhan , QuaTrinhCongTac } from '@shared/models/doi-tuong-thi-dua';
import { BaseComponent } from '@core/utils/base-component';
import { QuaTrinhCongTacService } from '@shared/services/qua-trinh-cong-tac.service';
import { BehaviorSubject , defer , Observable , of } from 'rxjs';
import { map , tap } from 'rxjs/operators';
import { Validators } from '@angular/forms';

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

export class StaffComponent extends BaseComponent {

	private _staff : DoiTuongThiDuaCaNhan;

	private _workingProcess : QuaTrinhCongTac[];

	get staff() : DoiTuongThiDuaCaNhan {
		return this._staff;
	}

	set staff( object : DoiTuongThiDuaCaNhan ) {
		this._staff = object;
	}

	get workingProcess() : QuaTrinhCongTac[] {
		return this._workingProcess;
	}

	constructor(
		private _quaTrinhCongTacService : QuaTrinhCongTacService
	) {
		super();
	}

	/*******************************************************
	 * Lấy thông tin quá trình làm việc của đối tượng
	 * ****************************************************/
	getStaffWorkingProcess( staff : DoiTuongThiDuaCaNhan = null ) : Observable<QuaTrinhCongTac[]> {
		let request$ : Observable<QuaTrinhCongTac[]> = of( [] );
		if ( staff ) {
			request$ = this._quaTrinhCongTacService.getAllStaffWorkingProcess( staff.id );
		} else if ( this.staff ) {
			request$ = this._quaTrinhCongTacService.getAllStaffWorkingProcess( this.staff.id ).pipe( tap( workingProcess => this._workingProcess = workingProcess ) );
		} else {
			request$ = of( [] );
		}
		return request$;
	}

	/*******************************************************
	 * cập nhật quá trình công tác
	 * ****************************************************/
	saveWorkingProcess( id : number , data : any ) {

	}

	/*******************************************************
	 * Xóa quá trình công tác
	 * ****************************************************/
	deleteWorkingProcess( id : number ) {

	}

	/*******************************************************
	 * Thêm mới quá trình công tác
	 * ****************************************************/
	addNewWorkingProcess( data : workProcess ) : Observable<number> {
		return this._quaTrinhCongTacService.create( data );
	}

}
