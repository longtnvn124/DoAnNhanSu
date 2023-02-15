import { OvicFile } from './../../../core/models/file';
export interface NsQuatrinhXuatngoai {
  id?: number;
  ma_ns: string;
  tg_di: string;
  tg_ve: string;
  noidung_congviec: string;
  quocgia: string;
}
export interface NsQuaTrinhDaoTao {
  id?: number;
  ma_ns:string;
  tg_batdau:string;
  tg_ketthuc:string;
  noi_daotao:string;
  quocgia:string;
  hoc_vi:string;
  ketqua:string;
}
export interface NsDanhhieuThidua {
  id?: number;
  ma_ns:string;
  ten_danhhieu:string;
  ki_hieu:string;
  cap:string;
  thoigian:string;
}
export interface NsQuatrinhCongtac {
  id ?: number;
	ma_ns : string;
  tg_batdau: string;
  tg_ketthuc: string;
  noi_congtac:string;
  congviec:string;
}

export interface NsQuatrinhDongbaohiem {
  id ?: number;
	ma_ns : string;
  tg_batdau: string;
  tg_ketthuc: string;
  ten_baohiem:string;
  so_tien:number;
}
export interface NsQuatrinhHopdong {
  id ?: number;
	ma_ns : string;
  ten_hopdong: string;
  ngay_ky: string;
  ngay_hethan:string;
  thoihan_hopdong:string;
}

export interface NsKhenthuong_Kyluat{
  id ?: number;
	ma_ns : string;
  phanloai: string;
  ten: string;
  so_quyetdinh: string;
  ngaythang:string;
  file_minhchung:OvicFile[];
}
