import { AuthService } from '@core/services/auth.service';
import { NsQuatrinhDongbaohiemService } from './../../../../shared/services/ns-quatrinh-dongbaohiem.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { NsQuatrinhDongbaohiem } from '@modules/shared/models/ns-quatrinh';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';

@Component({
  selector: 'app-nhansu-quatrinh-dongbaohiem',
  templateUrl: './nhansu-quatrinh-dongbaohiem.component.html',
  styleUrls: ['./nhansu-quatrinh-dongbaohiem.component.css']
})
export class NhansuQuatrinhDongbaohiemComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';

  nsQuatrinhDongbaohiem: NsQuatrinhDongbaohiem[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsQuatrinhDongbaohiem | null
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
    ten_baohiem: ['', [Validators.required]],
    so_tien: ['', [Validators.required]],
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();
  constructor(
    private formBuilder: FormBuilder,
    private nsQuatrinhDongbaohiemService: NsQuatrinhDongbaohiemService,
    private notificationService: NotificationService,

    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) { this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData()); }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        // console.log(params); // param truy???n t??? danh s??ch
        this.param_id = this.auth.decryptData(params['code']);
        // console.log(this.param_id);
      }
      );
    this.loadData();
  }
  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(false);
    this.nsQuatrinhDongbaohiemService.list(1, filter).subscribe({
      next: DanhSachDongBaoHiem => {
        this.nsQuatrinhDongbaohiem = DanhSachDongBaoHiem;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('L???i kh??ng load ???????c n???i dung');
      }
    });

  }
  searchData() {
    this.OBSERVER_SEARCH_DATA.next(this.search);
  }

  async deleteDongbaohiem(nsQuatrinhDongbaohiem: NsQuatrinhDongbaohiem) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsQuatrinhDongbaohiemService.delete_baohiem(nsQuatrinhDongbaohiem.id).subscribe({
        next: () => {
          this.notificationService.isProcessing(false);
          this.loadData();
        },
        error: () => {
          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao t??c th???t b???i');
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
  changeInputMode(formType: 'add' | 'edit', object: NsQuatrinhDongbaohiem | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Th??m qu?? tr??nh ????ng b???o hi???m' : 'C???p nh???t qu?? tr??nh ????ng b???o hi???m';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          tg_batdau: '',
          tg_ketthuc: '',
          ten_baohiem: '',
          so_tien: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        tg_batdau: object?.tg_batdau,
        tg_ketthuc: object?.tg_ketthuc,
        ten_baohiem: object?.ten_baohiem,
        so_tien: object?.so_tien,
      })
    }
  }
  addQtDongbaohiem() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  editQtDongbaohiem(object: NsQuatrinhDongbaohiem) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsQuatrinhDongbaohiemService.add_baohiem(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Th??m Th??nh c??ng");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                tg_batdau: '',
                tg_ketthuc: '',
                ten_baohiem: '',
                so_tien: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Th??m th???t b???i");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.nsQuatrinhDongbaohiem.findIndex(r => r.id === this.formState.object.id);

        this.nsQuatrinhDongbaohiemService.edit_baohiem(this.nsQuatrinhDongbaohiem[index].id, this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess('C???p nh???t th??nh c??ng');
            this.loadData();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("C???p nh???t th???t b???i ");
          }
        })
      }
    }
    else {
      this.notificationService.toastError("L???i nh???p li???u");
    }
  }
  formCancel() {
    this.notificationService.closeSideNavigationMenu();
  }

}
