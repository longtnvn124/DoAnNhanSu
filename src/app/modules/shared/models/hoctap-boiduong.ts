import { OvicFile } from './../../../core/models/file';
export interface KeHoacHocTapBoiTuong {
  id?: number;
  ma_kehoach:string;
  ten_kehoach:string;
  noidung_kehoach:string;
  thoigian: string;
  hinhthuc_daotao:string;
  diadiem_daotao:string;
  soluong:number;
  file_kehoach:OvicFile[];
}
export interface HoSoHocTap {
  id?:number;
  ma_kehoach:string;
  hoten: string;
  ngaysinh: string;
  phongban:string
  trangthai: string;
}
