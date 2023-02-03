import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { DmChucvuService } from '@modules/shared/services/dm-chucvu.service';
import { DmChucvu } from './../../../../shared/models/danh-muc';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-danhmuc-chucvu',
  templateUrl: './danhmuc-chucvu.component.html',
  styleUrls: ['./danhmuc-chucvu.component.css']
})
export class DanhmucChucvuComponent implements OnInit {

  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  dmChucvu: DmChucvu[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmChucvu | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

    formData: FormGroup = this.formBuilder.group({
      ten_chucvu: ['', [Validators.required]],
    });
  constructor(
    private dmChucvuService: DmChucvuService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
    ) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmChucvuService.list(1, filter).subscribe({
      next: danhSachChucDanh => {
        this.dmChucvu = danhSachChucDanh;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(dmChucdanh: DmChucvu) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmChucvuService.delete(dmChucdanh.id).subscribe({
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
      template: this.nsFormEdit,
      size: 600,
    })
  }
  changeInputMode(formType: 'add' | 'edit', object: DmChucvu | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm chức vụ' : 'Cập nhật chức vụ';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ten_chucvu: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ten_chucvu: object?.ten_chucvu,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object:DmChucvu) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmChucvuService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ten_chucvu: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dmChucvu.findIndex(r => r.id === this.formState.object.id);

        this.dmChucvuService.edit(this.dmChucvu[index].id, this.formData.value).subscribe({
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
  formCancel() {
    this.notificationService.closeSideNavigationMenu();
  }

}
