export interface NsTrinhdoVanhoa {
  id?: number;
  ma_ns: string;
  ten_trinhdo_vanhoa: string;
}
export interface NsTrinhdoChuyenmon {
  id?: number;
  ma_ns: string;
  tg_batdau: string;
  tg_ketthuc: string;
  noidaotao: string;
  quocgia: string;
  hocvi: string;
  xeploai: string;

}
export interface NsTrinhdoTinhoc {
  id?: number;
  ma_ns: string;
  nam_congnhan: string;
  ten_trinhdo_tinhoc: string;
  loai: string;
  xeploai: string;
}
export interface NsTrinhdoNgoaingu {
  id?: number;
  ma_ns: string;
  nam_congnhan: string;
  ten_ngoaingu: string;
  loai: string;
  xeploai: string;
}

export interface NsTrinhdoChinhtri {
  id?: number;
  ma_ns: string;
  nam_congnhan: string;
  ten_trinhdo_chinhtri: string;
}

