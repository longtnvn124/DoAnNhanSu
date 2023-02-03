export interface User {
	id : number;
	username : string;
	display_name : string;
	phone : string;
	email : string;
	password? : string;
	avatar : string;
	donvi_id : number;
	realms : string[];
	role_ids : string[];
	status : number;
	created_at : string;
	updated_at : string;
	is_admin? : number;
	is_deleted? : number;
	created_by? : number;
	updated_by? : number;
}

export interface SimpleUser {
	id : number;
	username : string;
	display_name : string;
	phone : string;
	email : string;
	avatar : string;
	donvi_id : number;
	role_ids : number[];
	donvi_ids : number[] | null,
	status : number;
	created_at : string;
	updated_at : string;
}

export interface UserMeta {
	id? : number;
	user_id? : number;
	meta_key : string;
	meta_title : string;
	meta_value : string;
}
