import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentNoneComponent } from '@modules/admin/features/content-none/content-none.component';
import { DashboardComponent } from '@modules/admin/dashboard/dashboard.component';
import { HomeComponent } from '@modules/admin/features/home/home.component';
import { AdminGuard } from '@core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'prefix'
      },
      {
        path: 'dashboard',
        component: HomeComponent
      },
      {
        path: 'content-none',
        component: ContentNoneComponent
      },
      {
        path: 'he-thong',
        loadChildren: () => import('@modules/admin/features/he-thong/he-thong.module').then(m => m.HeThongModule)
      },
      //nhansu
      {
        path: 'nhansu',
        loadChildren: () => import('@modules/admin/features/nhansu/nhansu.module').then(m => m.NhansuModule)
      },
      //danhmuc
      {
        path: 'danhmuc',
        loadChildren: () => import('@modules/admin/features/danhmuc/danhmuc.module').then(m => m.DanhmucModule)
      },
      //
      {
        path: 'quyhoach',
        loadChildren: () => import('@modules/admin/features/quyhoach/quyhoach.module').then(m => m.QuyhoachModule)
      },
      {
        path: 'hoctap-boiduong',
        loadChildren: () => import('@modules/admin/features/hoctap-boiduong/hoctap-boiduong.module').then(m => m.HoctapBoiduongModule)
      },
      {
        path: 'nghi-chedo',
        loadChildren: () => import('@modules/admin/features/nghi-chedo/nghi-chedo.module').then(m => m.NghiChedoModule)
      },
      {
        path: '**',
        redirectTo: '/admin/content-none',
        pathMatch: 'prefix'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
