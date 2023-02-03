import { NhanSu } from './../../../../shared/models/nhan-su';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { NsDanhhieuThiduaService } from '@modules/shared/services/ns-danhhieu-thidua.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NsDanhhieuThidua } from '@modules/shared/models/ns-quatrinh';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-nhansu-danhhieu-thidua',
  templateUrl: './nhansu-danhhieu-thidua.component.html',
  styleUrls: ['./nhansu-danhhieu-thidua.component.css']
})
export class NhansuDanhhieuThiduaComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  param_id: string = '';
  search: string = '';
  nsDanhhieuThidua: NsDanhhieuThidua[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsDanhhieuThidua | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }
  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    ten_danhhieu: ['', [Validators.required]],
    ki_hieu: ['', [Validators.required]],
    cap: ['', [Validators.required]],
    thoigian: ['', [Validators.required]],
  });
  cap = [
    { label: 'Cơ sở', value: 'Cơ sở' },
    { label: 'Trường', value: 'Trường' },
    { label: 'Bộ', value: 'Bộ' },
  ];

  private OBSERVER_SEARCH_DATA = new Subject<string>();


  constructor(private formBuilder: FormBuilder,
    private nsDanhhieuThiduaService: NsDanhhieuThiduaService,
    private notificationService: NotificationService,
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

  // searchData() {
  //   this.OBSERVER_SEARCH_DATA.next(this.search);
  // }

  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsDanhhieuThiduaService.list(1, filter).subscribe({
      next: danhSachdanhhieu => {
        this.nsDanhhieuThidua = danhSachdanhhieu;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async deleteDanhhieu(nsDanhhieuThidua: NsDanhhieuThidua) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsDanhhieuThiduaService.delete_danhhieu(nsDanhhieuThidua.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsDanhhieuThidua | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm Danh hiệu thi đua' : 'Cập nhật Danh hiệu thi đua';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          ten_danhhieu: '',
          ki_hieu: '',
          cap: '',
          thoigian: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        ten_danhhieu: object?.ten_danhhieu,
        ki_hieu: object?.ki_hieu,
        cap: object?.cap,
        thoigian: object?.thoigian,
      })
    }
  }
  addDanhHieu() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  editDanhHieu(object: NsDanhhieuThidua) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsDanhhieuThiduaService.add_danhhieu(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                ten_danhhieu: '',
                ki_hieu: '',
                cap: '',
                thoigian: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm danh hiệu thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.nsDanhhieuThidua.findIndex(r => r.id === this.formState.object.id);

        this.nsDanhhieuThiduaService.edit_danhhieu(this.nsDanhhieuThidua[index].id, this.formData.value).subscribe({
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
