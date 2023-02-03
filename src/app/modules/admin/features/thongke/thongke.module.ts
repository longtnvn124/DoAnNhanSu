import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThongkeRoutingModule } from './thongke-routing.module';
import { ThongkeDanhsachNhansuComponent } from './thongke-danhsach-nhansu/thongke-danhsach-nhansu.component';


@NgModule({
  declarations: [
    ThongkeDanhsachNhansuComponent
  ],
  imports: [
    CommonModule,
    ThongkeRoutingModule
  ]
})
export class ThongkeModule { }
