import { NsQuatrinhCongtac } from './../../../../shared/models/ns-quatrinh';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';

import { NsQuatrinhCongtacService } from './../../../../shared/services/ns-quatrinh-congtac.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-nhansu-quatrinh-congtac',
  templateUrl: './nhansu-quatrinh-congtac.component.html',
  styleUrls: ['./nhansu-quatrinh-congtac.component.css']
})
export class NhansuQuatrinhCongtacComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';

  nsQuatrinhCongtac: NsQuatrinhCongtac[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsQuatrinhCongtac | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    tg_batdau: ['', [Validators.required]],
    tg_ketthuc: ['', [Validators.required]],
    noi_congtac: ['', [Validators.required]],
    congviec: ['', [Validators.required]],
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private nsQuatrinhCongtacService: NsQuatrinhCongtacService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) { this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData()); }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        // console.log(params); // { ns_id: "price" }
        this.param_id = this.auth.decryptData(params['code']);
        // console.log(this.param_id);
      }
      );
    this.loadData();

  }

  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsQuatrinhCongtacService.list(1, filter).subscribe({
      next: dsQuaTrinhCongTac => {
        this.nsQuatrinhCongtac = dsQuaTrinhCongTac;
        this.notificationService.isProcessing(false);

        // console.log(dsQuaTrinhCongTac);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  async deleteCongTac(nsQuatrinhCongtac: NsQuatrinhCongtac) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsQuatrinhCongtacService.delete_congtac(nsQuatrinhCongtac.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsQuatrinhCongtac | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm quá trình công tác' : 'Cập nhật quá trình công tác';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          tg_batdau: '',
          tg_ketthuc: '',
          noi_congtac: '',
          congviec: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        tg_batdau: object?.tg_batdau,
        tg_ketthuc: object?.tg_ketthuc,
        noi_congtac: object?.noi_congtac,
        congviec: object?.congviec,
      })
    }
  }
  addQtCongTac() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  editQtCongTac(object: NsQuatrinhCongtac) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsQuatrinhCongtacService.add_congtac(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: '',
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
        const index = this.nsQuatrinhCongtac.findIndex(r => r.id === this.formState.object.id);

        this.nsQuatrinhCongtacService.edit_congtac(this.nsQuatrinhCongtac[index].id, this.formData.value).subscribe({
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
