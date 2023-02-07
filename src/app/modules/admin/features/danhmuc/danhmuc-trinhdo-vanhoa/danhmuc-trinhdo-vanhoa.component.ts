import { DmTrinhdoVanhoaService } from './../../../../shared/services/dm-trinhdo-vanhoa.service';
import { DmTrinhdoVanhoa } from './../../../../shared/models/danh-muc';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-danhmuc-trinhdo-vanhoa',
  templateUrl: './danhmuc-trinhdo-vanhoa.component.html',
  styleUrls: ['./danhmuc-trinhdo-vanhoa.component.css']
})
export class DanhmucTrinhdoVanhoaComponent implements OnInit {

  @ViewChild('FormEdit') FormEdit: TemplateRef<any>;
  search: string = '';
  dmTrinhdoVanhoa: DmTrinhdoVanhoa[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmTrinhdoVanhoa | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ten_trinhdo: ['', [Validators.required]],
  });
  constructor(
    private dmTrinhdoVanhoaService: DmTrinhdoVanhoaService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmTrinhdoVanhoaService.list(1, filter).subscribe({
      next: dsdmTrinhdoVanhoa => {
        this.dmTrinhdoVanhoa = dsdmTrinhdoVanhoa;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(dmTrinhdoVanhoa: DmTrinhdoVanhoa) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmTrinhdoVanhoaService.delete(dmTrinhdoVanhoa.id).subscribe({
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
  changeInputMode(formType: 'add' | 'edit', object: DmTrinhdoVanhoa | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm trình độ văn hoá' : 'Cập nhật trình độ văn hoá';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ten_trinhdo: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ten_trinhdo: object?.ten_trinhdo,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DmTrinhdoVanhoa) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmTrinhdoVanhoaService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ten_trinhdo: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dmTrinhdoVanhoa.findIndex(r => r.id === this.formState.object.id);

        this.dmTrinhdoVanhoaService.edit(this.dmTrinhdoVanhoa[index].id, this.formData.value).subscribe({
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
