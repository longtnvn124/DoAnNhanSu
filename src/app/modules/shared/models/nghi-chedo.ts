import { OvicFile } from './../../../core/models/file';
export interface CheDo_NghiPhep {
  id?: number;
  ma_ns: string;
  loai_nghiphep: string;
  thoigian_batdau: string;
  thoigian_ketthuc: string;
  ngay_duyet: string;
  nguoi_duyet: string;
  file_minhchung: OvicFile[];
}

export interface CheDo_NghiViec {
  id?: number;
  ma_ns: string;
  loai: string;
  tg_batdaunghi: string;
  ngay_duyet: string;
  nguoi_duyet: string;
  file_minhchung: OvicFile[];
}
