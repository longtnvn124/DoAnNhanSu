import { NsPermissions } from './../../../../shared/models/nhan-su';
import { Permission } from '@core/models/auth';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { NhansuService } from '../../../../shared/services/nhansu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { NhanSu } from '@modules/shared/models/nhan-su';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-chitiet-nhansu',
  templateUrl: './chitiet-nhansu.component.html',
  styleUrls: ['./chitiet-nhansu.component.css']
})
export class ChitietNhansuComponent implements OnInit {

  ns_id: string = '';
  data_ns: NhanSu[];
  nhanSu: NhanSu;

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  permission: NsPermissions = {
    isExpert: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  }

  constructor(
    private formBuilder: FormBuilder,
    private nhanSuService: NhansuService,
    private auth: AuthService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());

  }

  ngOnInit(): void {
    this.permission.isExpert = this.auth.roles.reduce((isExpert, role) => isExpert || role === 'dans_lanh_dao', false);
    this.permission.canAdd = this.permission.isExpert;
    this.permission.canDelete = this.permission.isExpert;
    this.permission.canEdit = this.permission.isExpert;
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.ns_id = this.auth.decryptData(params['code']);
      }
      );
    this.loadData();
  }
  loadData() {
    // this.OBSERVER_SEARCH_DATA.next(this.ns_id);
    const filter = this.ns_id ? { key: 'ma_ns', value: this.ns_id.trim() } : null;
    // const filter = this.ns_id;
    this.notificationService.isProcessing(true);
    this.nhanSuService.list(filter).subscribe({
      next: dsNhansu => {
        this.data_ns = dsNhansu;
        this.notificationService.isProcessing(false);
        console.log(dsNhansu);

      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    })
  }

}
