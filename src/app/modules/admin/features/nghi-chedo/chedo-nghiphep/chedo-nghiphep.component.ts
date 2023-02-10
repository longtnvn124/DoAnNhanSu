import { NhanSu } from './../../../../shared/models/nhan-su';
import { CheDo_NghiPhep } from './../../../../shared/models/nghi-chedo';
import { CdNghiphepService } from './../../../../shared/services/cd-nghiphep.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { NotificationService } from '@core/services/notification.service';

import { Subject, distinctUntilChanged, debounceTime, forkJoin } from 'rxjs';
import { OvicFile } from '@core/models/file';
import { FileService } from '@core/services/file.service';
import { AuthService } from '@core/services/auth.service';


@Component({
  selector: 'app-chedo-nghiphep',
  templateUrl: './chedo-nghiphep.component.html',
  styleUrls: ['./chedo-nghiphep.component.css']
})
export class ChedoNghiphepComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  @ViewChild('fileChooser') fileChooser: ElementRef<HTMLInputElement>;

  //danhmuc nhân sụ
  dataNhansu: NhanSu[];


  //chế độ
  fileUploaded: OvicFile[] = [];
  search: string = '';

  data_CheDo_NghiPhep: CheDo_NghiPhep[];


  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: CheDo_NghiPhep | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }
  formData: FormGroup = this.formBuilder.group({
    ma_ns: [''],
    loai_nghiphep: [''],
    thoigian_batdau: [''],
    thoigian_ketthuc: [''],
    ngay_duyet: [''],
    nguoi_duyet: [''],
    file_minhchung: [],
  })

  lydo_nghiphep = [
    { label: 'Nghỉ phép năm', value: 'Nghỉ phép năm' },
    { label: 'Nghỉ ốm đau', value: 'Nghỉ ốm đau' },
    { label: 'Nghỉ con ốm', value: 'Nghỉ con ốm' },
    { label: 'Nghỉ thai', value: 'Nghỉ thai' },
    { label: 'Nghỉ tai nạn lao động hoặc bệnh nghề nghiệp', value: 'Nghỉ tai nạn lao động hoặc bệnh nghề nghiệp' },
    { label: 'Nghỉ kết hôn hoặc con kết hôn', value: 'Nghỉ kết hôn hoặc con kết hôn' },
    { label: 'Nghỉ người thân mất', value: 'Nghỉ người thân mất' },
    { label: 'Nghỉ việc riêng không hưởng lương', value: 'Nghỉ việc riêng không hưởng lương' },
    { label: 'Việc gia đình', value: 'Việc gia đình' },
  ]

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private cdNghiphepService: CdNghiphepService,
    private notificationService: NotificationService,
    private fileService: FileService,
    private auth: AuthService,


  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());
  }
  ngOnInit(): void {
    this.loadData();
    this.load_data_CdNghiPhep();

  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    let index = 0;
    forkJoin([
      this.cdNghiphepService.getdata_nhansu(),
      this.cdNghiphepService.list(filter),
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
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Load dữ liệu thất bại');
      }
    })

  }


  async btnDelete(cheDo_NghiPhep: CheDo_NghiPhep) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.cdNghiphepService.delete(cheDo_NghiPhep.id).subscribe({
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


  displayMaximizable: boolean = false;
  dataChanged = false;
  public ma_ns_param: string;

  load_data_CdNghiPhep(){
    const code_param = this.ma_ns_param ? { search: this.ma_ns_param.trim() } : null;
    this.notificationService.isProcessing(true);
    this.cdNghiphepService.list(code_param).subscribe({
      next: ds_CheDo_NghiPhep => {
        this.data_CheDo_NghiPhep = ds_CheDo_NghiPhep;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  showInfor(id: any) {
    this.ma_ns_param = id;
    console.log(this.ma_ns_param);

    this.dataChanged = false;
    this.displayMaximizable = true;

    this.load_data_CdNghiPhep();


  }

  changeForm(changed: boolean) {
    if (changed) {
      this.loadData();
    }
  }


  changeInputMode(formType: 'add' | 'edit', object: CheDo_NghiPhep | null = null) {
    this.fileUploaded = [];
    this.formState.formTitle = formType === 'add' ? 'Thêm nghỉ phép' : 'Cập nhật nghỉ phép';
    this.formState.formType = formType;
    if (formType === 'add') {
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
    } else {
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object.ma_ns,
        loai_nghiphep: object?.loai_nghiphep,
        thoigian_batdau: object?.thoigian_batdau,
        thoigian_ketthuc: object?.thoigian_ketthuc,
        ngay_duyet: object?.ngay_duyet,
        nguoi_duyet: object?.nguoi_duyet,
        file_minhchung: object?.file_minhchung,
      });
      this.fileUploaded = object.file_minhchung && object.file_minhchung.length ? object.file_minhchung : [];
    }
  }


  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: CheDo_NghiPhep) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.cdNghiphepService.add(this.formData.value).subscribe({
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
            this.load_data_CdNghiPhep();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.data_CheDo_NghiPhep.findIndex(r => r.id === this.formState.object.id);

        this.cdNghiphepService.edit(this.data_CheDo_NghiPhep[index].id, this.formData.value).subscribe({
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
