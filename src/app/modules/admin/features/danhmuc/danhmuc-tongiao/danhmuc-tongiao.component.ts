import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { DmTongiao } from '@modules/shared/models/danh-muc';
import { DmTongiaoService } from '@modules/shared/services/dm-tongiao.service';

@Component({
  selector: 'app-danhmuc-tongiao',
  templateUrl: './danhmuc-tongiao.component.html',
  styleUrls: ['./danhmuc-tongiao.component.css']
})
export class DanhmucTongiaoComponent implements OnInit {

  @ViewChild('FormEdit') FormEdit: TemplateRef<any>;
  search: string = '';
  dmTongiao: DmTongiao[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmTongiao | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ten_tongiao: ['', [Validators.required]],
  });
  constructor(
    private dmTongiaoService: DmTongiaoService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmTongiaoService.list(1, filter).subscribe({
      next: danhSachTongiao => {
        this.dmTongiao = danhSachTongiao;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(dmTongiao: DmTongiao) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmTongiaoService.delete(dmTongiao.id).subscribe({
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
  changeInputMode(formType: 'add' | 'edit', object: DmTongiao | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm chức danh' : 'Cập nhật chức danh';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ten_tongiao: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ten_tongiao: object?.ten_tongiao,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DmTongiao) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmTongiaoService.add(this.formData.value).subscribe({
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
        const index = this.dmTongiao.findIndex(r => r.id === this.formState.object.id);

        this.dmTongiaoService.edit(this.dmTongiao[index].id, this.formData.value).subscribe({
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
