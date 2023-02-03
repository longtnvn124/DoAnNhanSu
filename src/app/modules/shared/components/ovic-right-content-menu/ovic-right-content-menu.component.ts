import { Component , EventEmitter , Input , OnChanges , OnInit , Output , SimpleChanges } from '@angular/core';
import { OvicRightContextMenu } from '@shared/models/ovic-right-context-menu';
import { NotificationService } from '@core/services/notification.service';

@Component( {
	selector    : 'ovic-right-content-menu' ,
	templateUrl : './ovic-right-content-menu.component.html' ,
	styleUrls   : [ './ovic-right-content-menu.component.css' ]
} )
export class OvicRightContentMenuComponent implements OnInit , OnChanges {

	constructor( private notificationService : NotificationService ) { }

	@Input() menu : OvicRightContextMenu[];

	@Input() item : any;

	@Output() clicked = new EventEmitter<{ menu : string, data : any }>();

	_data : OvicRightContextMenu[];

	_item : any;

	ngOnInit() : void {
		this._data = this.menu;
		this._item = this.item;
	}

	ngOnChanges( changes : SimpleChanges ) {
		if ( changes[ 'menu' ] ) {
			this._data = this.menu;
		}
		if ( changes[ 'item' ] ) {
			this._item = this.item;
		}
	}

	menuItemClick( event : MouseEvent , menu : string , data : any ) {
		event.preventDefault();
		event.stopPropagation();
		this.clicked.emit( { menu , data } );
	}

	disableContextMenu( event : MouseEvent ) {
		this.notificationService.disableContextMenu( event );
	}
}
