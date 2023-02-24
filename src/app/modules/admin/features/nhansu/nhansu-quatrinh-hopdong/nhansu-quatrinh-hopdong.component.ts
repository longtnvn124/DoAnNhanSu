import { NsQuatrinhHopdongService } from './../../../../shared/services/ns-quatrinh-hopdong.service';
import { NsQuatrinhHopdong } from './../../../../shared/models/ns-quatrinh';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NsPermissions } from '@modules/shared/models/nhan-su';

@Component({
  selector: 'app-nhansu-quatrinh-hopdong',
  templateUrl: './nhansu-quatrinh-hopdong.component.html',
  styleUrls: ['./nhansu-quatrinh-hopdong.component.css']
})
export class NhansuQuatrinhHopdongComponent implements OnInit {
  @Input() permission: NsPermissions = { isExpert: false, canAdd: false, canEdit: false, canDelete: false}
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';

  nsQuatrinhHopdong: NsQuatrinhHopdong[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsQuatrinhHopdong | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  thoihan_hopdong = [
    { label: '1 năm', value: '1 năm' },
    { label: 'Không thời hạn', value: 'Không thời hạn' },
  ];
  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    ten_hopdong: ['', [Validators.required]],
    ngay_ky: ['', [Validators.required]],
    ngay_hethan: [''],
    thoihan_hopdong: ['', [Validators.required]],
  });

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private nsQuatrinhHopdongService: NsQuatrinhHopdongService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) { this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData()); }


  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        // console.log(params);
        this.param_id = this.auth.decryptData(params['code']);
        // console.log(this.param_id);
      }
      );
    this.loadData();

  }

  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsQuatrinhHopdongService.list(1, filter).subscribe({
      next: dsQuatrinhHopdong => {
        this.nsQuatrinhHopdong = dsQuatrinhHopdong;
        this.notificationService.isProcessing(false);

        // console.log(dsQuatrinhHopdong);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(nsQuatrinhHopdong: NsQuatrinhHopdong) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsQuatrinhHopdongService.delete_Hopdong(nsQuatrinhHopdong.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsQuatrinhHopdong | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm quá trình hợp đồng' : 'Cập nhật hợp đồng';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          ten_hopdong: '',
          ngay_ky: '',
          ngay_hethan: '',
          thoihan_hopdong: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        ten_hopdong: object?.ten_hopdong,
        ngay_ky: object?.ngay_ky,
        ngay_hethan: object?.ngay_hethan,
        thoihan_hopdong: object?.thoihan_hopdong,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: NsQuatrinhHopdong) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }

  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsQuatrinhHopdongService.add_Hopdong(this.formData.value).subscribe({
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
        const index = this.nsQuatrinhHopdong.findIndex(r => r.id === this.formState.object.id);

        this.nsQuatrinhHopdongService.edit_Hopdong(this.nsQuatrinhHopdong[index].id, this.formData.value).subscribe({
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

