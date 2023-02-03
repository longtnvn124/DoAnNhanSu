import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeThongRoutingModule } from './he-thong-routing.module';
import { QuanLyTaiKhoanComponent } from './quan-ly-tai-khoan/quan-ly-tai-khoan.component';
import { ThongTinTaiKhoanComponent } from './thong-tin-tai-khoan/thong-tin-tai-khoan.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ThongTinHeThongComponent } from './thong-tin-he-thong/thong-tin-he-thong.component';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

@NgModule( {
	declarations : [
		QuanLyTaiKhoanComponent ,
		ThongTinTaiKhoanComponent ,
		ThongTinHeThongComponent
	] ,
	imports : [
		CommonModule ,
		HeThongRoutingModule ,
		FormsModule ,
		ReactiveFormsModule ,
		SharedModule ,
		ButtonModule ,
		RippleModule ,
		InputTextModule ,
		ContextMenuModule ,
		CheckboxModule ,
		RadioButtonModule ,
		DropdownModule ,
		PaginatorModule
	]
} )
export class HeThongModule {}
