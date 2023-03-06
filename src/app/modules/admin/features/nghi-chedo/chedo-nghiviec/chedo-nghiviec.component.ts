import { Permission } from '@core/models/auth';
import { OvicFile } from '@core/models/file';
import { NhanSu, NsPermissions } from './../../../../shared/models/nhan-su';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { CheDo_NghiViec } from '@modules/shared/models/nghi-chedo';
import { Subject, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { FileService } from '@core/services/file.service';
import { AuthService } from '@core/services/auth.service';
import { CdNghiviecService } from '@modules/shared/services/cd-nghiviec.service';
import { NhansuService } from '@modules/shared/services/nhansu.service';

@Component({
  selector: 'app-chedo-nghiviec',
  templateUrl: './chedo-nghiviec.component.html',
  styleUrls: ['./chedo-nghiviec.component.css']
})
export class ChedoNghiviecComponent implements OnInit {

  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  @ViewChild('fileChooser') fileChooser: ElementRef<HTMLInputElement>;

  //danhmuc nhân sụ
  dataNhansu: NhanSu[];
  dt_ds_nhansu: NhanSu[];



  //chế độ
  fileUploaded: OvicFile[] = [];
  search: string = '';

  data_CheDo_NghiViec: CheDo_NghiViec[];


  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: CheDo_NghiViec | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }
  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    loai: ['', [Validators.required]],
    tg_batdaunghi: ['', [Validators.required]],
    ngay_duyet: ['', [Validators.required]],
    nguoi_duyet: ['', [Validators.required]],
    file_minhchung: [],
  })

  lydo_nghiviec = [
    { label: 'Nghỉ hưu', value: 'Nghỉ hưu' },
    { label: 'Nghỉ việc', value: 'Nghỉ việc' },
  ]

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private cdNghiviecService: CdNghiviecService,
    private notificationService: NotificationService,
    private fileService: FileService,
    private auth: AuthService,
    private nhansuService : NhansuService


  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());
  }
  permission: NsPermissions = {
    isExpert: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  }

  ngOnInit(): void {
    this.permission.isExpert = this.auth.roles.reduce((isExpert, role) => isExpert || role ==='dans_lanh_dao',false);
    this.permission.canAdd  = this.permission.isExpert;
    this.permission.canEdit  = this.permission.isExpert;
    this.permission.canDelete  = this.permission.isExpert;
    this.loadData();
    this.load_data_CdNghiPhep();

  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    let index = 0;
    forkJoin([
      this.cdNghiviecService.getdata_nhansu(),
      this.cdNghiviecService.list(filter),
    ]).subscribe({
      next: ([data, _count]) => {
        this.notificationService.isProcessing(false);
        this.dataNhansu = data.map(
          r => {
            r['__index'] = ++index;
            r['__count_nghiviec'] = _count.filter(m => m.ma_ns === r.ma_ns).length;
            return r;
          }
        )
        console.log(data);
        console.log(_count);

      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Load dữ liệu thất bại');
      }
    })

  }


  async btnDelete(cheDo_NghiViec: CheDo_NghiViec) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.cdNghiviecService.delete(cheDo_NghiViec.id).subscribe({
        next: () => {
          this.notificationService.isProcessing(false);
          this.loadData();
          this.load_data_CdNghiPhep();
          this.notificationService.toastWarning('Thao tác thành công')

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


  displayMaximizable: boolean = false;
  dataChanged = false;
  public ma_ns_param: string;


  showInfor(id: any) {
    this.ma_ns_param = id;
    console.log(this.ma_ns_param);

    this.dataChanged = false;
    this.displayMaximizable = true;

    this.load_data_CdNghiPhep();
    this.load_data_nhansu();

  }

  changeForm(changed: boolean) {
    if (changed) {
      this.loadData();
    }
  }
  load_data_nhansu() {
    const param_ns = this.ma_ns_param ? { key : 'ma_ns'  , value: this.ma_ns_param.trim() } : null;
    this.nhansuService.list(param_ns).subscribe({
      next: dt_nhansu_param => {
        this.dt_ds_nhansu = dt_nhansu_param;
        console.log(this.dt_ds_nhansu);

      },
      error: () => {
        this.notificationService.toastError('Lỗi không load được nội dung');
      }

    })
  }

  load_data_CdNghiPhep() {
    const code_param = this.ma_ns_param ? { search: this.ma_ns_param.trim() } : null;
    this.notificationService.isProcessing(true);
    this.cdNghiviecService.list(code_param).subscribe({
      next: ds_CheDo_NghiViec => {
        this.data_CheDo_NghiViec = ds_CheDo_NghiViec;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  changeInputMode(formType: 'add' | 'edit', object: CheDo_NghiViec | null = null) {
    this.fileUploaded = [];
    this.formState.formTitle = formType === 'add' ? 'Thêm nghỉ việc' : 'Cập nhật nghỉ việc';
    this.formState.formType = formType;
    if (formType === 'add') {
      this.formData.reset(
        {
          ma_ns: this.ma_ns_param,
          loai: '',
          tg_batdaunghi: '',
          ngay_duyet: '',
          nguoi_duyet: '',
          file_minhchung: [],
        }
      )
    } else {
      this.formState.object = object;
      this.formData.reset({
        ma_ns: this.ma_ns_param,
        loai: object?.loai,
        tg_batdaunghi: object?.tg_batdaunghi,
        ngay_duyet: object?.ngay_duyet,
        nguoi_duyet: object?.nguoi_duyet,
        file_minhchung: object.file_minhchung,
      });
      this.fileUploaded = object.file_minhchung && object.file_minhchung.length ? object.file_minhchung : [];
    }
  }


  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: CheDo_NghiViec) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.cdNghiviecService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");

            this.formData.reset(
              {
                ma_ns: this.ma_ns_param,
                loai_nghiphep: '',
                thoigian_batdau: '',
                thoigian_ketthuc: '',
                ngay_duyet: '',
                nguoi_duyet: '',
                file_minhchung: [],
              }
            )
            this.loadData();
            this.load_data_CdNghiPhep();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.data_CheDo_NghiViec.findIndex(r => r.id === this.formState.object.id);

        this.cdNghiviecService.edit(this.data_CheDo_NghiViec[index].id, this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess('Cập nhật thành công');
            this.loadData();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Cập nhật thất bại ");
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
