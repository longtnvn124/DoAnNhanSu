export interface Dto {
	draw : number;
	recordsTotal : number;
	recordsFiltered : number;
	data : any;
}

export interface OvicPaginator {
	totalRecords : number;
	rows : number; //Data count to display per page.
	data : any;
}

export enum OvicQueryCondition {
	like                  = 'LIKE' , // https://www.w3schools.com/sql/sql_like.asp
	equal                 = '=' ,
	greaterThan           = '>' ,
	greaterThanToEqualsTo = '>=' ,
	lessThan              = '<' ,
	lessThanOrEqualsTo    = '<=' ,
	notEqual              = '<>' ,
	notEqualTo            = '!=' ,
	notLike               = 'NOT LIKE' ,
}

export enum OrWhereCondition {
	like    = 'like' ,
	andlike = 'andlike' ,
	orlike  = 'orlike' ,
	in      = 'in' ,
	orin    = 'orin' ,
	notin   = 'notin' ,
	ornotin = 'ornotin' ,
	and     = 'and' ,
	or      = 'or' ,
}

export interface OvicConditionParam {
	conditionName : string;
	condition : OvicQueryCondition;
	value : string;
	orWhere? : OrWhereCondition | 'and' | 'or' | string;
}
