import { NsPermissions } from './../../../../shared/models/nhan-su';
import { ExportExcelService } from './../../../../shared/services/export-excel.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DanhSachQuyHoach } from './../../../../shared/models/quy-hoach';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { QhDanhsachService } from '@modules/shared/services/qh-danhsach.service';
import { NotificationService } from '@core/services/notification.service';
import { HelperService } from '@core/services/helper.service';
import { AuthService } from '@core/services/auth.service';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { FileService } from '@core/services/file.service';
import { OvicFile } from '@core/models/file';

@Component({
  selector: 'app-danhsach-quyhoach',
  templateUrl: './danhsach-quyhoach.component.html',
  styleUrls: ['./danhsach-quyhoach.component.css']
})
export class DanhsachQuyhoachComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  @ViewChild('fileChooser') fileChooser: ElementRef<HTMLInputElement>;
  fileUploaded: OvicFile[] = [];
  uploadedFiles: any[] = [];

  ma_ns_auto: string = '';

  search: string = '';

  danhSachQuyHoach: DanhSachQuyHoach[];

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DanhSachQuyHoach | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ma_quyhoach: ['', [Validators.required]],
    ten_quyhoach: ['', [Validators.required]],
    noidung_quyhoach: ['', [Validators.required]],
    nguoi_ky: ['', [Validators.required]],
    ngay_banhanh: ['', [Validators.required]],
    dot: ['', [Validators.required]],
    nhiem_ky: ['', [Validators.required]],
    file_quyetdinh: []
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private qhDanhsachService: QhDanhsachService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private router: Router,
    private auth: AuthService,
    private fileService: FileService,
    private exportExcelService: ExportExcelService,

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
    this.permission.isExpert = this.auth.roles.reduce((isExpert, role) => isExpert || role === 'dans_lanh_dao', false);
    this.permission.canAdd = this.permission.isExpert;
    this.permission.canDelete = this.permission.isExpert;
    this.permission.canEdit = this.permission.isExpert;
    this.loadData();

  }
  searchData() {
    this.OBSERVER_SEARCH_DATA.next(this.search);
  }

  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.qhDanhsachService.list(1, filter).subscribe({
      next: danhSachquyhoach => {
        this.danhSachQuyHoach = danhSachquyhoach;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(danhSachQuyHoach: DanhSachQuyHoach) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.qhDanhsachService.delete(danhSachQuyHoach.id).subscribe({
        next: () => {
          this.notificationService.isProcessing(false);
          this.loadData();
        },
        error: () => {
          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao tác thất bại');
        }
      });
    }
  }

  onOpenFormEdit() {
    setTimeout(() => this.notificationService.openSideNavigationMenu({ template: this.nsFormEdit, size: 600 }), 100);
  }

  changeInputMode(formType: 'add' | 'edit', object: DanhSachQuyHoach | null = null) {
    this.fileUploaded = [];
    this.formState.formTitle = formType === 'add' ? 'Thêm quyết định quy hoạch' : 'Cập nhật quyết định quy hoạch';
    this.formState.formType = formType;
    if (formType === 'add') {
      this.formData.reset(
        {
          ma_quyhoach: '',
          ten_quyhoach: '',
          noidung_quyhoach: '',
          nguoi_ky: '',
          ngay_banhanh: '',
          dot: '',
          nhiem_ky: '',
          file_quyetdinh: [],
        }
      );
    } else {
      this.formState.object = object;
      this.formData.reset(
        {
          ma_quyhoach: object.ma_quyhoach,
          ten_quyhoach: object.ten_quyhoach,
          noidung_quyhoach: object.noidung_quyhoach,
          nguoi_ky: object.nguoi_ky,
          ngay_banhanh: object.ngay_banhanh,
          dot: object.dot,
          nhiem_ky: object.nhiem_ky,
          file_quyetdinh: object.file_quyetdinh
        }
      );

      this.fileUploaded = object.file_quyetdinh && object.file_quyetdinh.length ? object.file_quyetdinh : [];
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode('add');
  }
  btnEdit(object: DanhSachQuyHoach) {
    this.changeInputMode('edit', object);
    this.onOpenFormEdit();
  }
  updateForm() {
    if (this.formData.valid) {
      // const getMa_ns = 'ns'+ {''}
      // this.formData.get('ma_ns').setValue(getMa_ns)
      if (this.formState.formType === "add") {
        this.notificationService.isProcessing(true);
        this.qhDanhsachService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");
            this.formData.reset({});
            this.loadData();
            this.fileUploaded = [];
          }, error: () => {
            this.notificationService.toastError("Thêm nhân sự thất bại");
            this.notificationService.isProcessing(false);
          }
        })

      } else {
        this.notificationService.isProcessing(true);
        const index = this.danhSachQuyHoach.findIndex(r => r.id === this.formState.object.id);
        console.log(this.danhSachQuyHoach[index].id);
        this.qhDanhsachService.edit(this.danhSachQuyHoach[index].id, this.formData.value).subscribe({
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
    } else {
      this.notificationService.toastError("Lỗi nhập liệu");

    }
  }
  btnCancel() {
    this.notificationService.closeSideNavigationMenu();
  }

  btnDetail(object: DanhSachQuyHoach) {
    const code = this.auth.encryptData(`${object.ma_quyhoach}`);
    this.router.navigate(['admin/quyhoach/chitiet-quyhoach'], { queryParams: { code } });
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
          this.formData.get('file_quyetdinh').setValue(files);
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
  deleteFile(file: OvicFile) {
    this.fileService.deleteFile(file.id).subscribe({
      next: () => {
        this.fileUploaded = this.fileUploaded.filter(f => f.id !== file.id);
        this.formData.get('file_quyetdinh').setValue(this.fileUploaded);
        this.notificationService.toastSuccess('xoá thành công');
      }, error: () => {
        this.notificationService.toastError('xoá file thất bại');
      }
    });
  }

  // filter-thông kê
  filter_nhiemky = [
    { label: '2021 - 2022', value: '2021 - 2022' },
    { label: '2022 - 2023', value: '2022 - 2023' },
    { label: '2023 - 2024', value: '2023 - 2024' },
  ];

  onChangeDrp1({ value }: { value: any }) {

    if (value) {
      console.log(value);

      this.search = value;
      console.log(this.search);
      this.loadData();

    } else {
      this.search = '';
      this.loadData();
    }
  }

  // export excel
  columns = [
    'Id',
    'Mã số quyết định',
    'Tên quyết định quy hoạch',
    'Nội dung',
    'Người duyệt',
    'Ngày ban hành',
    'Đợt',
    'Nhiệm kỳ',
  ]
  exportExcel() {
    this.exportExcelService.exportAsExcelFile('Danh sách Quy hoạch', '', this.columns,
    this.danhSachQuyHoach.map(({ id, ma_quyhoach, ten_quyhoach, noidung_quyhoach, nguoi_ky, ngay_banhanh, dot, nhiem_ky }) => ({ id, ma_quyhoach, ten_quyhoach, noidung_quyhoach, nguoi_ky, ngay_banhanh, dot, nhiem_ky })), 'dsQuyHoach', 'Sheet1');
  }



}


