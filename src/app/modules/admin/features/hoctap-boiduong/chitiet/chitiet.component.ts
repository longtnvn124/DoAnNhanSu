import { FormBuilder } from '@angular/forms';
import { KeHoacHocTapBoiTuong } from './../../../../shared/models/hoctap-boiduong';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { HtBdKehoachService } from '@modules/shared/services/ht-bd-kehoach.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '@core/services/file.service';
import { OvicFile } from '@core/models/file';
import { NsPermissions } from '@modules/shared/models/nhan-su';
import { DanhsachHoctapBoiduongComponent } from '../danhsach-hoctap-boiduong/danhsach-hoctap-boiduong.component';

@Component({
  selector: 'app-chitiet',
  templateUrl: './chitiet.component.html',
  styleUrls: ['./chitiet.component.css']
})
export class ChitietComponent implements OnInit {
  @ViewChild('child') child:DanhsachHoctapBoiduongComponent;
  ht_id: string = '';
  data_keHoacHocTapBoiTuong: KeHoacHocTapBoiTuong[];
  keHoacHocTapBoiTuong: KeHoacHocTapBoiTuong;

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private htBdKehoachService: HtBdKehoachService,
    private auth: AuthService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());

  }

  permission: NsPermissions = {
    isExpert: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  }

  ngOnInit(): void {
    this.permission.isExpert = this.auth.roles.reduce((isExpert, role) => isExpert || role === 'dans_lanh_dao', false);
    this.permission.canAdd = this.permission.isExpert;
    this.permission.canEdit = this.permission.isExpert;
    this.permission.canDelete = this.permission.isExpert;
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.ht_id = this.auth.decryptData(params['code']);
      }
      );
    this.loadData();
  }

  loadData() {
    const filter = this.ht_id ? { search: this.ht_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.htBdKehoachService.list(1, filter).subscribe({
      next: dsKeHoach => {
        this.data_keHoacHocTapBoiTuong = dsKeHoach;
        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      },
    })
  }

  downloadFile(file: OvicFile) {
    this.fileService.downloadWithProgress(file.id, file.title).subscribe();
  }

  openFilre(file: OvicFile) {
    this.fileService.getImageContent(file.id.toString(10)).subscribe({
      next: blob => {
        window.open(blob, '_blank',);
      },
      error: () => { },
    });

  }


  // display: boolean = false;
  btnRegister() {
    console.log('parent');
    this.child.btnAdd();
  }


}
