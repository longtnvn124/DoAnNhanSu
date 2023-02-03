import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuyhoachRoutingModule } from './quyhoach-routing.module';
import { DanhsachQuyhoachComponent } from './danhsach-quyhoach/danhsach-quyhoach.component';
import { ChitietQuyhoachComponent } from './chitiet-quyhoach/chitiet-quyhoach.component';
import { DoituongQuyhoachComponent } from './doituong-quyhoach/doituong-quyhoach.component';

import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    DanhsachQuyhoachComponent,
    ChitietQuyhoachComponent,
    DoituongQuyhoachComponent
  ],
  imports: [
    CommonModule,
    QuyhoachRoutingModule,

    TableModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    DropdownModule,
    InputTextareaModule,
    FileUploadModule,
    HttpClientModule
  ]
})
export class QuyhoachModule { }
