import { DmTrinhdoChinhtriService } from './../../../../shared/services/dm-trinhdo-chinhtri.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DmTrinhdoChinhtri } from './../../../../shared/models/danh-muc';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-danhmuc-trinhdo-chinhtri',
  templateUrl: './danhmuc-trinhdo-chinhtri.component.html',
  styleUrls: ['./danhmuc-trinhdo-chinhtri.component.css']
})
export class DanhmucTrinhdoChinhtriComponent implements OnInit {

  @ViewChild('FormEdit') FormEdit: TemplateRef<any>;
  search: string = '';
  dmTrinhdoChinhtri: DmTrinhdoChinhtri[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmTrinhdoChinhtri | null
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
    private dmTrinhdoChinhtriService: DmTrinhdoChinhtriService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmTrinhdoChinhtriService.list(1, filter).subscribe({
      next: dsdmTrinhdoChintri => {
        this.dmTrinhdoChinhtri = dsdmTrinhdoChintri;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(dmTongiao: DmTrinhdoChinhtri) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmTrinhdoChinhtriService.delete(dmTongiao.id).subscribe({
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
  changeInputMode(formType: 'add' | 'edit', object: DmTrinhdoChinhtri | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm trình độ chính trị' : 'Cập nhật trình độ chính trị';
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
  btnEdit(object: DmTrinhdoChinhtri) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmTrinhdoChinhtriService.add(this.formData.value).subscribe({
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
        const index = this.dmTrinhdoChinhtri.findIndex(r => r.id === this.formState.object.id);

        this.dmTrinhdoChinhtriService.edit(this.dmTrinhdoChinhtri[index].id, this.formData.value).subscribe({
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
