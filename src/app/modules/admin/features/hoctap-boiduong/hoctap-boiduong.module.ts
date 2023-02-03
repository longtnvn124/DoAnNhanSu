import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HoctapBoiduongRoutingModule } from './hoctap-boiduong-routing.module';
import { KehoachHoctapBoiduongComponent } from './kehoach-hoctap-boiduong/kehoach-hoctap-boiduong.component';
import { DanhsachHoctapBoiduongComponent } from './danhsach-hoctap-boiduong/danhsach-hoctap-boiduong.component';
import { DangkyHoctapBoiduongComponent } from './dangky-hoctap-boiduong/dangky-hoctap-boiduong.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ChitietComponent } from './chitiet/chitiet.component';
@NgModule({
  declarations: [
    KehoachHoctapBoiduongComponent,
    DanhsachHoctapBoiduongComponent,
    DangkyHoctapBoiduongComponent,
    ChitietComponent
  ],
  imports: [
    CommonModule,
    HoctapBoiduongRoutingModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    FileUploadModule,
    HttpClientModule,
  ]
})
export class HoctapBoiduongModule { }
