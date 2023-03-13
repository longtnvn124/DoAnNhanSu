import { DmPhongbanService } from './../../../../shared/services/dm-phongban.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { DmPhongban } from '@modules/shared/models/danh-muc';

@Component({
  selector: 'app-danhmuc-phongban',
  templateUrl: './danhmuc-phongban.component.html',
  styleUrls: ['./danhmuc-phongban.component.css']
})
export class DanhmucPhongbanComponent implements OnInit {

  @ViewChild('FormEdit') FormEdit: TemplateRef<any>;
  search: string = '';
  dmPhongban: DmPhongban[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmPhongban | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ten_phongban: ['', [Validators.required]],
  });
  constructor(
    private dmPhongbanService: DmPhongbanService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmPhongbanService.list(1, filter).subscribe({
      next: danhSachPhongban => {
        this.dmPhongban = danhSachPhongban;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(dmPhongban: DmPhongban) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmPhongbanService.delete(dmPhongban.id).subscribe({
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
  changeInputMode(formType: 'add' | 'edit', object: DmPhongban | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm Phòng ban' : 'Cập nhật Phòng ban';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ten_phongban: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ten_phongban: object?.ten_phongban,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DmPhongban) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmPhongbanService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ten_phongban: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dmPhongban.findIndex(r => r.id === this.formState.object.id);

        this.dmPhongbanService.edit(this.dmPhongban[index].id, this.formData.value).subscribe({
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
