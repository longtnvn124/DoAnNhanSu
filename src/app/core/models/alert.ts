export interface AlertOptions {
	type : 'question' | 'success' | 'error' | 'info' | 'warning';
	hideClose : boolean;
	icon : string;
	title : string;
	message : string;
	btnLabel : string[];
}
