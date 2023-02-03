import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';

import { SharedModule } from '@shared/shared.module';
import { ContentNoneComponent } from '@modules/admin/features/content-none/content-none.component';
import { HomeComponent } from '@modules/admin/features/home/home.component';
import { DashboardComponent } from '@modules/admin/dashboard/dashboard.component';
import { UserInfoComponent } from '@modules/admin/dashboard/user-info/user-info.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuLanguageComponent } from '@modules/admin/dashboard/menu-language/menu-language.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule( {
	declarations : [
		DashboardComponent ,
		ContentNoneComponent ,
		HomeComponent ,
		UserInfoComponent ,
		MenuLanguageComponent
	] ,
	imports      : [
		CommonModule ,
		AdminRoutingModule ,
		MenuModule ,
		PanelMenuModule ,
		MessagesModule ,
		MessageModule ,
		ScrollPanelModule ,
		ButtonModule ,
		RippleModule ,
		InputTextModule ,
		SharedModule ,
		OverlayPanelModule ,
		TranslateModule ,
		DropdownModule ,
		FormsModule
	]
} )
export class AdminModule {}
