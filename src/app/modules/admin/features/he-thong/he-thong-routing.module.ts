import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { QuanLyTaiKhoanComponent } from './quan-ly-tai-khoan/quan-ly-tai-khoan.component';
import { ThongTinTaiKhoanComponent } from './thong-tin-tai-khoan/thong-tin-tai-khoan.component';
import { ThongTinHeThongComponent } from './thong-tin-he-thong/thong-tin-he-thong.component';

const routes : Routes = [
	{
		path      : 'quan-ly-tai-khoan' ,
		component : QuanLyTaiKhoanComponent
	} ,
	{
		path      : 'thong-tin-tai-khoan' ,
		component : ThongTinTaiKhoanComponent
	} ,
	{
		path      : 'thong-tin-he-thong' ,
		component : ThongTinHeThongComponent
	}
];

@NgModule( {
	imports : [ RouterModule.forChild( routes ) ] ,
	exports : [ RouterModule ]
} )
export class HeThongRoutingModule {}
