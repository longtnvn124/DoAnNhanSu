import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaoHoSoComponent } from '@modules/admin/features/ho-so/tao-ho-so/tao-ho-so.component';
import { DanhSachHoSoComponent } from '@modules/admin/features/ho-so/danh-sach-ho-so/danh-sach-ho-so.component';
import { SuaHoSoComponent } from '@modules/admin/features/ho-so/sua-ho-so/sua-ho-so.component';

const routes: Routes = [
  {
    path: 'tao-moi',
    component: TaoHoSoComponent
  },
  {
    path: 'danh-sach-ho-so',
    component: DanhSachHoSoComponent
  },
  {
    path: 'sua-ho-so',
    component: SuaHoSoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HoSoRoutingModule { }


module.exports = [
{
  id: 'dashboard',
  title: 'Dashboard',
  icon: 'fa fa-tachometer',
  position: 'left'
},
{
  id: 'nhansu',
  title: 'Thông tin nhân sự',
  icon: 'fa fa-folder-open',
  position: 'left',
  child: [{
    id: 'nhansu/danhsach-nhansu',
    title: 'hồ sơ nhân sự',
    icon: 'fa fa-circle-info',
    position: 'left',
  },
  {
    id: 'nhansu/nhansu_quatrinh-dongbaohiem',
    title: 'Thêm hồ sơ nhân sự',
    icon: 'fa fa-circle-plus',
    position: 'left',
  },
  ]
},
{
  id: 'cong-viec',
  title: 'Quản lý công việc',
  icon: 'fa fa-folder-open',
  position: 'left',
  child: [{
    id: 'cong-viec/cong-viec-theo-kh',
    title: 'Công việc theo kế hoạch',
    icon: 'fa fa-folder-open',
    position: 'left',
    child: [{
      id: 'congviec/cong-viec-theo-kh/danh-sach',
      title: 'Danh sách công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    {
      id: 'congviec/cong-viec-theo-kh/danh-sach-chi-tiet',
      title: 'Chi tiết công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    {
      id: 'congviec/cong-viec-theo-kh/tien-do',
      title: 'Tiến độ công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    {
      id: 'congviec/cong-viec-theo-kh/tao-cong-viec',
      title: 'Tạo công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    ]
  },
  {
    id: 'cong-viec/cong-viec-theo-vb',
    title: 'Công việc theo văn bản',
    icon: 'fa fa-users',
    position: 'left',
    child: [{
      id: 'congviec/cong-viec-theo-vb/danh-sach',
      title: 'Danh sách công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    {
      id: 'congviec/cong-viec-theo-vb/danh-sach-chi-tiet',
      title: 'Chi tiết công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    {
      id: 'congviec/cong-viec-theo-vb/tien-do',
      title: 'Tiến độ công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    {
      id: 'congviec/cong-viec-theo-vb/tao-cong-viec',
      title: 'Tạo công việc',
      icon: 'fa fa-folder-open',
      position: 'left'
    },
    ]
  },
  {
    id: 'cong-viec/quan-ly-vb',
    title: 'Quản lý văn bản',
    icon: 'fa fa-folder-open',
    position: 'left'
  },
  {
    id: 'cong-viec/quan-ly-tai-lieu',
    title: 'Quản lý tài liệu',
    icon: 'fa fa-folder-open',
    position: 'left'
  },
  {
    id: 'cong-viec/quan-ly-yeu-cau',
    title: 'Quản lý yêu cầu',
    icon: 'fa fa-folder-open',
    position: 'left',

  }
  ]
},
{
  id: 'thong-ke',
  title: 'Thông kê',
  icon: 'fa fa-cogs',
  position: 'left',
  child: [{
    id: 'he-thong/danh-sach-nhan-su',
    title: 'Thông tin tài khoản',
    icon: 'fa fa-key',
    position: 'left'
  }]
},
{
  id: 'he-thong',
  title: 'Hệ thống',
  icon: 'fa fa-cogs',
  position: 'left',
  child: [{
    id: 'he-thong/thong-tin-tai-khoan',
    title: 'Thông tin tài khoản',
    icon: 'fa fa-key',
    position: 'left'
  },
  {
    id: 'he-thong/quan-ly-nhom-quyen',
    title: 'Quản lý nhóm quyền',
    icon: 'fa fa-users',
    position: 'left'
  },
  {
    id: 'he-thong/quan-ly-tai-khoan',
    title: 'Quản lý tài khoản',
    icon: 'fa fa-wrench',
    position: 'left'
  },
  {
    id: 'he-thong/thong-tin-he-thong',
    title: 'Thông tin hệ thống',
    icon: 'fa fa-user-circle-o',
    position: 'left'
  }
  ]
}
];
