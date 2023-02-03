import { Component , Input , OnInit } from '@angular/core';
import { NgbModal , ModalDismissReasons , NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BUTTON_CLOSED , OvicButton } from '@core/models/buttons';

@Component( {
	selector    : 'app-confirm' ,
	templateUrl : './confirm.component.html' ,
	styleUrls   : [ './confirm.component.css' ]
} )
export class ConfirmComponent implements OnInit {

	@Input() head = 'Xác nhận hành động';

	@Input() body = 'Vui lòng xác nhận hành động';

	@Input() buttons : OvicButton[] = [ BUTTON_CLOSED ];

	constructor( private ngbActiveModal : NgbActiveModal ) {}

	ngOnInit() : void {
	}

	confirmAction( button : OvicButton ) {
		this.ngbActiveModal.close( button );
	}

	close() {
		this.ngbActiveModal.close( BUTTON_CLOSED );
	}
}
