import { HtBdDanhsachService } from '@modules/shared/services/ht-bd-danhsach.service';
import { HoSoHocTap } from './../../../../shared/models/hoctap-boiduong';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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

  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';
  hoSoHocTap: HoSoHocTap[];
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
  formData: FormGroup = this.formBuilder.group({
    ma_kehoach: ['', [Validators.required]],
    hoten: ['', [Validators.required]],
    ngaysinh: ['', [Validators.required]],
    phongban: ['', [Validators.required]],
    trangthai: ['', [Validators.required]],
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private htBdDanhsachService: HtBdDanhsachService,
    private notificationService: NotificationService,
    private helperService: HelperService,
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
  }
  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.htBdDanhsachService.list(1, filter).subscribe({
      next: dsDoiTuong => {
        this.hoSoHocTap = dsDoiTuong;
        this.notificationService.isProcessing(false);

        // console.log(dsQuatrinhHopdong);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
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
          trangthai: '',
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
                ma_ns: this.param_id,
                hoten: '',
                ngaysinh: '',
                phongban: '',
                trangthai: '',
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

 
}
