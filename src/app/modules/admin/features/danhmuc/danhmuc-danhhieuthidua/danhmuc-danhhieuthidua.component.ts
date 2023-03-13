import { DmDanhhieuService } from './../../../../shared/services/dm-danhhieu.service';
import { DmDanhhieu } from './../../../../shared/models/danh-muc';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-danhmuc-danhhieuthidua',
  templateUrl: './danhmuc-danhhieuthidua.component.html',
  styleUrls: ['./danhmuc-danhhieuthidua.component.css']
})
export class DanhmucDanhhieuthiduaComponent implements OnInit {

  @ViewChild('FormEdit') FormEdit: TemplateRef<any>;
  search: string = '';
  dmDanhhieu: DmDanhhieu[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmDanhhieu | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ten_danhhieu: ['', [Validators.required]],
  });
  constructor(
    private dmDanhhieuService: DmDanhhieuService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmDanhhieuService.list(1, filter).subscribe({
      next: danhSachdanhhieu => {
        this.dmDanhhieu = danhSachdanhhieu;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(dmDanhhieu: DmDanhhieu) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmDanhhieuService.delete(dmDanhhieu.id).subscribe({
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
  changeInputMode(formType: 'add' | 'edit', object: DmDanhhieu | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm danh hiệu thi đua' : 'Cập nhật danh hiệu thi đua';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ten_danhhieu: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ten_danhhieu: object?.ten_danhhieu,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DmDanhhieu) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmDanhhieuService.add(this.formData.value).subscribe({
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
        const index = this.dmDanhhieu.findIndex(r => r.id === this.formState.object.id);

        this.dmDanhhieuService.edit(this.dmDanhhieu[index].id, this.formData.value).subscribe({
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
