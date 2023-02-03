import { Component , Input , OnInit } from '@angular/core';
import { AlertOptions } from '@core/models/alert';
import { DomSanitizer , SafeUrl } from '@angular/platform-browser';
import { BUTTON_CANCEL , BUTTON_DISMISS , BUTTON_NO , BUTTON_YES , OvicButton } from '@core/models/buttons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component( {
	selector    : 'app-alert' ,
	templateUrl : './alert.component.html' ,
	styleUrls   : [ './alert.component.css' ]
} )
export class AlertComponent implements OnInit {

	@Input() options : AlertOptions = {
		type      : 'info' ,
		hideClose : false ,
		icon      : '../../assets/images/alert/info.svg' ,
		title     : 'Sorry...' ,
		message   : 'You lost the match!' ,
		btnLabel  : [ 'close' ]
	};

	icon : SafeUrl;

	btnDismiss = BUTTON_DISMISS;

	btnYes = BUTTON_YES;

	btnNo = BUTTON_NO;

	constructor(
		private sanitized : DomSanitizer ,
		private ngbActiveModal : NgbActiveModal
	) { }

	ngOnInit() : void {
		this.icon = this.sanitized.bypassSecurityTrustUrl( this.options.icon );
	}

	close( button : OvicButton ) {
		this.ngbActiveModal.close( button );
	}
}
