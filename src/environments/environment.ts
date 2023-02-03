export const environment = {
	production : false
};

const realm = 'doanns';
const host  = 'https://api-dev.ictu.vn';
const port  = '10091';

export const getHost         = () : string => host;
export const getRoute        = ( route : string ) : string => ''.concat( host , ':' , port , '/' , realm , '/api/' , route );
export const getLinkMedia    = ( id : string ) : string => ''.concat( host , ':' , port , '/' , realm , '/api/uploads/' , id );
export const getFileDir      = () : string => ''.concat( host , ':' , port , '/' , realm , '/api/uploads/folder/' );
export const getLinkDownload = ( id : number ) : string => ''.concat( host , ':' , port , '/' , realm , '/api/uploads/file/' , id ? id.toString( 10 ) : '' );

const appLanguages = [
	{ name : 'vn' , label : 'Tiếng việt' } ,
	{ name : 'en' , label : 'English' }
];

const appDefaultLanguage = { name : 'vn' , label : 'Tiếng việt' };

const appVersion = '2.0.1';

export const APP_CONFIGS = {
	defaultRedirect  : '/admin' ,
	pageTitle        : 'Phần mềm nhân sự' ,
	multiLanguage    : true ,
	defaultLanguage  : appDefaultLanguage , // không được bỏ trống trường này ngay cả khi multiLanguage = false
	languages        : appLanguages ,
	realm            : 'doanns' , // app realm
	dateStart        : '09/2020' , // 06/2020
	maxUploadSize    : 838860800 , // (1024 * 1024 * 200) = 800mb
	maxFileUploading : 10 , // The maximum number of files allowed to upload per time
	donvi_id         : 1 , // default donvi id
	coreVersion      : '2.0.0' ,
	appVersion       : appVersion ,
	metaKeyStore     : '__store_dir' ,
	metaKeyLanguage  : '__language' ,
	info_console     : true ,
	project_name     : `Core 14 V${ appVersion }` ,
	author           : 'OvicSoft' ,
	bg_color_01      : '#008060' ,
	bg_color_02      : '#4959bd' ,
	soundAlert       : true
};

/* define menu filter */
export const USER_KEY        = 'ZpeJk7zV';
export const EXPIRED_KEY     = 'ZY4dcVQ8';
export const UCASE_KEY       = 'S2e6M9AT';
export const ROLES_KEY       = 'xKwPLuJF';
export const META_KEY        = 'MKhGKn9P';
export const ACCESS_TOKEN    = 'Wf5XG74P';
export const REFRESH_TOKEN   = 'AbLPDaGK';
export const ENCRYPT_KEY     = 'W4jM2P5r';
export const APP_STORES      = '4QfWtr6Z'; // no clear after logout
export const SWITCH_DONVI_ID = 'C@gGA506'; // no clear after logout
