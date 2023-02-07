import { NsDetaiKhoahocService } from './../../../../shared/services/ns-detai-khoahoc.service';
import { Subject } from 'rxjs/internal/Subject';
import { DeTaiKhoaHoc } from './../../../../shared/models/ns-detai-khoahoc';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { distinctUntilChanged, debounceTime } from 'rxjs';

@Component({
  selector: 'app-nhansu-detai-khoahoc',
  templateUrl: './nhansu-detai-khoahoc.component.html',
  styleUrls: ['./nhansu-detai-khoahoc.component.css']
})
export class NhansuDetaiKhoahocComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';

  dsDeTaiKhoaHoc: DeTaiKhoaHoc[];

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: DeTaiKhoaHoc | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }
  vaitro = [
    { 'label': 'Chủ trì', 'value': 'Chủ trì' },
    { 'label': 'Chủ trì', 'value': 'Chủ trì' },

  ]
  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    ten_detai: ['', [Validators.required]],
    ngay_batdau: ['', [Validators.required]],
    sothang: ['', [Validators.required]],
    vaitro: ['', [Validators.required]],
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private nsDetaiKhoahocService: NsDetaiKhoahocService,
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

  }

  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsDetaiKhoahocService.list(1, filter).subscribe({
      next: dsDeTaiKhoaHoc => {
        this.dsDeTaiKhoaHoc = dsDeTaiKhoaHoc;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(deTaiKhoaHoc: DeTaiKhoaHoc) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsDetaiKhoahocService.delete(deTaiKhoaHoc.id).subscribe({
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
      size: 800,
    })
  }
  changeInputMode(formType: 'add' | 'edit', object: DeTaiKhoaHoc | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm quá trình công tác' : 'Cập nhật quá trình công tác';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          ten_detai: '',
          ngay_batdau: '',
          sothang: '',
          vaitro: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        ten_detai: object?.ten_detai,
        ngay_batdau: object?.ngay_batdau,
        sothang: object?.sothang,
        vaitro: object?.vaitro,
      })
    }
  }


  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: DeTaiKhoaHoc) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsDetaiKhoahocService.add(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                tg_batdau: '',
                tg_ketthuc: '',
                noi_congtac: '',
                congviec: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dsDeTaiKhoaHoc.findIndex(r => r.id === this.formState.object.id);

        this.nsDetaiKhoahocService.edit(this.dsDeTaiKhoaHoc[index].id, this.formData.value).subscribe({
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
}
