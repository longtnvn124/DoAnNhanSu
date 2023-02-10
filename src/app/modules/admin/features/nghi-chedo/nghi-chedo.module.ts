import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NghiChedoRoutingModule } from './nghi-chedo-routing.module';
import { ChedoNghiphepComponent } from './chedo-nghiphep/chedo-nghiphep.component';
import { ChedoNghiviecComponent } from './chedo-nghiviec/chedo-nghiviec.component';

//import libra
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { ScrollerModule } from 'primeng/scroller';
import { InputMaskModule } from 'primeng/inputmask';
import {DialogModule} from 'primeng/dialog';


@NgModule({
  declarations: [
    ChedoNghiphepComponent,
    ChedoNghiviecComponent
  ],
  imports: [
    CommonModule,
    NghiChedoRoutingModule,
    TableModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SidebarModule,
    DropdownModule,
    ScrollerModule,
    InputMaskModule,
    ReactiveFormsModule,
    DialogModule
  ]
})
export class NghiChedoModule { }
