import { Type } from "@angular/core";

export interface NhanSu {
  id?: number;
  ma_ns: string;
  hoten: string;
  hoten_khac: string;
  gioitinh: string;
  ngaysinh: string;
  noisinh: string;
  quequan: string;
  noithuongtru: string;
  noiohientai: string;
  dienthoai: number;
  email: string;
  dantoc: string,
  tongiao: string,
  congviec_tuyendung: string;
  ngay_tuyendung: string;
  coquan_tuyendung: string;
  chucdanh: string,
  chucvu: string,
  congviec_chinh: string;
  ngach_congchuc: string;
  ma_ngach: string;
  bacluong: number;
  heso: number;
  ngay_huong: string;
  phucap_chucvu: string;
  phucap_khac: string;
  trinhdo_phothong: string;
  trinhdo_chuyenmon: string;
  lyluan_chinhtri: string;
  quanly_nhanuoc: string;
  ngoaingu: string;
  tinhoc: string;
  ngay_vaoDang: string;
  Ngay_chinhthuc: string;
  ngay_chinhtrixahoi: string;
  ngay_nhapngu: string;
  ngay_xuatngu: string;
  quanham: string;
  danhhieu_caonhat: string;
  sotruong_congtac: string;
  khenthuong: string;
  kyluat: string;
  tinhtrang_suckhoe: string;
  chieucao: string;
  cannang: string;
  nhommau: string;
  hang_thuongbinh: string;
  giadinh_chinhsach: string;
  so_cccd: number;
  ngaycap: string;
  so_bhxh: string;
  phongban: string,
}


export type NsPermissions = {
  isExpert: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}