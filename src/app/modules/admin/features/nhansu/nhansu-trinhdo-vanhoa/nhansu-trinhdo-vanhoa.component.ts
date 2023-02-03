import { NsTrinhdoVanhoaService } from './../../../../shared/services/ns-trinhdo-vanhoa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NsTrinhdoVanhoa } from './../../../../shared/models/ns-trinhdo';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-nhansu-trinhdo-vanhoa',
  templateUrl: './nhansu-trinhdo-vanhoa.component.html',
  styleUrls: ['./nhansu-trinhdo-vanhoa.component.css']
})
export class NhansuTrinhdoVanhoaComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;

  search: string = '';
  param_id: string = '';

  dataTrinhdoVanhoa: NsTrinhdoVanhoa[];

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsTrinhdoVanhoa | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }
  trinhdo = [
    { label: '12/12', value: '12/12' },
    { label: '10/10', value: '10/10' },
  ];


  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    ten_trinhdo_vanhoa: ['', [Validators.required]],
  });

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private nsTrinhdoVanhoaService: NsTrinhdoVanhoaService,
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
        this.param_id = this.auth.decryptData(params['code']);
      }
      );
    this.loadData();

  }
  searchData() {
    this.OBSERVER_SEARCH_DATA.next(this.search);
  }
  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsTrinhdoVanhoaService.list(1, filter).subscribe({
      next: danhSachTrinhdoVanhoa => {
        this.dataTrinhdoVanhoa = danhSachTrinhdoVanhoa;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(nsTrinhdoVanhoa: NsTrinhdoVanhoa) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsTrinhdoVanhoaService.delete_vanhoa(nsTrinhdoVanhoa.id).subscribe({
        next: () => {
          this.notificationService.isProcessing(false);
          this.loadData();
        },
        error: () => {
          this.notificationService.isProcessing(false);
          this.notificationService.toastError('Thao tác thất bại');
        }
      });
    }
  }

  onOpenFormEdit() {
    this.notificationService.openSideNavigationMenu({
      template: this.nsFormEdit,
      size: 800,
    })
  }

  changeInputMode(formType: 'add' | 'edit', object: NsTrinhdoVanhoa | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm trình độ văn hoá' : 'Cập nhật trình độ văn hoá';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          ten_trinhdo_vanhoa: '',
        }
      );
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset(
        {
          ma_ns: object?.ma_ns,
          ten_trinhdo_vanhoa: object?.ten_trinhdo_vanhoa,
        }
      );
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode('add');
  }
  btnEdit(object: NsTrinhdoVanhoa) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);

  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === "add") {
        this.notificationService.isProcessing(true);
        this.nsTrinhdoVanhoaService.add_vanhoa(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                ten_trinhdo_vanhoa: '',
              }
            );
          }, error: () => {
            this.notificationService.toastError("Thêm thất bại");
            this.notificationService.isProcessing(false);
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dataTrinhdoVanhoa.findIndex(r => r.id === this.formState.object.id);
        // console.log(this.dataTrinhdoVanhoa[index].id);
        this.nsTrinhdoVanhoaService.edit_vanhoa(this.dataTrinhdoVanhoa[index].id, this.formData.value).subscribe({
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
    } else {
      this.notificationService.toastError("Lỗi nhập liệu");

    }
  }
  // btnpage(){
  //   this.router.navigate(['/nhansu/danhhieuthidua/']);
  // }
  formCancel() {
    this.notificationService.closeSideNavigationMenu();
  }

}
