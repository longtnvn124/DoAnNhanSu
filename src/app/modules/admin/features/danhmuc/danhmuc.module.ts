import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DanhmucRoutingModule } from './danhmuc-routing.module';
import { DanhmucChucdanhComponent } from './danhmuc-chucdanh/danhmuc-chucdanh.component';
import { DanhmucChucvuComponent } from './danhmuc-chucvu/danhmuc-chucvu.component';
import { DanhmucPhongbanComponent } from './danhmuc-phongban/danhmuc-phongban.component';
import { DanhmucTongiaoComponent } from './danhmuc-tongiao/danhmuc-tongiao.component';
import { DanhmucDantocComponent } from './danhmuc-dantoc/danhmuc-dantoc.component';
import { DanhmucTrinhdoComponent } from './danhmuc-trinhdo/danhmuc-trinhdo.component';
import { DanhmucDanhhieuthiduaComponent } from './danhmuc-danhhieuthidua/danhmuc-danhhieuthidua.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';

import {TableModule} from 'primeng/table';
@NgModule({
  declarations: [
    DanhmucChucdanhComponent,
    DanhmucChucvuComponent,
    DanhmucPhongbanComponent,
    DanhmucTongiaoComponent,
    DanhmucDantocComponent,
    DanhmucTrinhdoComponent,
    DanhmucDanhhieuthiduaComponent,
  ],
  imports: [
    CommonModule,
    DanhmucRoutingModule,
    ButtonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule
  ]
})
export class DanhmucModule { }
