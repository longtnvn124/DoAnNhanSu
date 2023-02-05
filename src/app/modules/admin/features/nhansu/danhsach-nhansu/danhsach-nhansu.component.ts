import { ExportExcelService } from './../../../../shared/services/export-excel.service';
import { __values } from 'tslib';
import { filter } from 'rxjs/operators';
import { NsTrinhdoTinhoc } from './../../../../shared/models/ns-trinhdo';
import { DmPhongban, DmDantoc, DmTongiao, DmChucdanh, DmChucvu } from './../../../../shared/models/danh-muc';

import { NhanSu } from '@modules/shared/models/nhan-su';
import { Auth } from './../../../../../core/models/auth';
import { FormType } from './../../../../shared/models/ovic-models';
import { HelperService } from './../../../../../core/services/helper.service';
import { DEFAULT_MODAL_OPTIONS } from './../../../../shared/utils/syscat';
import { NhansuService } from './../../../../shared/services/nhansu.service';
import { debounceTime, distinctUntilChanged, Subject, async, forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@core/services/auth.service';

import * as XLSX from 'xlsx';


interface FilterData {
  value: string;
  type: string;
}

@Component({
  selector: 'app-danhsach-nhansu',
  templateUrl: './danhsach-nhansu.component.html',
  styleUrls: ['./danhsach-nhansu.component.css'],


})
export class DanhsachNhansuComponent implements OnInit {
  // @ViewChild("nsFormAdd") nsFormAdd: ElementRef;
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  // danh muc
  dmPhongban: DmPhongban[];
  dmDantoc: DmDantoc[];
  dmTongiao: DmTongiao[];
  dmChucdanh: DmChucdanh[];
  dmChucvu: DmChucvu[];



  // Nhansu

  ma_ns_auto: string = '';

  search: string = '';

  data_ns: NhanSu[];

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NhanSu | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  gioittinh = [
    { label: 'Nam', value: 'Nam' },
    { label: 'Nữ', value: 'Nữ' },
  ];
  columns = [
    'ID',
    'Mã nhân sự',
    'Họ và tên',
    'Giới tính',
    'Ngày sinh',
    'Quê quán',
    'Nơi thường trú',
    'Điện thoại',
    'Email',
    'Chức danh',
    'Chức vụ',
    'Dân tộc',
    'Phòng ban',
    'Tôn giáo'

  ]
  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    hoten: ['', [Validators.required]],
    ngaysinh: ['', [Validators.required]],
    gioitinh: ['', [Validators.required]],
    quequan: ['', [Validators.required]],
    noithuongtru: ['', [Validators.required]],
    dienthoai: ['', [Validators.required]],
    email: ['', [Validators.required]],
    chucdanh: ['', [Validators.required]],
    chucvu: ['', [Validators.required]],
    dantoc: ['', [Validators.required]],
    phongban: ['', [Validators.required]],
    tongiao: ['', [Validators.required]],
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  allFilterList: FilterData[] = [];

  filterList: FilterData[] = [];

  selected: FilterData;

  filterdrp1 = [
    { label: 'Chức vụ', value: 'chucvu' },
    { label: 'Chức danh', value: 'chucdanh' },
    { label: 'Dân tộc', value: 'dantoc' },
    { label: 'Phòng ban', value: 'phongban' },
    { label: 'Tôn giáo', value: 'tongiao' },
    { label: 'Trình độ văn hoá', value: 'trinhdovanhoa' },
    { label: 'Trình độ ngoại ngữ', value: 'trinhdongoaingu' },
    { label: 'Trình độ tin học', value: 'trinhdotinhoc' },
    { label: 'Trình độ lý luận lý chính trị', value: 'trinhdochinhtri' },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private nhansuService: NhansuService,
    private notificationService: NotificationService,
    private router: Router,
    private auth: AuthService,
    private exportExcelService :ExportExcelService

  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());
  }
  __value: any = [];


  ngOnInit(): void {
    this.loadData();
    this.getDanhmuc();
    this.onChangeDrp1(this.__value);
    this.onChangeDrp2(this.__value);

  }

  searchData() {
    this.OBSERVER_SEARCH_DATA.next(this.search);
  }
  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nhansuService.list(1, filter).subscribe({
      next: danhSachNhansu => {
        this.data_ns = danhSachNhansu;
        console.log(this.data_ns);

        this.notificationService.isProcessing(false);
        danhSachNhansu.forEach((f) => {
          this.ma_ns_auto = 'ns' + [f.id + 1];

        })
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async deleteNhansu(nhanSu: NhanSu) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nhansuService.delete_nhansu(nhanSu.id).subscribe({
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
    this.notificationService.openSideNavigationMenu({
      template: this.nsFormEdit,
      size: 700,
    })
  }

  changeInputMode(formType: 'add' | 'edit', object: NhanSu | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm Nhân sự' : 'Cập nhật nhân sự';
    this.notificationService.isProcessing(true);
    // this.showFform();
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.ma_ns_auto,
          hoten: '',
          ngaysinh: '',
          gioitinh: '',
          quequan: '',
          noithuongtru: '',
          dienthoai: '',
          email: '',
          chucdanh: '',
          chucvu: '',
          dantoc: '',
          phongban: '',
          tongiao: '',
        }
      );
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset(
        {
          ma_ns: this.ma_ns_auto,
          hoten: object?.hoten,
          ngaysinh: object?.ngaysinh,
          gioitinh: object?.gioitinh,
          quequan: object?.quequan,
          noithuongtru: object?.noithuongtru,
          dienthoai: object?.dienthoai,
          email: object?.email,
          chucdanh: object?.chucdanh,
          chucvu: object?.chucvu,
          dantoc: object?.dantoc,
          phongban: object?.phongban,
          tongiao: object?.tongiao,
        }
      );
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode('add');
  }
  btnEdit(object: NhanSu) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);

  }
  updateForm() {
    if (this.formData.valid) {
      // const getMa_ns = 'ns'+ {''}
      // this.formData.get('ma_ns').setValue(getMa_ns)
      if (this.formState.formType === "add") {
        this.notificationService.isProcessing(true);
        this.nhansuService.add_nhansu(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");
            this.formData.reset(
              {
                ma_ns: this.ma_ns_auto,
                hoten: '',
                ngaysinh: '',
                gioitinh: 1,
                quequan: '',
                noithuongtru: '',
                dienthoai: '',
                email: '',
                chucdanh: '',
                chucvu: '',
                dantoc: '',
                phongban: '',
                tongiao: '',
              }
            );
            this.loadData();

          }, error: () => {
            this.notificationService.toastError("Thêm nhân sự thất bại");
            this.notificationService.isProcessing(false);
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.data_ns.findIndex(r => r.id === this.formState.object.id);
        this.nhansuService.edit_nhansu(this.data_ns[index].id, this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess('Cập nhật thành công');
            this.loadData();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Cập nhật thất bại thất bại");
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

  btnDetail(object: NhanSu) {
    const code = this.auth.encryptData(`${object.ma_ns}`);
    this.router.navigate(['admin/nhansu/chitiet-nhansu'], { queryParams: { code } });
  }

  getDanhmuc() {

    // dmPhongban: DmPhongban[];
    // dmDantoc: DmDantoc[];
    // dmTongiao: DmTongiao[];
    // dmChucdanh: DmChucdanh[];
    // dmChucvu: DmChucvu[];
    this.notificationService.isProcessing(true);
    forkJoin<[DmPhongban[], DmChucdanh[], DmChucvu[], DmDantoc[], DmTongiao[]]>([
      this.nhansuService.getdata_phongban(),
      this.nhansuService.getdata_chucdanh(),
      this.nhansuService.getdata_chucvu(),
      this.nhansuService.getdata_dantoc(),
      this.nhansuService.getdata_tongiao()
    ]).subscribe({
      next: ([dmPhongban, dmChucdanh, dmChucvu, dmDantoc, dmTongiao]) => {
        this.dmPhongban = dmPhongban;
        this.dmChucdanh = dmChucdanh;
        this.dmChucvu = dmChucvu;
        this.dmDantoc = dmDantoc;
        this.dmTongiao = dmTongiao;

        const filterdmPhongban = dmPhongban.map(r => ({ value: r.ten_phongban, type: 'phongban' }));
        const filterdmChucdanh = dmChucdanh.map(r => ({ value: r.ten_chucdanh, type: 'chucdanh' }));
        const filterdmChucvu = dmChucvu.map(r => ({ value: r.ten_chucvu, type: 'chucvu' }));
        const filterdmDantoc = dmDantoc.map(r => ({ value: r.ten_dantoc, type: 'dantoc' }));
        const filterdmTongiao = dmTongiao.map(r => ({ value: r.ten_tongiao, type: 'tongiao' }));
        this.allFilterList = [].concat(filterdmPhongban, filterdmChucdanh, filterdmChucvu, filterdmDantoc, filterdmTongiao);
        this.notificationService.isProcessing(false)
      }, error: () => {
        this.notificationService.isProcessing(false);
      }
    });
  }

  filterDropdown1 = [
    { label: 'Chức vụ', value: 'Chức vụ', key: 'chucvu' },
    { label: 'Chức danh', value: 'Chức danh', key: 'chucdanh' },
    { label: 'Dân tộc', value: 'Dân tộc', key: 'dantoc' },
    { label: 'Phòng ban', value: 'Phòng ban', key: 'phongban' },
    { label: 'Tôn giáo', value: 'Tôn giáo', key: 'tongiao' },
    { label: 'Trình độ văn hoá', value: 'Trình độ văn hoá', key: 'trinhdovanhoa' },
    { label: 'Trình độ ngoại ngữ', value: 'Trình độ ngoại ngữ', key: 'trinhdongoaingu' },
    { label: 'Trình độ tin học', value: 'Trình độ tin học', key: 'trinhdotinhoc' },
    { label: 'Trình độ lý luận lý chính trị', value: 'Trình độ lý luận lý chính trị', key: 'trinhdochinhtri' },
  ];


  onChangeDrp1({ value }: { value: any }) {
    this.filterList = value ? this.allFilterList.filter(p => p.type === value) : [];
    // console.log(this.filterList);

    if (value) {
      this.filterList = this.allFilterList.filter(p => p.type === value);

    }
    else {
      this.search = '';
      // console.log(this.search);
      this.loadData();
    }

  }

  onChangeDrp2({ value }: { value: FilterData }) {
    if (value) {
      this.search = value.value;
      this.loadData();
    }

  }

  exportExcel() {
    this.exportExcelService.exportAsExcelFile('Danh sách hồ sơ nhân sự','', this.columns, this.data_ns,'dsHoSoNhanSu','Sheet1');
  }

}
