import { NsTrinhdoTinhocService } from './../../../../shared/services/ns-trinhdo-tinhoc.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { NsTrinhdoTinhoc } from '@modules/shared/models/ns-trinhdo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged, debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-nhansu-trinhdo-tinhoc',
  templateUrl: './nhansu-trinhdo-tinhoc.component.html',
  styleUrls: ['./nhansu-trinhdo-tinhoc.component.css']
})
export class NhansuTrinhdoTinhocComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';
  nsTrinhdoTinhoc: NsTrinhdoTinhoc[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsTrinhdoTinhoc | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    nam_congnhan: ['', [Validators.required]],
    ten_trinhdo_tinhoc: ['', [Validators.required]],
    loai: ['', [Validators.required]],
    xeploai: ['', [Validators.required]],
  });
  loai = [
    { label: 'Chứng chỉ', value: 'Chứng chỉ' },
    { label: 'Chứng nhận', value: 'Chứng nhận' },

  ];
  xeploai = [
    { label: 'Đạt', value: 'Đạt' },
    { label: 'Khá', value: 'Khá' },
    { label: 'Giỏi', value: 'Giỏi' },
    { label: 'Xuất sắc', value: 'Xuất sắc' },
  ];
  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(private formBuilder: FormBuilder,
    private nsTrinhdoTinhocService: NsTrinhdoTinhocService,
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
    this.nsTrinhdoTinhocService.list(1, filter).subscribe({
      next: dsTrinhdoTinhoc => {
        this.nsTrinhdoTinhoc = dsTrinhdoTinhoc;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(nsTrinhdoTinhoc: NsTrinhdoTinhoc) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsTrinhdoTinhocService.delete_tinhoc(nsTrinhdoTinhoc.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsTrinhdoTinhoc | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm trình độ tin học' : 'Cập nhật trình độ tinh học';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          nam_congnhan: '',
          ten_trinhdo_tinhoc: '',
          loai: '',
          xeploai: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        nam_congnhan: object?.nam_congnhan,
        ten_trinhdo_tinhoc: object?.ten_trinhdo_tinhoc,
        loai: object?.loai,
        xeploai: object?.xeploai,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: NsTrinhdoTinhoc) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }

  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsTrinhdoTinhocService.add_tinhoc(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                nam_congnhan: '',
                ten_trinhdo_tinhoc: '',
                loai: '',
                xeploai: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêmthất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.nsTrinhdoTinhoc.findIndex(r => r.id === this.formState.object.id);

        this.nsTrinhdoTinhocService.edit_tinhoc(this.nsTrinhdoTinhoc[index].id, this.formData.value).subscribe({
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
  formCancel() {     this.notificationService.closeSideNavigationMenu();
  }




}
