
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { NsQuatrinhDaotaoService } from './../../../../shared/services/ns-quatrinh-daotao.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NsQuaTrinhDaoTao } from '@modules/shared/models/ns-quatrinh';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-nhansu-quatrinh-daotao',
  templateUrl: './nhansu-quatrinh-daotao.component.html',
  styleUrls: ['./nhansu-quatrinh-daotao.component.css']
})
export class NhansuQuatrinhDaotaoComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';
  nsQuaTrinhDaoTao: NsQuaTrinhDaoTao[];

  hocvi = [
    { label: 'Cử nhân', value: 'Cử nhân' },
    { label: 'kĩ sư', value: 'kĩ sư' },
    { label: 'Thạc sĩ', value: 'Thạc sĩ' },
    { label: 'Tiến sĩ', value: 'Tiến sĩ' },
    { label: 'Phó giáo sư', value: 'Phó giáo sư' },
    { label: 'Giáo sư', value: 'Giáo sư' },
  ]
  ketqua = [
    { label: 'Khá', value: 'Khá' },
    { label: 'Giỏi', value: 'Giỏi' },
    { label: 'Xuất sắc', value: 'Xuất sắc' },
  ]

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsQuaTrinhDaoTao | null
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
    noi_daotao: ['', [Validators.required]],
    quocgia: ['', [Validators.required]],
    hoc_vi: ['', [Validators.required]],
    ketqua: ['', [Validators.required]],
  });
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(private formBuilder: FormBuilder,
    private nsQuatrinhDaotaoService: NsQuatrinhDaotaoService,
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
    this.nsQuatrinhDaotaoService.list(1, filter).subscribe({
      next: dsQuaTrinhDaoTao => {
        this.nsQuaTrinhDaoTao = dsQuaTrinhDaoTao;
        this.notificationService.isProcessing(false);

        // console.log(dsQuaTrinhDaoTao);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async deleteDanhhieu(nsQuaTrinhDaoTao: NsQuaTrinhDaoTao) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsQuatrinhDaotaoService.delete_daotao(nsQuaTrinhDaoTao.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsQuaTrinhDaoTao | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm quá trình đào tạo' : 'Cập nhật quá trình đào tạo';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          tg_batdau: '',
          tg_ketthuc: '',
          noi_daotao: '',
          quocgia: '',
          hoc_vi: '',
          ketqua: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        tg_batdau: object?.tg_batdau,
        tg_ketthuc: object?.tg_ketthuc,
        noi_daotao: object?.noi_daotao,
        quocgia: object?.quocgia,
        hoc_vi: object?.hoc_vi,
        ketqua: object?.ketqua,
      })
    }
  }
  addQtDaoTao() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  editQtDaoTao(object: NsQuaTrinhDaoTao) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }

  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsQuatrinhDaotaoService.add_daotao(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                // ma_ns: '',
                tg_batdau: '',
                tg_ketthuc: '',
                noi_daotao: '',
                quocgia: '',
                hoc_vi: '',
                ketqua: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm danh hiệu thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.nsQuaTrinhDaoTao.findIndex(r => r.id === this.formState.object.id);

        this.nsQuatrinhDaotaoService.edit_daotao(this.nsQuaTrinhDaoTao[index].id, this.formData.value).subscribe({
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
    }
    else {
      this.notificationService.toastError("Lỗi nhập liệu");
    }
  }
  btnCancel() {
    this.notificationService.closeSideNavigationMenu();
  }

}
