import { ChedoNghiphepComponent } from './chedo-nghiphep/chedo-nghiphep.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChedoNghiviecComponent } from './chedo-nghiviec/chedo-nghiviec.component';

const routes: Routes = [
  { path: 'chedo-nghiphep', component: ChedoNghiphepComponent },
  { path: 'chedo-nghiviec', component: ChedoNghiviecComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NghiChedoRoutingModule { }
