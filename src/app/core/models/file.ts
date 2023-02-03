export enum OvicDocumentTypes {
	docx  = 'docx' ,
	pptx  = 'pptx' ,
	ppt   = 'ppt' ,
	pdf   = 'pdf' ,
	xlsx  = 'xlsx' ,
	audio = 'audio' ,
	video = 'video' ,
	image = 'image' ,
	text  = 'text' ,
	zip   = 'zip' ,
}

export interface OvicFile {
	id : number;
	name : string;
	title : string;
	url : string;
	ext : string;
	type : string;
	size : number;
	user_id : number;
	public? : number; // '-1' => public | '0' => private | '|12|24|25|' => share group
	created_at? : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
	updated_at? : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
}

export interface Upload {
	progress : number;
	state : 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

export interface Download {
	content : Blob | null;
	progress : number;
	state : 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

export interface OvicPreviewFileContent {
	id : string | number;
	file? : OvicFile;
}

export interface OvicDocumentDownloadResult {
	state : 'REJECTED' | 'ERROR' | 'INVALIDATE' | 'COMPLETED' | 'CANCEL';
	download : Download;
}
