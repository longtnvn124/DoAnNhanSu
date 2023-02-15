import { ActivatedRoute } from '@angular/router';
import { NsKhenthuongKyluatService } from './../../../../shared/services/ns-khenthuong-kyluat.service';
import { NsKhenthuong_Kyluat } from './../../../../shared/models/ns-quatrinh';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { OvicFile } from '@core/models/file';
import { FileService } from '@core/services/file.service';

@Component({
  selector: 'app-nhansu-khenthuong-kyluat',
  templateUrl: './nhansu-khenthuong-kyluat.component.html',
  styleUrls: ['./nhansu-khenthuong-kyluat.component.css']
})
export class NhansuKhenthuongKyluatComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  @ViewChild('fileChooser') fileChooser: ElementRef<HTMLInputElement>;

  search: string = '';
  param_id: string = '';
  nsKhenthuong_Kyluat: NsKhenthuong_Kyluat[];
  fileUploaded: OvicFile[] = [];

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsKhenthuong_Kyluat | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ma_ns: '',
    phanloai: '',
    ten: '',
    so_quyetdinh: '',
    ngaythang: '',
    file_minhchung: [],
  });


  // filter-thông kê
  phanloai = [
    { label: 'Khen thưởng', value: 'Khen thưởng' },
    { label: 'Kỷ luật', value: 'Kỷ luật' },
  ];
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(private formBuilder: FormBuilder,
    private nsKhenthuongKyluatService: NsKhenthuongKyluatService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private fileService: FileService,

  ) { this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData()); }


  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.param_id = this.auth.decryptData(params['code']);
      }
      );
      console.log(this.param_id);

    this.loadData();
  }

  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsKhenthuongKyluatService.list(1, filter).subscribe({
      next: dsnsKhenthuong_Kyluat => {
        this.nsKhenthuong_Kyluat = dsnsKhenthuong_Kyluat;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async btnDelete(nsKhenthuong_Kyluat: NsKhenthuong_Kyluat) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsKhenthuongKyluatService.delete(nsKhenthuong_Kyluat.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsKhenthuong_Kyluat | null = null) {
    this.fileUploaded = [];

    this.formState.formTitle = formType === 'add' ? 'Thêm Khen thưởng(Kỷ luật)' : 'Sửa Khen thưởng(Kỷ luật)';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          phanloai: '',
          ten: '',
          so_quyetdinh: '',
          ngaythang: '',
          file_minhchung: [],
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object.ma_ns,
        phanloai: object.phanloai,
        ten: object.ten,
        so_quyetdinh: object.so_quyetdinh,
        ngaythang: object.ngaythang,
        file_minhchung: object.file_minhchung,
      });
      this.fileUploaded = object.file_minhchung && object.file_minhchung.length ? object.file_minhchung : [];
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: NsKhenthuong_Kyluat) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }

  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsKhenthuongKyluatService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                phanloai: '',
                ten: '',
                so_quyetdinh: '',
                ngaythang: '',
                file_minhchung: [],
              }
            )
            this.fileUploaded = [];

          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.nsKhenthuong_Kyluat.findIndex(r => r.id === this.formState.object.id);

        this.nsKhenthuongKyluatService.edit(this.nsKhenthuong_Kyluat[index].id, this.formData.value).subscribe({
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

  // file upload
  myUploader() {
    this.fileChooser.nativeElement.click();
  }
  fileChnages(event) {
    this.fileUploaded = [];
    if (event.target.files && event.target.files.length) {
      this.fileService.uploadFiles(event.target.files, this.auth.userDonViId, this.auth.user.id).subscribe({
        next: files => {
          this.formData.get('file_minhchung').setValue(files);
          this.fileUploaded = files;
          event.target.files = null;
          console.log(files);
          this.notificationService.toastSuccess("Upload file thành công");
        },
        error: () => {
          this.notificationService.toastError("Upload file thất bại");
        }
      });
    }

  }

  downloadFile(file: OvicFile) {
    this.fileService.downloadWithProgress(file.id, file.title).subscribe();
  }

  openFilre(file: OvicFile) {
    this.fileService.getImageContent(file.id.toString(10)).subscribe({
      next: blob => {
        window.open(blob, '_blank',);

      },
      error: () => { },
    });

  }
  deleteFile(file: OvicFile) {
    this.fileService.deleteFile(file.id).subscribe({
      next: () => {
        this.fileUploaded = this.fileUploaded.filter(f => f.id !== file.id);
        this.formData.get('file_minhchung').setValue(this.fileUploaded);
        this.notificationService.toastSuccess('xoá thành công');
      }, error: () => {
        this.notificationService.toastError('xoá file thất bại');
      }
    });
  }
}
