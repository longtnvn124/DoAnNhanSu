import { DmPhongban } from './../../../../shared/models/danh-muc';
import { DmPhongbanService } from './../../../../shared/services/dm-phongban.service';
import { NsPermissions } from './../../../../shared/models/nhan-su';
import { HtBdDanhsachService } from '@modules/shared/services/ht-bd-danhsach.service';
import { HoSoHocTap } from './../../../../shared/models/hoctap-boiduong';
import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';

@Component({
  selector: 'app-danhsach-hoctap-boiduong',
  templateUrl: './danhsach-hoctap-boiduong.component.html',
  styleUrls: ['./danhsach-hoctap-boiduong.component.css']
})
export class DanhsachHoctapBoiduongComponent implements OnInit {
  @Input() permission: NsPermissions = { isExpert: false, canAdd: true, canEdit: false, canDelete: false }
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';
  hoSoHocTap: HoSoHocTap[];
  hoSo_backup: HoSoHocTap[];
  dmPhongban: DmPhongban[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: HoSoHocTap | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  trangthai = [
    { label: 'Đang chờ duyệt', value: 0 },
    { label: 'Đã phê duyệt', value: 1 },
  ]
  showStatus(data) {
    data.forEach((f, key) => {
      if (f.trangthai == 1) {
        f['bg_trangthai'] = 'bg-green-500';
        f['trangthai_label'] = 'Đã phê duyệt';

      }
      else if (f.trangthai == 0) {
        f['bg_trangthai'] = 'bg-yellow-500';
        f['trangthai_label'] = 'Chờ duyệt';
      }
    })

  }

  formData: FormGroup = this.formBuilder.group({
    ma_kehoach: ['', [Validators.required]],
    hoten: ['', [Validators.required]],
    ngaysinh: ['', [Validators.required]],
    phongban: ['', [Validators.required]],
    trangthai: 0,
  });


  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private htBdDanhsachService: HtBdDanhsachService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) { this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData()); }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.param_id = this.auth.decryptData(params['code']);
      }
      );
    this.loadData();
    this.getDvPhongBan();
  }
  loadData() {
    this.hoSo_backup = [];
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.htBdDanhsachService.list(1, filter).subscribe({
      next: dsDoiTuong => {
        this.notificationService.isProcessing(false);
        this.hoSoHocTap = dsDoiTuong;
        console.log(dsDoiTuong);

        this.showStatus(dsDoiTuong);

      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  getDvPhongBan() {
    this.notificationService.isProcessing(true);
    this.htBdDanhsachService.getdata_phongban().subscribe({
      next: dsDvPhongBan => {
        this.notificationService.isProcessing(false)
        this.dmPhongban = dsDvPhongBan;
      }, error: () => {
        this.notificationService.isProcessing(false);
      }
    })
  }
  async btnDelete(hoSoHocTap: HoSoHocTap) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.htBdDanhsachService.delete(hoSoHocTap.id).subscribe({
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
      size: 700,
    })
  }

  changeInputMode(formType: 'add' | 'edit', object: HoSoHocTap | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm hồ sơ' : 'Cập nhật hồ sơ';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_kehoach: this.param_id,
          hoten: '',
          ngaysinh: '',
          phongban: '',
          trangthai: 0,
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_kehoach: object.ma_kehoach,
        hoten: object.hoten,
        ngaysinh: object.ngaysinh,
        phongban: object.phongban,
        trangthai: object.trangthai,
      })
    }
  }
  btnAdd() {
    console.log('child');

    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: HoSoHocTap) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }

  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.htBdDanhsachService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thêm thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.hoSoHocTap.findIndex(r => r.id === this.formState.object.id);

        this.htBdDanhsachService.edit(this.hoSoHocTap[index].id, this.formData.value).subscribe({
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
  formCancel() {
    this.notificationService.closeSideNavigationMenu();
  }

  // accept per

  backupRove() {
    if (this.hoSo_backup.length) {

      this.notificationService.isProcessing(true);
      let i = 0;
      this.hoSo_backup.forEach((f, key) => {
        setTimeout(() => {
          this.htBdDanhsachService.edit(f.id, { trangthai: 0 }).subscribe(
            () => {
              i += 1;
              if (i == this.hoSo_backup.length) {
                this.notificationService.toastSuccess('Thành công');
                this.loadData();
                this.notificationService.isProcessing(false);
              }
            }, () => {
              i += 1;
              if (i === this.hoSo_backup.length) {
                this.notificationService.toastSuccess('Thành công');
                this.loadData();
                this.notificationService.isProcessing(false);
              }
            }
          )
        })
      })
    }
  }

  appRove() {
    if (this.hoSo_backup.length) {
      this.notificationService.isProcessing(true);
      let i = 0;
      this.hoSo_backup.forEach((f, key) => {
        setTimeout(() => {
          this.htBdDanhsachService.edit(f.id, { trangthai: 1 }).subscribe(() => {
            i += 1;
            if (i === this.hoSo_backup.length) {
              this.notificationService.toastSuccess('Thành công');
              this.loadData();
              this.notificationService.isProcessing(false);
            }
          }, () => {
            i += 1;
            if (i === this.hoSo_backup.length) {
              this.notificationService.toastSuccess('Thành công');
              this.loadData();
              this.notificationService.isProcessing(false);
            }
          }
          )
        }, 50 * key
        )
      })
    } else {
      this.notificationService.alertInfo("Thông báo", "không có yêu cầu được chọn")
    }
  }



}
