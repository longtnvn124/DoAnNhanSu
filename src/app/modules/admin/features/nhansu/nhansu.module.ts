import { ChitietNhansuComponent } from './chitiet-nhansu/chitiet-nhansu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhansuRoutingModule } from './nhansu-routing.module';
import { NhansuDanhhieuThiduaComponent } from './nhansu-danhhieu-thidua/nhansu-danhhieu-thidua.component';
import { NhansuQuatrinhXuatngoaiComponent } from './nhansu-quatrinh-xuatngoai/nhansu-quatrinh-xuatngoai.component';
import { NhansuQuatrinhHopdongComponent } from './nhansu-quatrinh-hopdong/nhansu-quatrinh-hopdong.component';
import { NhansuQuatrinhDaotaoComponent } from './nhansu-quatrinh-daotao/nhansu-quatrinh-daotao.component';
import { NhansuQuatrinhDongbaohiemComponent } from './nhansu-quatrinh-dongbaohiem/nhansu-quatrinh-dongbaohiem.component';
import { NhansuQuanlyTrinhdoComponent } from './nhansu-quanly-trinhdo/nhansu-quanly-trinhdo.component';
import { NhansuQuatrinhCongtacComponent } from './nhansu-quatrinh-congtac/nhansu-quatrinh-congtac.component';
import { NhansuTrinhdoVanhoaComponent } from './nhansu-trinhdo-vanhoa/nhansu-trinhdo-vanhoa.component';
import { NhansuTrinhdoChuyenmonComponent } from './nhansu-trinhdo-chuyenmon/nhansu-trinhdo-chuyenmon.component';
import { NhansuTrinhdoTinhocComponent } from './nhansu-trinhdo-tinhoc/nhansu-trinhdo-tinhoc.component';
import { NhansuTrinhdoNgoainguComponent } from './nhansu-trinhdo-ngoaingu/nhansu-trinhdo-ngoaingu.component';
import { NhansuTrinhdoChinhtriComponent } from './nhansu-trinhdo-chinhtri/nhansu-trinhdo-chinhtri.component';
import { DanhsachNhansuComponent } from './danhsach-nhansu/danhsach-nhansu.component';
import { NhansuDetaiKhoahocComponent } from './nhansu-detai-khoahoc/nhansu-detai-khoahoc.component';

//import libra
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { ScrollerModule } from 'primeng/scroller';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';

import { NhansuKhenthuongKyluatComponent } from './nhansu-khenthuong-kyluat/nhansu-khenthuong-kyluat.component';

@NgModule({
  declarations: [
    NhansuDanhhieuThiduaComponent,
    NhansuQuatrinhXuatngoaiComponent,

    NhansuQuatrinhHopdongComponent,
    NhansuQuatrinhDaotaoComponent,
    NhansuQuatrinhDongbaohiemComponent,
    NhansuQuanlyTrinhdoComponent,
    DanhsachNhansuComponent,
    ChitietNhansuComponent,
    NhansuQuatrinhCongtacComponent,
    NhansuTrinhdoVanhoaComponent,
    NhansuTrinhdoChuyenmonComponent,
    NhansuTrinhdoTinhocComponent,
    NhansuTrinhdoNgoainguComponent,
    NhansuTrinhdoChinhtriComponent,
    NhansuDetaiKhoahocComponent,

    NhansuKhenthuongKyluatComponent
  ],
  imports: [
    CommonModule,
    NhansuRoutingModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    SidebarModule,
    ScrollerModule,
    InputMaskModule,
    CalendarModule

  ]
})
export class NhansuModule { }
