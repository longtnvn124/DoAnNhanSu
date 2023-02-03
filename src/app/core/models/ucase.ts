export interface Ucase {
	id : string;
	icon : string;
	title : string;
	pms : number[]; //[1, 0, 0, 0]
	position : string; // 'left' | 'top'
	child? : Ucase[];
}

export interface UcaseAdvance {
	id : string;
	icon : string;
	title : string;
	pms : number[]; //[1, 0, 0, 0]
	position : string; // 'left' | 'top'
	child? : Ucase[];
	canAccess : boolean,
	canAdd : boolean,
	canEdit : boolean,
	canDelete : boolean,
}

