export interface ListOption {
	label : string;
	value : any;
}

export const DMGioiTinh : ListOption[] = [
	{ label : 'Nam' , value : 'nam' } ,
	{ label : 'Nữ' , value : 'nu' }
];

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
export interface DmTrinhdoVanhoa{
  id?: number;
  ten_trinhdo: string;
}
export interface DmTrinhdoChinhtri{
  id?: number;
  ten_trinhdo: string;
}
