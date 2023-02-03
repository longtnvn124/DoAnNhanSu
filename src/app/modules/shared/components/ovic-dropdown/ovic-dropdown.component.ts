import { Component , OnInit , Input , OnChanges , Output , EventEmitter , SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component( {
    selector    : 'ovic-dropdown' ,
    templateUrl : './ovic-dropdown.component.html' ,
    styleUrls   : [ './ovic-dropdown.component.css' ]
} )
export class OvicDropdownComponent implements OnInit , OnChanges {

    @Input() options : any;

    @Input() defaultValue : any;

    @Input() optionId : string;

    @Input() optionLabel : string;

    @Input() formField : AbstractControl;

    @Input() placeholder = 'Lựa chọn';

    @Input() filter : boolean;

    @Input() showClear = true;

    @Input() filterBy = 'label';

    @Input() filterPlaceholder : string;

    @Input() styleClass : string;

    @Input() filterMatchMode = 'contains'; /*Defines how the items are filtered, valid values are "contains" (default) "startsWith", "endsWith", "equals", "notEquals", "in", "lt", "lte", "gt" and "gte".*/

    @Input() emptyFilterMessage : string;

    @Input() freeze = false; // đóng băng hành động

    @Output() onChange = new EventEmitter<any>();

    @Output() onChangeGetValue = new EventEmitter<any>();

    value : any;
    wrapClass : string;

    constructor() {
    }

    ngOnInit() : void {
        this.filter             = !this.filter ? false : this.filter;
        this.emptyFilterMessage = !this.emptyFilterMessage ? 'Không có kết quả' : this.emptyFilterMessage;
        this.wrapClass          = this.styleClass ? ''.concat( 'ovic-input-line-dropdown ' , this.styleClass ) : 'ovic-input-line-dropdown';

        if ( this.options && this.defaultValue !== null && this.defaultValue !== undefined ) {
            this.value = this.options.find( s => s.hasOwnProperty( this.optionId ) && s[ this.optionId ].toString() === this.defaultValue.toString() );
        } else {
            this.value = null;
        }
    }

    onChangeHandle( event ) {
        if ( this.formField ) {
            if ( event.value && event.value[ this.optionId ] !== null ) {
                this.formField.setValue( event.value[ this.optionId ] );
            } else {
                this.formField.setValue( '' );
            }
        }
        if ( event.value && this.optionId ) {
            this.onChangeGetValue.emit( event.value[ this.optionId ] );
        } else {
            this.onChangeGetValue.emit( '' );
        }
        this.onChange.emit( event.value );
    }

    ngOnChanges( changes : SimpleChanges ) {
        if ( changes[ 'defaultValue' ] || changes[ 'options' ] ) {
            if ( this.options && this.defaultValue !== null && this.defaultValue !== undefined ) {
                this.value = this.options.find( s => s.hasOwnProperty( this.optionId ) && s[ this.optionId ] === this.defaultValue );
            } else {
                this.value = null;
            }
        }
    }

}
