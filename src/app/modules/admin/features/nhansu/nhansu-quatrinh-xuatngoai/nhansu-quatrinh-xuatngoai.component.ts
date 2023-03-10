
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { NsQuatrinhXuatngoai } from '@modules/shared/models/ns-quatrinh';
import { NgQuatrinhXoatngoaiService } from '@modules/shared/services/ns-quatrinh-xoatngoai.service';
import { async, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-nhansu-quatrinh-xuatngoai',
  templateUrl: './nhansu-quatrinh-xuatngoai.component.html',
  styleUrls: ['./nhansu-quatrinh-xuatngoai.component.css'],


})
export class NhansuQuatrinhXuatngoaiComponent implements OnInit {
  @ViewChild("nsFormEdit") nsFormEdit: TemplateRef<any>;
  search: string = '';
  param_id: string = '';

  nsQuatrinhXuatngoai: NsQuatrinhXuatngoai[];
  formState: {
    formType: 'add' | 'edit',
    showForm: boolean,
    formTitle: string,
    object: NsQuatrinhXuatngoai | null
  } = {
      formType: 'add',
      showForm: false,
      formTitle: '',
      object: null
    }

  formData: FormGroup = this.formBuilder.group({
    ma_ns: ['', [Validators.required]],
    tg_di: ['', [Validators.required]],
    tg_ve: ['', [Validators.required]],
    noidung_congviec: ['', [Validators.required]],
    quocgia: ['', [Validators.required]],
  });


  constructor(
    private formBuilder: FormBuilder,

    private nsQuatrinhXoatngoaiService: NgQuatrinhXoatngoaiService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) {
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
    this.notificationService.isProcessing(false);
    this.nsQuatrinhXoatngoaiService.list(1, filter).subscribe({
      next: DanhSachXuatNgoai => {
        this.nsQuatrinhXuatngoai = DanhSachXuatNgoai;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('L???i kh??ng load ???????c n???i dung');
      }
    });

  }

  async deleteXuatngoai(nsQuatrinhXuatngoai: NsQuatrinhXuatngoai) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.nsQuatrinhXoatngoaiService.delete_xuatngoai(nsQuatrinhXuatngoai.id).subscribe({
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
  changeInputMode(formType: 'add' | 'edit', object: NsQuatrinhXuatngoai | null = null) {
    this.formState.formTitle = formType === 'add' ? 'Th??m qu?? tr??nh xu???t ngo???i' : 'C???p nh???t qu?? tr??nh xu???t ngo???i';
    this.notificationService.isProcessing(true);
    this.formState.formType = formType;
    if (formType === 'add') {
      this.notificationService.isProcessing(false);
      this.formData.reset(
        {
          ma_ns: this.param_id,
          tg_di: '',
          tg_ve: '',
          noidung_congviec: '',
          quocgia: '',
        }
      )
    } else {
      this.notificationService.isProcessing(false);
      this.formState.object = object;
      this.formData.reset({
        ma_ns: object?.ma_ns,
        tg_di: object?.tg_di,
        tg_ve: object?.tg_ve,
        noidung_congviec: object?.noidung_congviec,
        quocgia: object?.quocgia,
      })
    }
  }
  addQtXuatngoai() {
    this.onOpenFormEdit();
    this.changeInputMode("add");
  }
  editQtXuatngoai(object: NsQuatrinhXuatngoai) {
    this.onOpenFormEdit();
    this.changeInputMode('edit', object);
  }
  updateForm() {
    if (this.formData.valid) {
      if (this.formState.formType === 'add') {
        this.notificationService.isProcessing(true);
        this.nsQuatrinhXoatngoaiService.add_xuatngoai(this.formData.value).subscribe({
          next: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastSuccess("Th??m Th??nh c??ng");
            this.loadData();
            this.formData.reset(
              {
                ma_ns: this.param_id,
                tg_di: '',
                tg_ve: '',
                noidung_congviec: '',
                congviec: '',
              }
            )
          }, error: () => {
            this.notificationService.isProcessing(false);
            this.notificationService.toastError("Th??m th???t b???i");
          }
        })
      } else {
        this.notificationService.isProcessing(true);
        const index = this.nsQuatrinhXuatngoai.findIndex(r => r.id === this.formState.object.id);

        this.nsQuatrinhXoatngoaiService.edit_xuatngoai(this.nsQuatrinhXuatngoai[index].id, this.formData.value).subscribe({
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
  formCancel() {     this.notificationService.closeSideNavigationMenu();
  }




}
