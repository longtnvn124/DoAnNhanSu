import { NsTrinhdoChinhtriService } from './../../../../shared/services/ns-trinhdo-chinhtri.service';
import { NsTrinhdoChuyenmonService } from './../../../../shared/services/ns-trinhdo-chuyenmon.service';
import { NsTrinhdoChuyenmon } from './../../../../shared/models/ns-trinhdo';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-nhansu-trinhdo-chuyenmon',
  templateUrl: './nhansu-trinhdo-chuyenmon.component.html',
  styleUrls: ['./nhansu-trinhdo-chuyenmon.component.css']
})
export class NhansuTrinhdoChuyenmonComponent implements OnInit {

  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;

  search: string = '';
  param_id: string = '';
  dataTrinhdoChuyenmon: NsTrinhdoChuyenmon[];

  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsTrinhdoChuyenmon | null
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
    noidaotao: ['', [Validators.required]],
    quocgia: ['', [Validators.required]],
    hocvi: ['', [Validators.required]],
    xeploai: ['', [Validators.required]],
  });

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
  private OBSERVER_SEARCH_DATA = new Subject<string>();


  constructor(
    private formBuilder: FormBuilder,
    private nsTrinhdoChuyenmonService: NsTrinhdoChuyenmonService,
    private notificationService: NotificationService,
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

  }
  loadData() {
    const filter = this.param_id ? { search: this.param_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.nsTrinhdoChuyenmonService.list(1, filter).subscribe({
      next: danhSachTrinhdoChuyenmon => {
        this.dataTrinhdoChuyenmon = danhSachTrinhdoChuyenmon;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }
  async btnDelete(nsTrinhdoChuyenmon: NsTrinhdoChuyenmon) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsTrinhdoChuyenmonService.delete_chuyenmon(nsTrinhdoChuyenmon.id).subscribe({
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

  changeInputMode(formType: 'add' | 'edit', object: NsTrinhdoChuyenmon | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Thêm trình độ chuyên môn' : 'Cập nhật trình độ chuyên môn';
    this.notificationService.isProcessing(true);
    // this.showFform();
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          tg_batdau: '',
          tg_ketthuc: '',
          noidaotao: '',
          quocgia: '',
          hocvi: '',
          xeploai: '',
        }
      );
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset(
        {
          ma_ns: object?.ma_ns,
          tg_batdau: object?.tg_batdau,
          tg_ketthuc: object?.tg_ketthuc,
          noidaotao: object?.noidaotao,
          quocgia: object?.quocgia,
          hocvi: object?.hocvi,
          xeploai: object?.xeploai,
        }
      );
    }
  }
  btnAdd() {
    this.onOpenFormEdit();
    this.changeInputMode('add');
  }
  btnEdit(object: NsTrinhdoChuyenmon) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);

  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === "add") {
        this.notificationService.isProcessing(true);
        this.nsTrinhdoChuyenmonService.add_chuyenmon(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Thành công");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                tg_batdau: '',
                tg_ketthuc: '',
                noidaotao: '',
                quocgia: '',
                hocvi: '',
                xeploai: '',
              }
            );
          }, error: () => {
            this.notificationService.toastError("Thêm thất bại");
            this.notificationService.isProcessing(false);
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.dataTrinhdoChuyenmon.findIndex(r => r.id === this.formState.object.id);
        // console.log(this.dataTrinhdoChuyenmon[index].id);
        this.nsTrinhdoChuyenmonService.edit_chuyenmon(this.dataTrinhdoChuyenmon[index].id, this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess('Cập nhật thành công');
            this.loadData();
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Cập nhật thất bại.");
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
