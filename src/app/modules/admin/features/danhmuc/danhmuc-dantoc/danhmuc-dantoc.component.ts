import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { DmDantoc } from '@modules/shared/models/danh-muc';
import { DmDantocService } from '@modules/shared/services/dm-dantoc.service';

@Component({
  selector: 'app-danhmuc-dantoc',
  templateUrl: './danhmuc-dantoc.component.html',
  styleUrls: ['./danhmuc-dantoc.component.css']
})
export class DanhmucDantocComponent implements OnInit {

  @ViewChild('FormEdit') FormEdit: TemplateRef<any>;
  search: string = '';
  dmDantoc: DmDantoc[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DmDantoc | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ten_dantoc: ['', [Validators.required]],
  });
  constructor(
    private dmDantocService: DmDantocService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.dmDantocService.list(1, filter).subscribe({
      next: danhSachDantoc => {
        this.dmDantoc = danhSachDantoc;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }


  async btnDelete(dmDantoc: DmDantoc) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.dmDantocService.delete(dmDantoc.id).subscribe({
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
  changeInputMode(formType: 'add' | 'edit', object: DmDantoc | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm dân tộc ' : 'Cập nhật dân tộc';
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
        ten_chucdanh: object?.ten_dantoc,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DmDantoc) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.dmDantocService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ten_dantoc: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dmDantoc.findIndex(r => r.id === this.formState.object.id);

        this.dmDantocService.edit(this.dmDantoc[index].id, this.formData.value).subscribe({
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


