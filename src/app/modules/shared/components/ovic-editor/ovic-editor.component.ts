import { Component , OnInit , Input , SimpleChanges , OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HelperService } from '@core/services/helper.service';

@Component( {
	selector    : 'ovic-editor' ,
	templateUrl : './ovic-editor.component.html' ,
	styleUrls   : [ './ovic-editor.component.css' ]
} )
export class OvicEditorComponent implements OnInit , OnChanges {

	@Input() height = '320px';

	@Input() formField : AbstractControl;

	@Input() readonly = false;

	@Input() default : string;

	textContents : any;

	constructor(
		private helperService : HelperService
	) {
	}

	ngOnInit() : void {
		this.setData( this.default );
	}

	ngOnChanges( changes : SimpleChanges ) {
		if ( changes[ 'default' ] ) {
			this.setData( this.default );
		}
	}

	setData( data : string ) {
		this.textContents = data ? this.helperService.decodeHTML( data ) : '';
	}

	onTextChange( event ) {
		if ( this.formField ) {
			this.formField.setValue( this.helperService.encodeHTML( event.htmlValue ) );
		}
	}

}
