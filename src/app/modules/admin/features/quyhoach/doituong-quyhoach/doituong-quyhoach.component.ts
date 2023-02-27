import { DoiTuongQuyHoach } from './../../../../shared/models/quy-hoach';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { NsPermissions } from '@modules/shared/models/nhan-su';
import { QhDoituongService } from '@modules/shared/services/qh-doituong.service';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';

@Component({
  selector: 'app-doituong-quyhoach',
  templateUrl: './doituong-quyhoach.component.html',
  styleUrls: ['./doituong-quyhoach.component.css']
})
export class DoituongQuyhoachComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  @Input() permission: NsPermissions = { isExpert: false, canAdd: false, canEdit: false, canDelete: false}
  search: string = '';
  param_id: string = '';
  doiTuongQuyHoach: DoiTuongQuyHoach[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DoiTuongQuyHoach | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }
  formData: FormGroup = this.formBuilder.group({
    ma_quyhoach: ['', [Validators.required]],
    hoten: ['', [Validators.required]],
    ngaysinh: ['', [Validators.required]],
    chucvu_hientai: ['', [Validators.required]],
    chucvu_quyhoach: ['', [Validators.required]],
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private qhDoituongService: QhDoituongService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) { this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData()); }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        // console.log(params);
        this.param_id = this.auth.decryptData(params['code']);
        console.log(this.param_id);
      }
      );
    this.loadData();
  }
  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.qhDoituongService.list(1, filter).subscribe({
      next: dsDoiTuong => {
        this.doiTuongQuyHoach = dsDoiTuong;
        this.notificationService.isProcessing(false);

        // console.log(dsQuatrinhHopdong);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(doiTuongQuyHoach: DoiTuongQuyHoach) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.qhDoituongService.delete(doiTuongQuyHoach.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: DoiTuongQuyHoach | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm đối tượng quy hoạch' : 'Cập nhật đối tượng quy hoạch';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_quyhoach: this.param_id,
          hoten: '',
          ngaysinh: '',
          chucvu_hientai: '',
          chucvu_quyhoach: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_quyhoach: object.ma_quyhoach,
        hoten: object.hoten,
        ngaysinh: object.ngaysinh,
        chucvu_hientai: object.chucvu_hientai,
        chucvu_quyhoach: object.chucvu_quyhoach,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DoiTuongQuyHoach) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }

  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.qhDoituongService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thêm thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                ten_hopdong: '',
                ngay_ky: '',
                ngay_hethan: '',
                thoihan_hopdong: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.doiTuongQuyHoach.findIndex(r => r.id === this.formState.object.id);

        this.qhDoituongService.edit(this.doiTuongQuyHoach[index].id, this.formData.value).subscribe({
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
