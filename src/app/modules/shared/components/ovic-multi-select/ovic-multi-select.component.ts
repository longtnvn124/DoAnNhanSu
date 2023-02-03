import { Component , EventEmitter , Input , OnChanges , SimpleChanges , OnInit , Output } from '@angular/core';
import { OvicChooser } from '@shared/models/ovic-models';
import { AbstractControl } from '@angular/forms';

@Component( {
	selector    : 'ovic-multi-select' ,
	templateUrl : './ovic-multi-select.component.html' ,
	styleUrls   : [ './ovic-multi-select.component.css' ]
} )
export class OvicMultiSelectComponent implements OnInit , OnChanges {

	@Input() options : any;

	@Input() optionId : string;

	@Input() optionLabel : string;

	@Input() formField : AbstractControl;

	@Input() defaultValue : string; /* value1,value2,value3 */

	@Input() placeholder : string;

	@Input() filterPlaceHolder : string;

	@Input() filterBy : string;

	@Input() filter = false;

	@Input() filterMatchMode = 'contains'; /*valid values are "contains" (default) "startsWith", "endsWith", "equals", "notEquals", "in", "lt", "lte", "gt" and "gte".*/

	@Input() selectedItemsLabel = '{0} items selected';

	@Input() maxSelectedLabels = 3;

	@Input() displaySelectedLabel = true;

	@Input() emptyFilterMessage = 'Không có kết quả';

	@Output() onChange = new EventEmitter<any>();

	selectedValues : OvicChooser[];

	constructor() { }

	ngOnInit() : void {
		this.settingsChangeData();
	}

	ngOnChanges( changes : SimpleChanges ) {
		// only run when property "data" changed
		if ( changes[ 'defaultValue' ] ) {
			this.settingsChangeData();
		}
	}

	settingsChangeData() {
		if ( this.options && this.defaultValue && typeof this.defaultValue === 'string' ) {
			const provide       = this.defaultValue.split( ',' );
			this.selectedValues = this.options.filter( option => option.hasOwnProperty( this.optionId ) && provide.includes( option[ this.optionId ].toString() ) );
		} else {
			this.selectedValues = [];
		}
	}

	onChangeHandle( event ) {
		if ( this.formField ) {
			if ( event.value && event.value.length ) {
				const result = [];
				for ( const otp of event.value ) {
					result.push( otp[ this.optionId ] );
				}
				this.formField.setValue( result.toString() );
			} else {
				this.formField.setValue( '' );
			}
		}
		this.onChange.emit( event.value );
	}

}
