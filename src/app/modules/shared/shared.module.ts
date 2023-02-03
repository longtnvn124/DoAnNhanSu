import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

import { OvicDropdownComponent } from '@shared/components/ovic-dropdown/ovic-dropdown.component';
import { OvicTableComponent } from '@shared/components/ovic-table/ovic-table.component';
import { OvicEditorComponent } from '@shared/components/ovic-editor/ovic-editor.component';
import { OvicRightContentMenuComponent } from '@shared/components/ovic-right-content-menu/ovic-right-content-menu.component';
import { OvicMultiSelectComponent } from '@shared/components/ovic-multi-select/ovic-multi-select.component';

import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { SafeUrlPipe } from '@shared/pipes/safe-url.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { PaginatorModule } from 'primeng/paginator';


@NgModule( {
	declarations : [
		OvicDropdownComponent ,
		SafeHtmlPipe ,
		SafeUrlPipe ,
		OvicTableComponent ,
		OvicEditorComponent ,
		OvicRightContentMenuComponent ,
		OvicMultiSelectComponent,

	] ,
	imports      : [
		CommonModule ,
		RouterModule ,
		FormsModule ,
		DropdownModule ,
		InputNumberModule ,
		TableModule ,
		InputTextModule ,
		MatProgressBarModule ,
		MatMenuModule ,
		CalendarModule ,
		ReactiveFormsModule ,
		DragDropModule ,
		MultiSelectModule ,
		RippleModule ,
		TooltipModule ,
		InputMaskModule ,
		PaginatorModule
	] ,
	exports      : [
		OvicDropdownComponent ,
		SafeHtmlPipe ,
		OvicTableComponent ,
		OvicEditorComponent ,
		SafeUrlPipe ,
		OvicRightContentMenuComponent ,
		OvicMultiSelectComponent
	]
} )
export class SharedModule {}
