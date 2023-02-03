import { DanhmucDantocComponent } from './danhmuc-dantoc/danhmuc-dantoc.component';
import { DanhmucPhongbanComponent } from './danhmuc-phongban/danhmuc-phongban.component';
import { DanhmucTrinhdoComponent } from './danhmuc-trinhdo/danhmuc-trinhdo.component';
import { DanhmucTongiaoComponent } from './danhmuc-tongiao/danhmuc-tongiao.component';
import { DanhmucDanhhieuthiduaComponent } from './danhmuc-danhhieuthidua/danhmuc-danhhieuthidua.component';
import { DanhmucChucdanhComponent } from './danhmuc-chucdanh/danhmuc-chucdanh.component';
import { DanhmucChucvuComponent } from './danhmuc-chucvu/danhmuc-chucvu.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'danhmuc-chucdanh', component: DanhmucChucdanhComponent },
  { path: 'danhmuc-chucvu', component: DanhmucChucvuComponent },
  { path: 'danhmuc-danhhieu-thidua', component: DanhmucDanhhieuthiduaComponent },
  { path: 'danhmuc-tongiao', component: DanhmucTongiaoComponent },
  { path: 'danhmuc-trinhdo', component: DanhmucTrinhdoComponent },
  { path: 'danhmuc-phongban', component: DanhmucPhongbanComponent },
  { path: 'danhmuc-dantoc', component: DanhmucDantocComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhmucRoutingModule { }
