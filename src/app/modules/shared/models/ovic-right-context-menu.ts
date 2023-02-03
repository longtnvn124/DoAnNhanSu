export interface OvicRightContextMenu {
	invisible? : boolean;
	boldBorderTop? : boolean;
	class? : string;
	icon? : string;
	label : string;
	slug : string;
	child? : OvicRightContextMenu[];
}
