export interface ListOption {
	label : string;
	value : any;
}

export const DMGioiTinh : ListOption[] = [
	{ label : 'Nam' , value : 'nam' } ,
	{ label : 'Nữ' , value : 'nu' }
];

// export interface ChuyenMucOption {
// 	id : number;
// 	parent_id : number; //0 là nhóm danh mục
// 	ten : string;
// 	kyhieu : string; //ký hiệu định nghĩa nhóm danh mục
// 	loai : string; // Những chuyên mục cùng
// 	ordering : number;
// 	inactive : boolean;
// 	status : number; //1 Active; 0: inactive
// }


// export interface ChuyenMucKhac {
// 	id : number;
// 	parent_id : number; //0 là nhóm danh mục
// 	ten : string;
// 	kyhieu : string; //ký hiệu định nghĩa nhóm danh mục
// 	loai : string; // Những chuyên mục cùng
// 	mota : string;
// 	ordering : number;
// 	status : number; //1 Active; 0: inactive
// 	is_deleted : number; //1: deleted; 0: not deleted
// 	deleted_by : number;
// 	created_by : number;
// 	updated_by : number;
// 	created_at : string;
// 	updated_at : string;
// }

// export interface DanhMucChon {
// 	id : number;
// 	ten : string;
// 	kyhieu : string;
// 	loai : string;
// 	ordering : number;
// }

// export interface DiaDanh {
// 	id : number;
// 	parent_id : number;
// 	ten : string;
// 	kyhieu : string;
// 	loai_diadanh : 'TINH' | 'HUYEN' | 'XA';
// 	status : number; //1 Active; 0: inactive
// 	is_deleted : number; //1: deleted; 0: not deleted
// 	deleted_by : number;
// 	created_by : number;
// 	updated_by : number;
// 	created_at : string;
// 	updated_at : string;
// }

// export interface DanhHieuThiDua extends DanhHieuThiDuaVaHinhThucKhenThuong {
// 	loai : 'DHTD';
// }

// export interface HinhThucKhenThuong extends DanhHieuThiDuaVaHinhThucKhenThuong {
// 	loai : 'HTKT';
// }

// interface DanhHieuThiDuaVaHinhThucKhenThuong {
// 	id : number;
// 	ten : string;
// 	mota : string;
// 	loai : 'DHTD' | 'HTKT';
// 	capkhen : string;
// 	heso_tienthuong : number;
// 	ordering : number;
// 	status : number; //1 Active; 0: inactive
// 	is_deleted : number; // 1: deleted; 0: not deleted
// 	deleted_by : number;
// 	created_by : number;
// 	updated_by : number;
// 	created_at : string; // sql datetime
// 	updated_at : string; // sql datetime
// }

// export enum CapKhen {
// 	COSO = 'COSO' ,
// 	TINH = 'TINH' ,
// 	BO   = 'BO' ,
// 	CP   = 'CP' ,
// }

// export interface DonVi {
// 	id : number;
// 	title : string;
// 	parent_id : number; //Đơn vị cấp trên ID
// 	description : string;
// 	status : number; //1 Active; 0: inactive
// }

// export interface PhongBan {
// 	id : number;
// 	title : string;
// 	description : string;
// 	status : number; //1 Active; 0: inactive
// 	donvi_id : number; // Đơn vị Id
// 	is_deleted : number; //1: deleted; 0: not deleted
// 	deleted_by : number;
// 	created_by : number;
// 	updated_by : number;
// 	created_at : string; // sql datetime
// 	updated_at : string; // sql datetime
// }

// export interface SoTheoDoi {
// 	id : number;
// 	donvi_id : number;
// 	ten : string;
// 	mota : string;
// 	status : number; //1 Active; 0: inactive
// 	is_deleted : number; // 1: deleted; 0: not deleted
// 	deleted_by : number;
// 	created_by : number;
// 	updated_by : number;
// 	created_at : string;
// 	updated_at : string;
// }

// export interface HoiDongThiDuaKhenThuong {
// 	id : number;
// 	donvi_id : number;
// 	ten : string;
// 	mota : string;
// 	ngayquyetdinh : string; // mySql DATE - format YYYY-MM-DD
// 	files : File; //file đính kèm nếu có
// 	status : 0 | 1; //1 Active; 0: inactive
// 	is_deleted : 0 | 1; //1: deleted; 0: not deleted
// 	deleted_by : number;
// 	created_by : number;
// 	updated_by : number;
// 	created_at : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
// 	updated_at : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
// }

// export interface ThanVienHoiDongThiDuaKhenThuong {
// 	id : number;
// 	hoidong_id : number;
// 	thanhvien_id : number; // chính là id ở bảng đối tượng thi đua là cá nhân (dữ liệu này được nhặt từ bên đó)
// 	hoten : string;
// 	ngaysinh : string; // mySql DATE - format YYYY-MM-DD
// 	chucvu_duongnhiem : string;
// 	chucvu_hoidong : string;
// 	donvi_congtac : string;
// 	status : 0 | 1; //1 Active; 0: inactive
// 	is_deleted : 0 | 1; //1: deleted; 0: not deleted
// 	deleted_by : number;
// 	created_by : number;
// 	updated_by : number;
// 	created_at : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
// 	updated_at : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
// }

// export interface DiaDanh {
// 	name : string,
// 	type : 'phuong' | 'xa' | 'thi-tran' | 'quan' | 'huyen' | 'thi-xa' | 'tinh' | 'thanh-pho',
// 	slug : string,
// 	name_with_type : string,
// 	path : string,
// 	path_with_type : string,
// 	code : string,
// 	parent_code : string;
// 	created_at : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
// 	updated_at : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
// }

export interface DmChucdanh{
  id?: number;
  ten_chucdanh: string;
}
export interface DmChucvu{
  id?: number;
  ten_chucvu: string;
}
export interface DmDanhhieu{
  id?: number;
  ten_danhhieu: string;
}
  export interface DmPhongban{
  id?: number;
  ten_phongban: string;
}
export interface DmDantoc{
  id?: number;
  ten_dantoc: string;
}
export interface DmTrinhdo{
  id?: number;
  ten_trinhdo: string;
}
export interface DmTongiao{
  id?: number;
  ten_tongiao: string;
}
