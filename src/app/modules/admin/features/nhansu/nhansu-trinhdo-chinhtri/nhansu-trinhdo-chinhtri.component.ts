import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { Subject, distinctUntilChanged, debounceTime, forkJoin } from 'rxjs';
import { NsTrinhdoChinhtri } from './../../../../shared/models/ns-trinhdo';
import { NsTrinhdoChinhtriService } from './../../../../shared/services/ns-trinhdo-chinhtri.service';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { HelperService } from '@core/services/helper.service';
import { AuthService } from '@core/services/auth.service';
import { DmTrinhdoChinhtri } from '@modules/shared/models/danh-muc';
import { NsPermissions } from '@modules/shared/models/nhan-su';

@Component({
  selector: 'app-nhansu-trinhdo-chinhtri',
  templateUrl: './nhansu-trinhdo-chinhtri.component.html',
  styleUrls: ['./nhansu-trinhdo-chinhtri.component.css']
})
export class NhansuTrinhdoChinhtriComponent implements OnInit {
  @Input() permission: NsPermissions = { isExpert: false, canAdd: false, canEdit: false, canDelete: false}
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';
  dmChinhtri:DmTrinhdoChinhtri[];
  nsTrinhdoChinhtri: NsTrinhdoChinhtri[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsTrinhdoChinhtri | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    nam_congnhan: ['', [Validators.required]],
    ten_trinhdo_chinhtri: ['', [Validators.required]],
  });

  private OBSERVER_SEARCH_DATA = new Subject<string>();
  trinhdo_chinhtri = [
    { label: 'Trung cấp', value: 'Trung cấp' },
    { label: 'Cao cấp', value: 'Cao cấp' },

  ];


  constructor(
    private formBuilder: FormBuilder,
    private nsTrinhdoChinhtriService: NsTrinhdoChinhtriService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        // console.log(params);
        this.param_id = this.auth.decryptData(params['code']);
        // console.log(this.param_id);
      }
      );
    this.loadData();
    this.getDanhmuc();

  }

  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsTrinhdoChinhtriService.list(1, filter).subscribe({
      next: dsTrinhdoChinhtri => {
        this.nsTrinhdoChinhtri = dsTrinhdoChinhtri;
        this.notificationService.isProcessing(false);

      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(nsTrinhdoChinhtri: NsTrinhdoChinhtri) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsTrinhdoChinhtriService.delete_chinhtri(nsTrinhdoChinhtri.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsTrinhdoChinhtri | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm trình độ chính trị' : 'Cập nhật trình độ chính trị';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          nam_congnhan: '',
          ten_trinhdo_chinhtri: '',

        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        nam_congnhan: object?.nam_congnhan,
        ten_trinhdo_chinhtri: object?.ten_trinhdo_chinhtri,
      })
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  btnEdit(object: NsTrinhdoChinhtri) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }

  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsTrinhdoChinhtriService.add_chinhtri(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                nam_congnhan: '',
                ten_trinhdo_tinhoc: '',

              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Thêm thất bại");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.nsTrinhdoChinhtri.findIndex(r => r.id === this.formState.object.id);

        this.nsTrinhdoChinhtriService.edit_chinhtri(this.nsTrinhdoChinhtri[index].id, this.formData.value).subscribe({
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
  getDanhmuc(){
    forkJoin<[DmTrinhdoChinhtri[]]>([
      this.nsTrinhdoChinhtriService.getdata_danhmuc_danhhieu()
    ]).subscribe({
      next:([dmChinhtri])=>{
        this.dmChinhtri = dmChinhtri
      }
    })
  }

}
