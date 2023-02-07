import { ExportExcelService } from './../../../../shared/services/export-excel.service';
;
import { DmPhongban, DmDantoc, DmTongiao, DmChucdanh, DmChucvu, DmTrinhdoVanhoa, DmTrinhdoChinhtri } from './../../../../shared/models/danh-muc';

import { NhanSu } from '@modules/shared/models/nhan-su';

import { NhansuService } from './../../../../shared/services/nhansu.service';
import { debounceTime, distinctUntilChanged, Subject, async, forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

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
  dmTrinhdoVanhoa: DmTrinhdoVanhoa[];
  dmTrinhdoChinhtri: DmTrinhdoChinhtri[];



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
    'Tên khác',
    'Giới tính',
    'Ngày sinh',
    'Nơi sinh',
    'Quê quán',
    'Nơi thường trú',
    'Nơi ở hiện tại',
    'Điện thoại',
    'Email',
    'Dân tộc',
    'Tôn giáo',
    'Công việc tuyển dụng',
    'Ngày tuyển dụng',
    'Cơ quan tuyển dụng',
    'Chức danh',
    'Chức vụ',
    'Công việc chính ',
    'Ngạch Công chức',
    'Mã ngạch',
    'Bậc lương ',
    'Hệ số ',
    'Ngày hưởng ',
    'Phụ cấp chức vụ',
    'Phụ cấp khác',
    'Trình độ Phổ thông',
    'Trình độ chuo',
    'Trình độ Chuyên môn',
    'Trình độ Lý luận chính trị',
    'Quản lý nhà nước',
    'Ngoại ngữ',
    'Tin học',
    'Ngày vào Đảng Công sản Việt Nam',
    'Ngày Chính thức ',
    'Ngày Nhập ngũ',
    'Ngày xuất ngũ',
    'Quân hàm ',
    'Danh hiệu cao nhất ',
    'Sở trường công tác',
    'Khen thưởng',
    'Kỷ luật',
    'Tình trạng sức khoẻ',
    'Chiều cao',
    'Cân nặng',
    'Nhóm máu',
    'Hạng Thương binh',
    'Con gia đình chính sách',
    'Sô Cân Cước công Dân ',
    'Ngày Cấp',
    'Số sổ bảo hiểm xã hội',
    'Phòng ban'



  ]
  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    hoten: ['', [Validators.required]],
    hoten_khac: [''],
    gioitinh: ['', [Validators.required]],
    ngaysinh: ['', [Validators.required]],
    noisinh: ['', [Validators.required]],
    quequan: ['', [Validators.required]],
    noithuongtru: ['', [Validators.required]],
    noiohientai: ['', [Validators.required]],
    dienthoai: ['', [Validators.required]],
    dantoc: ['', [Validators.required]],
    email: ['', [Validators.required]],
    tongiao: ['', [Validators.required]],
    congviec_tuyendung: ['', [Validators.required]],
    ngay_tuyendung: ['', [Validators.required]],
    coquan_tuyendung: ['', [Validators.required]],
    chucdanh: ['', [Validators.required]],
    chucvu: ['', [Validators.required]],
    congviec_chinh: ['', [Validators.required]],
    ngach_congchuc: ['', [Validators.required]],
    ma_ngach: ['', [Validators.required]],
    bacluong: ['', [Validators.required]],
    heso: ['', [Validators.required]],
    ngay_huong: ['', [Validators.required]],
    phucap_chucvu: ['' ],
    phucap_khac: [''],
    trinhdo_phothong: ['', [Validators.required]],
    trinhdo_chuyenmon: ['', [Validators.required]],
    lyluan_chinhtri: [''],
    quanly_nhanuoc: [''],
    ngoaingu: [''],
    tinhoc: [''],
    ngay_vaoDang: [''],
    Ngay_chinhthuc: [''],
    ngay_chinhtrixahoi: [''],
    ngay_nhapngu: [''],
    ngay_xuatngu: [''],
    quanham: [''],
    danhhieu_caonhat: [''],
    sotruong_congtac: [''],
    khenthuong: [''],
    kyluat: [''],
    tinhtrang_suckhoe: [''],
    chieucao: [''],
    cannang: [''],
    nhommau: [''],
    hang_thuongbinh: [''],
    giadinh_chinhsach: [''],
    so_cccd: [''],
    ngaycap: [''],
    so_bhxh: [''],
    phongban: [''],
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
    private exportExcelService: ExportExcelService

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
        this.data_ns.forEach((f) => {
          this.ma_ns_auto = 'ns' + [f.id + 1];
          console.log(this.ma_ns_auto);

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
          hoten_khac: '',
          gioitinh: '',
          ngaysinh: '',
          noisinh: '',
          quequan: '',
          noithuongtru: '',
          noiohientai: '',
          dienthoai: '',
          dantoc: '',
          email: '',
          tongiao: '',
          congviec_tuyendung: '',
          ngay_tuyendung: '',
          coquan_tuyendung: '',
          chucdanh: '',
          chucvu: '',
          congviec_chinh: '',
          ngach_congchuc: '',
          ma_ngach: '',
          bacluong: '',
          heso: '',
          ngay_huong: '',
          phucap_chucvu: '',
          phucap_khac: '',
          trinhdo_phothong: '',
          trinhdo_chuyenmon: '',
          lyluan_chinhtri: '',
          quanly_nhanuoc: '',
          ngoaingu: '',
          tinhoc: '',
          ngay_vaoDang: '',
          Ngay_chinhthuc: '',
          ngay_chinhtrixahoi: '',
          ngay_nhapngu: '',
          ngay_xuatngu: '',
          quanham: '',
          danhhieu_caonhat: '',
          sotruong_congtac: '',
          khenthuong: '',
          kyluat: '',
          tinhtrang_suckhoe: '',
          chieucao: '',
          cannang: '',
          nhommau: '',
          hang_thuongbinh: '',
          giadinh_chinhsach: '',
          so_cccd: '',
          ngaycap: '',
          so_bhxh: '',
          phongban: '',
        }
      );
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset(
        {
          ma_ns: this.ma_ns_auto,
          hoten: object.hoten,
          hoten_khac: object.hoten_khac,
          gioitinh: object.gioitinh,
          ngaysinh: object.ngaysinh,
          noisinh: object.noisinh,
          quequan: object.quequan,
          noithuongtru: object.noithuongtru,
          noiohientai: object.noiohientai,
          dienthoai: object.dienthoai,
          dantoc: object.dantoc,
          email: object.email,
          tongiao: object.tongiao,
          congviec_tuyendung: object.congviec_tuyendung,
          ngay_tuyendung: object.ngay_tuyendung,
          coquan_tuyendung: object.coquan_tuyendung,
          chucdanh: object.chucdanh,
          chucvu: object.chucvu,
          congviec_chinh: object.congviec_chinh,
          ngach_congchuc: object.ngach_congchuc,
          ma_ngach: object.ma_ngach,
          bacluong: object.bacluong,
          heso: object.heso,
          ngay_huong: object.ngay_huong,
          phucap_khac: object.phucap_khac,
          trinhdo_phothong: object.trinhdo_phothong,
          trinhdo_chuyenmon: object.trinhdo_chuyenmon,
          lyluan_chinhtri: object.lyluan_chinhtri,
          quanly_nhanuoc: object.quanly_nhanuoc,
          ngoaingu: object.ngoaingu,
          tinhoc: object.tinhoc,
          ngay_vaoDang: object.ngay_vaoDang,
          Ngay_chinhthuc: object.Ngay_chinhthuc,
          ngay_chinhtrixahoi: object.ngay_chinhtrixahoi,
          ngay_nhapngu: object.ngay_nhapngu,
          ngay_xuatngu: object.ngay_xuatngu,
          quanham: object.quanham,
          danhhieu_caonhat: object.danhhieu_caonhat,
          sotruong_congtac: object.sotruong_congtac,
          khenthuong: object.khenthuong,
          kyluat: object.kyluat,
          tinhtrang_suckhoe: object.tinhtrang_suckhoe,
          chieucao: object.chieucao,
          cannang: object.cannang,
          nhommau: object.nhommau,
          hang_thuongbinh: object.hang_thuongbinh,
          giadinh_chinhsach: object.giadinh_chinhsach,
          so_cccd: object.so_cccd,
          ngaycap: object.ngaycap,
          so_bhxh: object.so_bhxh,
          phongban: object.phongban,
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
                hoten_khac: '',
                gioitinh: '',
                ngaysinh: '',
                noisinh: '',
                quequan: '',
                noithuongtru: '',
                noiohientai: '',
                dienthoai: '',
                dantoc: '',
                email: '',
                tongiao: '',
                congviec_tuyendung: '',
                ngay_tuyendung: '',
                coquan_tuyendung: '',
                chucdanh: '',
                chucvu: '',
                congviec_chinh: '',
                ngach_congchuc: '',
                ma_ngach: '',
                bacluong: '',
                heso: '',
                ngay_huong: '',
                phucap_chucvu: '',
                phucap_khac: '',
                trinhdo_phothong: '',
                trinhdo_chuyenmon: '',
                lyluan_chinhtri: '',
                quanly_nhanuoc: '',
                ngoaingu: '',
                tinhoc: '',
                ngay_vaoDang: '',
                Ngay_chinhthuc: '',
                ngay_chinhtrixahoi: '',
                ngay_nhapngu: '',
                ngay_xuatngu: '',
                quanham: '',
                danhhieu_caonhat: '',
                sotruong_congtac: '',
                khenthuong: '',
                kyluat: '',
                tinhtrang_suckhoe: '',
                chieucao: '',
                cannang: '',
                nhommau: '',
                hang_thuongbinh: '',
                giadinh_chinhsach: '',
                so_cccd: '',
                ngaycap: '',
                so_bhxh: '',
                phongban: '',
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
    forkJoin<[DmPhongban[], DmChucdanh[], DmChucvu[], DmDantoc[], DmTongiao[], DmTrinhdoVanhoa[], DmTrinhdoChinhtri[]]>([
      this.nhansuService.getdata_phongban(),
      this.nhansuService.getdata_chucdanh(),
      this.nhansuService.getdata_chucvu(),
      this.nhansuService.getdata_dantoc(),
      this.nhansuService.getdata_tongiao(),
      this.nhansuService.getdata_trinhdo_vanhoa(),
      this.nhansuService.getdata_trinhdo_chinhtri(),
    ]).subscribe({
      next: ([dmPhongban, dmChucdanh, dmChucvu, dmDantoc, dmTongiao, dmTrinhdoVanhoa, dmTrinhdoChinhtri]) => {
        this.dmPhongban = dmPhongban;
        this.dmChucdanh = dmChucdanh;
        this.dmChucvu = dmChucvu;
        this.dmDantoc = dmDantoc;
        this.dmTongiao = dmTongiao;
        this.dmTrinhdoVanhoa = dmTrinhdoVanhoa;
        this.dmTrinhdoChinhtri = dmTrinhdoChinhtri;

        const filterdmPhongban = dmPhongban.map(r => ({ value: r.ten_phongban, type: 'phongban' }));
        const filterdmChucdanh = dmChucdanh.map(r => ({ value: r.ten_chucdanh, type: 'chucdanh' }));
        const filterdmChucvu = dmChucvu.map(r => ({ value: r.ten_chucvu, type: 'chucvu' }));
        const filterdmDantoc = dmDantoc.map(r => ({ value: r.ten_dantoc, type: 'dantoc' }));
        const filterdmTongiao = dmTongiao.map(r => ({ value: r.ten_tongiao, type: 'tongiao' }));
        const filterdmTrinhdoVanhoa = dmTrinhdoVanhoa.map(r => ({ value: r.ten_trinhdo, type: 'trinhdovanhoa' }));
        const filterdmTrinhdoChinhtri = dmTrinhdoChinhtri.map(r => ({ value: r.ten_trinhdo, type: 'trinhdochinhtri' }));
        this.allFilterList = [].concat(filterdmPhongban, filterdmChucdanh, filterdmChucvu, filterdmDantoc, filterdmTongiao, filterdmTrinhdoVanhoa, filterdmTrinhdoChinhtri);
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
    this.exportExcelService.exportAsExcelFile('Danh sách hồ sơ nhân sự', '', this.columns, this.data_ns, 'dsHoSoNhanSu', 'Sheet1');
  }

}
