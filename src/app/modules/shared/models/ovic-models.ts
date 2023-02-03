/***********************************
 * OvicChooser
 * ********************************/
export interface OvicChooser {
	label : string;
	name : string;
}

/***********************************
 * DataPickerGroup
 * ********************************/
export interface DataPickerGroup {
	title : string;
	slug : string;
	limit : number; // -1 => unlimited
	acceptAddedOutOfList : boolean;
	inputPlaceholder? : string;
	active? : boolean;
}

export interface DataPickerColumn {
	header : string;
	field : any;
	width : string;
	dataType : 'text' | 'reference';
	classes? : string;
	separator? : string;
	data? : any; //data Name in stored
}

export interface OvicTableStructureButton {
	tooltip? : string,
	label : string,
	icon : string,
	name : string,
	cssClass : string;
	conditionField? : string,
	conditionValue? : any
}

/***********************************
 * OvicTableStructure
 * ********************************/
export interface OvicTableStructure {
	tooltip? : string; /*title của tooltip , dung cho field actions */
	fieldType : 'normal' | 'media' | 'actions' | 'switch' | 'convertLabel' | 'buttons'; /* normal | media | actions | switch */
	labelConverter? : { default : string, [ T : string | number ] : string }; // converter cho field convertLabel
	labelConverter2? : OvicTableHelper; // converter cho field convertLabel
	innerData? : boolean; /* nếu trường dữ liệu yêu cầu hiển thị dưới dạng html*/
	field : string[]; /* [ 'name' ] | [ 'name' , 'desc' ]*/
	rowClass? : string;
	checker? : string;
	forced? : boolean;
	header? : string;
	sortable? : boolean;
	placeholder? : boolean;
	headClass? : string;
	buttons? : OvicTableStructureButton[];

	/*
	 tblStructure = [
	 {
	 fieldType : 'normal' ,
	 field     : [ 'name' ] ,
	 innerData : false | true ,
	 rowClass  : '' ,

	 } ,
	 {
	 fieldType : 'media' ,
	 field     : [ 'url' ] ,
	 rowClass  : '' ,
	 header    : 'Media' ,
	 placeholder    : true ,
	 sortable  : false ,
	 headClass : 'ovic-w-250px'
	 } ,
	 {
	 tooltip   : 'actions' ,
	 fieldType : 'actions' ,
	 field     : [ 'edit' , 'lock' , 'delete' ] ,
	 rowClass  : '' ,
	 checker   : 'fieldName'
	 forced    : 'true | false,
	 header    : 'Thao tác' ,
	 sortable  : false ,
	 headClass : 'ovic-w-250px'
	 } ,
	 {
	 fieldType : 'switch' ,
	 field     : 'fieldName' ,
	 rowClass  : '' ,
	 header    : 'Thao tác' ,
	 sortable  : false ,
	 headClass : 'ovic-w-250px'
	 }
	 ];
	 */

	/**
	 * trường 'force' của option fieldType : 'actions'
	 * dùng để hiện khóa, trong trường row hiện tại bị khóa (looked = true <==> deactive) thì
	 * column nào set force = true vẫn sẽ active ,
	 * column nào set forced = false thì việc active/deactive column sẽ phụ thuộc vào
	 * trạng thái của trường checker
	 * */
}

export class OvicTableHelper {
	private readonly _data : Map<any , string>;

	constructor( data : Map<any , string> = null ) {
		this._data = data;
	}

	getResult( value : any ) : string {
		console.log( value );
		console.log( this._data );
		return this._data && this._data.size && this._data.has( value ) ? this._data.get( value ) : '';
	}
}

export interface InsideAction {
	title : string;
	cssClass : string;
	icon : string;
}

/***********************************
 * Ovic rating
 * ********************************/
export interface OvicRateOption {
	value : string;
	label : string;
	color : string;
}

/***********************************
 * OvicPercentagesTable
 * ********************************/
export interface OvicPercentagesDataTable {
	stores : OvicPercentageElement[];
	tabs : OvicPercentageTab[];
	selectedListTitle? : string;
	inputPlaceholder? : string;
}

export interface OvicPercentageTab {
	slug : string;
	label : string;
}

export interface OvicPercentageElement {
	selected? : boolean;
	percent? : number;
	name : string;
	id : number;
	slug? : string;
}

interface OvicAnswer {
	name : string;
	key : string;
	check? : boolean;
}

export interface OvicQuestion {
	name : string;
	type : 'checkbox' | 'radio';
	question : string;
	answers : OvicAnswer[];
}

export enum FormType {
	ADDITION = 'ADDITION' ,
	UPDATE   = 'UPDATE' ,
}


export interface OvicForm {
	type : FormType;
	title : string;
	data : any; // form data
	object? : any; // object attached
}

export interface NgPaginateEvent {
	first : number,
	page : number,
	pageCount : number,
	rows : number
}

export interface ngDropDownOnChange {
	originalEvent : Event;
	value : any;
}
