export interface Profile {
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
	is_admin : number;
	is_deleted : number;
	created_by : number;
	updated_by : number;
	created_at : string;
	updated_at : string;
}
