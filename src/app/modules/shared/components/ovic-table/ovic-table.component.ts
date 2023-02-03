import { Component , OnInit , ViewChild , Input , Output , EventEmitter , TemplateRef , ViewContainerRef , OnDestroy , ChangeDetectionStrategy } from '@angular/core';
import { Table } from 'primeng/table';
import { OvicTableStructure , InsideAction , OvicTableStructureButton } from '@shared/models/ovic-models';
import { debounceTime , Subject , Subscription } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';
import { OvicButton } from '@core/models/buttons';

@Component( {
	selector        : 'ovic-table' ,
	templateUrl     : './ovic-table.component.html' ,
	styleUrls       : [ './ovic-table.component.css' ] ,
	changeDetection : ChangeDetectionStrategy.OnPush
} )
export class OvicTableComponent implements OnInit , OnDestroy {

	@Input() index = 1;

	@Input() data;

	@Input() tableName;

	@Input() enableSearch;

	@Input() enableSearchLocal = true;

	@Input() searchCircle = false;

	@Input() loading;

	@Input() dataKey;

	@Input() rowHover;

	@Input() rows;

	@Input() globalFilterFields;

	@Input() styleClass;

	@Input() tblStructure : OvicTableStructure[];

	@Input() ovicFiler;

	@Input() ovicFilterOption;

	@Input() addRow : boolean;

	@Input() headerButtons : OvicButton[];

	@Input() addRowLabel : string;

	/*For Expantion settings */

	@Input() rowExpanded = false;

	@Input() expandedHeadCssClass : string;

	@Input() expandedHeadInner : string;

	@Input() expandedColumnCssClass : string;

	@Input() expandedDataField : string;

	@Input() expandedTooltip : string;

	@Input() expandedBtnIcons : any; /*[ 'pi pi-chevron-down' , 'pi pi-chevron-right' ]*/

	@Input() expandedBtnInside : InsideAction;

	@Input() menuTemplate : TemplateRef<any>;

	@Input() enablePaginator = false;

	@Input() emptyMessage = 'Không có dữ liệu';
	/*------------------------------------------------------------*/

	@Output() expandedInside = new EventEmitter<any>();

	@ViewChild( Table ) tableComponent : Table;

	@Output() editData = new EventEmitter<number>();

	@Output() deleteData = new EventEmitter<number>();

	@Output() lockData = new EventEmitter<boolean>();

	@Output() switch = new EventEmitter<boolean>();

	@Output() rowClick = new EventEmitter<boolean>();

	@Output() addNewRow = new EventEmitter<boolean>();

	@Output() onButtonClick = new EventEmitter<OvicButton>();

	@Output() onSearch = new EventEmitter<string>();

	@ViewChild( 'dt' ) table : Table;

	@ViewChild( 'topSelectorValue' ) topSelectorValue;

	tblClass = 'ovic-ui-table';

	rowLength = 3;

	activeRow : any;

	private _EVENT_CLICK = new Subject<OvicButton>();

	subscriptions = new Subscription();

	constructor(
		private notificationService : NotificationService ,
		private viewContainerRef : ViewContainerRef
	) {
		const observerCloseRightContextMenu = this.notificationService.eventCloseRightContextMenu$.subscribe( { next : () => this.activeRow = null } );
		this.subscriptions.add( observerCloseRightContextMenu );

		const observerEventClick = this._EVENT_CLICK.asObservable().pipe( debounceTime( 100 ) ).subscribe( { next : button => this.onButtonClick.emit( button ) } );
		this.subscriptions.add( observerEventClick );
	}

	ngOnInit() : void {

		if ( this.styleClass ) {
			this.tblClass = `ovic-ui-table ${ this.styleClass }`;
		}
		if ( !this.rows ) {
			this.rows = 20;
		}
		if ( this.tblStructure ) {
			this.rowLength = this.tblStructure.length + 1;
			if ( this.rowExpanded ) {
				this.rowLength = this.tblStructure.length + 2;
			}
		}
		if ( !this.addRow ) {
			this.addRow = false;
		} else {
			if ( !this.addRowLabel ) {
				this.addRowLabel = 'Thêm trường mới';
			}
		}
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	editClick( key : any ) {
		this.editData.emit( key );
		this.userClick( {
			label : 'Edit button' ,
			name  : 'EDIT' ,
			data  : key ,
			icon  : '' ,
			class : ''
		} );
	}

	deleteClick( key : any ) {
		this.deleteData.emit( key );
		this.userClick( {
			label : 'Delete button' ,
			name  : 'DELETE' ,
			data  : key ,
			icon  : '' ,
			class : ''
		} );
	}

	lockClick( key : any ) {
		this.lockData.emit( key );
		this.userClick( {
			label : 'Lock button' ,
			name  : 'LOCK' ,
			data  : key ,
			icon  : '' ,
			class : ''
		} );
	}

	buttonClick( button : OvicTableStructureButton , key : any ) {
		this.userClick( {
			label : button.label ,
			name  : button.name ,
			data  : key ,
			icon  : '' ,
			class : ''
		} );
	}

	switchClick( key : any ) {
		this.switch.emit( key );
		this.userClick( {
			label : 'Switch button' ,
			name  : 'SWITCH' ,
			data  : key ,
			icon  : '' ,
			class : ''
		} );
	}

	rowClickHandle( key : any ) {
		this.rowClick.emit( key );
	}

	addNewRowClick( key : any ) {
		this.addNewRow.emit( true );
		this.userClick( {
			label : 'Add new row button' ,
			name  : 'ADD_NEW_ROW' ,
			data  : key ,
			icon  : '' ,
			class : ''
		} );
	}

	expandedBtnInsideHandle( key : any ) {
		this.expandedInside.emit( key );
		this.userClick( {
			label : 'Expanded inside button' ,
			name  : 'EXPANDED_INSIDE' ,
			data  : key ,
			icon  : '' ,
			class : ''
		} );
	}

	/********************************************************
	 * Disable context menu
	 * ******************************************************/
	disableContextMenu( event : Event ) {
		if ( this.menuTemplate ) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
	}

	/**********************************************
	 * open context menu
	 * *******************************************/
	openContextMenu( event : MouseEvent , data ) {
		this.notificationService.closeContextMenu();
		if ( this.menuTemplate ) {
			this.notificationService.openContextMenu( event , this.menuTemplate , this.viewContainerRef , data , true );
			this.activeRow = data[ this.dataKey ];
		}
	}

	userClick( button : OvicButton ) {
		this._EVENT_CLICK.next( button );
	}

	search( text : string ) {
		this.onSearch.emit( text );
	}

}
