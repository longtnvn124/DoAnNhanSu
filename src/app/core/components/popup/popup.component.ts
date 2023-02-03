import { Component , OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OvicButton } from '@core/models/buttons';

@Component( {
	selector    : 'app-popup' ,
	templateUrl : './popup.component.html' ,
	styleUrls   : [ './popup.component.css' ]
} )
export class PopupComponent implements OnInit {

	@Input() textHead = 'Thông báo';

	@Input() htmlBody = '';

	@Input() button : OvicButton = {
		label : 'Đóng' ,
		name  : 'close' ,
		class : 'btn-primary' ,
		icon  : ''
	};

	constructor( private activeModal : NgbActiveModal ) { }

	ngOnInit() : void {

	}

	confirmAction( btn : OvicButton ) {
		this.activeModal.close( btn );
	}
}
