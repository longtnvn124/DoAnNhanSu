import { Component , Input , OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BUTTON_NO , BUTTON_YES , OvicButton } from '@core/models/buttons';

@Component( {
	selector    : 'app-confirm-rounded' ,
	templateUrl : './confirm-rounded.component.html' ,
	styleUrls   : [ './confirm-rounded.component.css' ]
} )
export class ConfirmRoundedComponent implements OnInit {

	@Input() head = 'Xác nhận hành động';

	@Input() body = 'Vui lòng xác nhận hành động';

	@Input() buttons : OvicButton[] = [ BUTTON_YES , BUTTON_NO ];

	constructor( private ngbActiveModal : NgbActiveModal ) {}

	ngOnInit() : void {
	}

	confirmAction( button : OvicButton ) {
		this.ngbActiveModal.close( button );
	}

}
