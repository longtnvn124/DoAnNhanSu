import { ExportExcelService } from './../../../../shared/services/export-excel.service';
import { OvicFile } from './../../../../../core/models/file';
import { HtBdKehoachService } from './../../../../shared/services/ht-bd-kehoach.service';
import { KeHoacHocTapBoiTuong } from './../../../../shared/models/hoctap-boiduong';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FileService } from '@core/services/file.service';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { NsPermissions } from '@modules/shared/models/nhan-su';

@Component({
  selector: 'app-kehoach-hoctap-boiduong',
  templateUrl: './kehoach-hoctap-boiduong.component.html',
  styleUrls: ['./kehoach-hoctap-boiduong.component.css']
})
export class KehoachHoctapBoiduongComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  @ViewChild('fileChooser') fileChooser: ElementRef<HTMLInputElement>;
  @Input()
  fileUploaded: OvicFile[] = [];
  uploadedFiles: any[] = [];

  search: string = '';
  keHoacHocTapBoiTuong: KeHoacHocTapBoiTuong[];

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: KeHoacHocTapBoiTuong | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ma_kehoach: ['', [Validators.required]],
    ten_kehoach: ['', [Validators.required]],
    noidung_kehoach: ['', [Validators.required]],
    thoigian: ['', [Validators.required]],
    hinhthuc_daotao: ['', [Validators.required]],
    diadiem_daotao: ['', [Validators.required]],
    soluong: ['', [Validators.required]],
    file_kehoach: [[]]
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private htBdKehoachService: HtBdKehoachService,
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
    this.permission.isExpert = this.auth.roles.reduce((isExpert, role) => isExpert || role ==='dans_lanh_dao',false);
    this.permission.canAdd  = this.permission.isExpert;
    this.permission.canEdit  = this.permission.isExpert;
    this.permission.canDelete  = this.permission.isExpert;
    this.loadData();

  }
  searchData() {
    this.OBSERVER_SEARCH_DATA.next(this.search);
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.htBdKehoachService.list(1, filter).subscribe({
      next: danhSachkehoach => {
        this.keHoacHocTapBoiTuong = danhSachkehoach;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(keHoacHocTapBoiTuong: KeHoacHocTapBoiTuong) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.htBdKehoachService.delete(keHoacHocTapBoiTuong.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: KeHoacHocTapBoiTuong | null = null) {
    this.fileUploaded = [];
    this.formState.formTitle = formType === 'add' ? 'Thêm kế hoạch' : 'Cập nhật kế hoạch';
    this.formState.formType = formType;
    if (formType === 'add') {
      this.formData.reset(
        {
          ma_kehoach: '',
          ten_kehoach: '',
          noidung_kehoach: '',
          thoigian: '',
          hinhthuc_daotao: '',
          diadiem_daotao: '',
          soluong: '',
          file_kehoach: []
        }
      );
    } else {
      this.formState.object = object;
      console.log(object);

      this.formData.reset(
        {
          ma_kehoach: object.ma_kehoach,
          ten_kehoach: object.ten_kehoach,
          noidung_kehoach: object.noidung_kehoach,
          thoigian: object.thoigian,
          hinhthuc_daotao: object.hinhthuc_daotao,
          diadiem_daotao: object.diadiem_daotao,
          soluong: object.soluong,
          file_kehoach: object.file_kehoach
        }
      );
      this.fileUploaded = object.file_kehoach && object.file_kehoach.length ? object.file_kehoach : [];
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode('add');
  }
  btnEdit(object: KeHoacHocTapBoiTuong) {
    this.changeInputMode('edit', object);
    this.onOpenFormEdit();
  }
  updateForm() {
    if (this.formData.valid) {
      // const getMa_ns = 'ns'+ {''}
      // this.formData.get('ma_ns').setValue(getMa_ns)
      if (this.formState.formType === "add") {
        this.notificationService.isProcessing(true);
        this.htBdKehoachService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");
            this.formData.reset({});
            this.loadData();
            this.fileUploaded = [];
          }, error: () => {
            this.notificationService.toastError("Thêm thất bại");
            this.notificationService.isProcessing(false);
          }
        })

      } else {
        this.notificationService.isProcessing(true);
        const index = this.keHoacHocTapBoiTuong.findIndex(r => r.id === this.formState.object.id);
        console.log(this.keHoacHocTapBoiTuong[index].id);
        this.htBdKehoachService.edit(this.keHoacHocTapBoiTuong[index].id, this.formData.value).subscribe({
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

  btnDetail(object: KeHoacHocTapBoiTuong) {
    const code = this.auth.encryptData(`${object.ma_kehoach}`);
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['admin/nhansu/them-nhansu'], { queryParams: { code } })
    // );
    // window.open(url, '_blank');
    this.router.navigate(['admin/hoctap-boiduong/chitiet-kehoach'], { queryParams: { code } });
    // console.log(code);
    // this.auth.decryptData(code);
    // console.log(this.auth.decryptData(code));
  }


  myUploader() {
    this.fileChooser.nativeElement.click();
  }
  fileChnages(event) {
    this.fileUploaded = [];
    if (event.target.files && event.target.files.length) {
      this.fileService.uploadFiles(event.target.files, this.auth.userDonViId, this.auth.user.id).subscribe({
        next: files => {
          this.formData.get('file_kehoach').setValue(files);
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
  // export file
  columns = [
    'Id',
    'Mã số kế hoạch',
    'Tên kế hoạch',
    'Nội dung',
    'Thời gian đào tạo',
    'Hình thức đạo tạo',
    'Nơi đào tạo',
    'Số lượng đào tạo',

  ]
  exportExcel() {
    this.exportExcelService.exportAsExcelFile('Kế hoạch học tập bồi dưỡng', '', this.columns, this.keHoacHocTapBoiTuong.map(({ id, ma_kehoach, ten_kehoach, noidung_kehoach, thoigian, hinhthuc_daotao, diadiem_daotao, soluong }) => ({ id, ma_kehoach, ten_kehoach, noidung_kehoach, thoigian, hinhthuc_daotao, diadiem_daotao, soluong })), 'Kh-hoctap-boiduong', 'Sheet1');
  }

}








