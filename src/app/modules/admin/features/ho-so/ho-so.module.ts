import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HoSoRoutingModule } from './ho-so-routing.module';
import { TaoHoSoComponent } from './tao-ho-so/tao-ho-so.component';
import { DanhSachHoSoComponent } from './danh-sach-ho-so/danh-sach-ho-so.component';
import { SuaHoSoComponent } from './sua-ho-so/sua-ho-so.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@NgModule( {
	declarations : [
		TaoHoSoComponent ,
		DanhSachHoSoComponent ,
		SuaHoSoComponent
	] ,
	imports : [
		CommonModule ,
		HoSoRoutingModule ,
		TableModule ,
		ButtonModule ,
		RippleModule ,
		InputTextModule ,
		FormsModule
	]
} )
export class HoSoModule {}
