import { DoituongQuyhoachComponent } from './doituong-quyhoach/doituong-quyhoach.component';
import { ChitietQuyhoachComponent } from './chitiet-quyhoach/chitiet-quyhoach.component';
import { DanhsachQuyhoachComponent } from './danhsach-quyhoach/danhsach-quyhoach.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'danhsach-quyhoach', component: DanhsachQuyhoachComponent,},
  { path: 'chitiet-quyhoach', component: ChitietQuyhoachComponent, },
  { path: 'hoso-quyhoach', component: DoituongQuyhoachComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuyhoachRoutingModule { }
