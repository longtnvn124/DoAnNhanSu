export interface OvicButton {
	label : string;
	name : string;
	icon : string;
	class : string;
	data? : any;
	tooltip? : string;
	tooltipPosition? : string;
}

export const BUTTON_CLOSED = {
	label : 'Đóng' ,
	name  : 'close' ,
	class : 'p-button-danger' ,
	icon  : 'pi pi-times'
};

export const BUTTON_NO = {
	label : 'Không' ,
	name  : 'no' ,
	class : 'p-button-danger' ,
	icon  : 'pi pi-times'
};

export const BUTTON_YES = {
	label : 'Có' ,
	name  : 'yes' ,
	class : 'p-button-success' ,
	icon  : 'pi pi-check'
};

export const BUTTON_SAVE = {
	label : 'Lưu lại' ,
	name  : 'saved' ,
	class : 'p-button-success' ,
	icon  : 'pi pi-save'
};

export const BUTTON_CANCEL = {
	label : 'Hủy' ,
	name  : 'cancel' ,
	class : 'p-button-secondary' ,
	icon  : 'pi pi-ban'
};

export const BUTTON_CONFIRMED = {
	label : 'Xác nhận' ,
	name  : 'confirmed' ,
	class : 'p-button-primary' ,
	icon  : 'pi pi-check'
};

export const BUTTON_DISMISS = {
	label : 'Dismiss' ,
	name  : 'dismiss' ,
	class : 'p-button-primary' ,
	icon  : 'pi pi-times'
};
