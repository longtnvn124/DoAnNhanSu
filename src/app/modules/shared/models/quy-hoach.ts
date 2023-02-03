import { OvicFile } from './../../../core/models/file';

export interface DanhSachQuyHoach {
  id?: number;
  ma_quyhoach: string;
  ten_quyhoach: string;
  noidung_quyhoach: string;
  nguoi_ky: string;
  ngay_banhanh: string;
  dot: number;
  nhiem_ky: string;
  file_quyetdinh: OvicFile[];

}
export interface DoiTuongQuyHoach {
  id?:number;
  ma_quyhoach:string;
  hoten: string;
  ngaysinh: string;
  chucvu_hientai: string;
  chucvu_quyhoach: string;
}
