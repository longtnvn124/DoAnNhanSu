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
    { label: 'N???', value: 'N???' },
  ];
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
    { label: 'Ch???c v???', value: 'chucvu' },
    { label: 'Ch???c danh', value: 'chucdanh' },
    { label: 'D??n t???c', value: 'dantoc' },
    { label: 'Ph??ng ban', value: 'phongban' },
    { label: 'T??n gi??o', value: 'tongiao' },
    { label: 'Tr??nh ????? v??n ho??', value: 'trinhdovanhoa' },
    { label: 'Tr??nh ????? ngo???i ng???', value: 'trinhdongoaingu' },
    { label: 'Tr??nh ????? tin h???c', value: 'trinhdotinhoc' },
    { label: 'Tr??nh ????? l?? lu???n l?? ch??nh tr???', value: 'trinhdochinhtri' },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private nhansuService: NhansuService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private router: Router,
    private auth: AuthService
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
        this.notificationService.isProcessing(false);
        danhSachNhansu.forEach((f) => {
          this.ma_ns_auto = 'ns' + [f.id + 1];

        })
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('L???i kh??ng load ???????c n???i dung');
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
          this.notificationService.toastError('Thao t??c th???t b???i');
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
    this.formState.formTitle = formType === 'add' ? 'Th??m Nh??n s???' : 'C???p nh???t nh??n s???';
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
            this.notificationService.toastSuccess("Th??nh c??ng");
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
            this.notificationService.toastError("Th??m nh??n s??? th???t b???i");
            this.notificationService.isProcessing(false);
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.data_ns.findIndex(r => r.id === this.formState.object.id);
        this.nhansuService.edit_nhansu(this.data_ns[index].id, this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess('C???p nh???t th??nh c??ng');
            this.loadData();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("C???p nh???t th???t b???i th???t b???i");
          }
        })
      }
    } else {
      this.notificationService.toastError("L???i nh???p li???u");

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
  exportexcel(): void {
    // pass here the table ID
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    //generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(wb, "ExcelSheet.xlsx");
  }

  filterDropdown1 = [
    { label: 'Ch???c v???', value: 'Ch???c v???', key: 'chucvu' },
    { label: 'Ch???c danh', value: 'Ch???c danh', key: 'chucdanh' },
    { label: 'D??n t???c', value: 'D??n t???c', key: 'dantoc' },
    { label: 'Ph??ng ban', value: 'Ph??ng ban', key: 'phongban' },
    { label: 'T??n gi??o', value: 'T??n gi??o', key: 'tongiao' },
    { label: 'Tr??nh ????? v??n ho??', value: 'Tr??nh ????? v??n ho??', key: 'trinhdovanhoa' },
    { label: 'Tr??nh ????? ngo???i ng???', value: 'Tr??nh ????? ngo???i ng???', key: 'trinhdongoaingu' },
    { label: 'Tr??nh ????? tin h???c', value: 'Tr??nh ????? tin h???c', key: 'trinhdotinhoc' },
    { label: 'Tr??nh ????? l?? lu???n l?? ch??nh tr???', value: 'Tr??nh ????? l?? lu???n l?? ch??nh tr???', key: 'trinhdochinhtri' },
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

}
