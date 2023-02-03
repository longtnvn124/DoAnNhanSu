import { Component , Input , OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component( {
	selector    : 'app-confirm-delete' ,
	templateUrl : './confirm-delete.component.html' ,
	styleUrls   : [ './confirm-delete.component.css' ]
} )
export class ConfirmDeleteComponent implements OnInit {

	constructor( private activeModal : NgbActiveModal ) { }

	@Input() head = 'Cảnh báo lệnh xóa !';

	@Input() message = '- Bạn đang thực hiện lệnh xóa dữ liệu.\n' +
					   '  Nếu xóa, dữ liệu sẽ không thể khôi phục được. \n' +
					   '- Bạn có chắc chắn muốn xóa không?';

	ngOnInit() : void {

	}

	confirm( p : boolean ) {
		this.activeModal.close( p );
	}

}
