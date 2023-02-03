import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { distinctUntilChanged, debounceTime } from 'rxjs';
import { DmChucdanh } from './../../../../shared/models/danh-muc';
import { DmChucdanhService } from './../../../../shared/services/dm-chucdanh.service';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-danhmuc-chucdanh',
  templateUrl: './danhmuc-chucdanh.component.html',
  styleUrls: ['./danhmuc-chucdanh.component.css']
})
export class DanhmucChucdanhComponent implements OnInit {
  @ViewChild('FormEdit') FormEdit: TemplateRef<any>;
  search: string = '';
  dmChucdanh: DmChucdanh[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmChucdanh | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ten_chucdanh: ['', [Validators.required]],
  });
  constructor(
    private dmChucdanhService: DmChucdanhService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmChucdanhService.list(1, filter).subscribe({
      next: danhSachChucDanh => {
        this.dmChucdanh = danhSachChucDanh;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(dmChucdanh: DmChucdanh) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmChucdanhService.delete(dmChucdanh.id).subscribe({
        next: () => {
          this.notificationService.isProcessing(false);
          this.loadData();
        },
        error: () => {
          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao tác thất bại');
        }
      })
    }
  }
  onOpenFormEdit() {
    this.notificationService.openSideNavigationMenu({
      template: this.FormEdit,
      size: 600,
    })
  }
  changeInputMode(formType: 'add' | 'edit', object: DmChucdanh | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm chức danh' : 'Cập nhật chức danh';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ten_chucdanh: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ten_chucdanh: object?.ten_chucdanh,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DmChucdanh) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmChucdanhService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ten_danhhieu: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dmChucdanh.findIndex(r => r.id === this.formState.object.id);

        this.dmChucdanhService.edit(this.dmChucdanh[index].id, this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess('Cập nhật thành công');
            this.loadData();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Cập nhật thất bại");
          }
        })
      }
    }
    else {
      this.notificationService.toastError("Lỗi nhập liệu");
    }
  }
  btnCancel() {
    this.notificationService.closeSideNavigationMenu();
  }

}
