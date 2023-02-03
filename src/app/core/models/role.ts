export interface Role {
	id : number,
	name : string,
	title : string,
	realm : string,
	description : string,
	ucase_ids : UseCasePermission[],
	provider : RolePermission[],
	is_default : number,
	status : number,
	created_at? : string,
	updated_at? : string,
}

export interface UseCasePermission {
	id : string, // UseCase name : 'he-thong/thong-tin-tai-khoan'
	pms : string // 1.1.1.1 = access.read.update.delete
}

export interface RolePermission {
	id : string, // router : 'users'
	pms : string // 1.1.1.1 = access.read.update.delete
}
