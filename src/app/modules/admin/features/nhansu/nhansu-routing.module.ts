import { ChitietNhansuComponent } from './chitiet-nhansu/chitiet-nhansu.component';
import { NhansuTrinhdoNgoainguComponent } from './nhansu-trinhdo-ngoaingu/nhansu-trinhdo-ngoaingu.component';
import { NhansuTrinhdoTinhocComponent } from './nhansu-trinhdo-tinhoc/nhansu-trinhdo-tinhoc.component';
import { NhansuTrinhdoChuyenmonComponent } from './nhansu-trinhdo-chuyenmon/nhansu-trinhdo-chuyenmon.component';
import { NhansuTrinhdoVanhoaComponent } from './nhansu-trinhdo-vanhoa/nhansu-trinhdo-vanhoa.component';
import { NhansuQuatrinhCongtacComponent } from './nhansu-quatrinh-congtac/nhansu-quatrinh-congtac.component';

import { DanhsachNhansuComponent } from './danhsach-nhansu/danhsach-nhansu.component';
import { NhansuQuatrinhHopdongComponent } from './nhansu-quatrinh-hopdong/nhansu-quatrinh-hopdong.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhansuDanhhieuThiduaComponent } from './nhansu-danhhieu-thidua/nhansu-danhhieu-thidua.component';

import { NhansuQuatrinhDaotaoComponent } from './nhansu-quatrinh-daotao/nhansu-quatrinh-daotao.component';
import { NhansuQuatrinhDongbaohiemComponent } from './nhansu-quatrinh-dongbaohiem/nhansu-quatrinh-dongbaohiem.component';
import { NhansuQuatrinhXuatngoaiComponent } from './nhansu-quatrinh-xuatngoai/nhansu-quatrinh-xuatngoai.component';

import { NhansuTrinhdoChinhtriComponent } from './nhansu-trinhdo-chinhtri/nhansu-trinhdo-chinhtri.component';


const routes: Routes = [
  { path: 'danhsach-nhansu', component: DanhsachNhansuComponent },
  { path: 'chitiet-nhansu', component: ChitietNhansuComponent },
  { path: 'danhhieu-thidua', component: NhansuDanhhieuThiduaComponent },
  { path: 'quatrinh-congtac', component: NhansuQuatrinhCongtacComponent },
  { path: 'quatrinh-daotao', component: NhansuQuatrinhDaotaoComponent },
  { path: 'quatrinh-dongbaohiem', component: NhansuQuatrinhDongbaohiemComponent },
  { path: 'quatrinh-hopdong', component: NhansuQuatrinhHopdongComponent },
  { path: 'quatrinh-xuatngoai', component: NhansuQuatrinhXuatngoaiComponent },
  { path: 'trinhdo-vanhoa', component: NhansuTrinhdoVanhoaComponent },
  { path: 'trinhdo-chuyenmon', component: NhansuTrinhdoChuyenmonComponent },
  { path: 'trinhdo-tinhoc', component: NhansuTrinhdoTinhocComponent },
  { path: 'trinhdo-ngoaingu', component: NhansuTrinhdoNgoainguComponent },
  { path: 'trinhdo-chinhtri', component: NhansuTrinhdoChinhtriComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhansuRoutingModule { }

