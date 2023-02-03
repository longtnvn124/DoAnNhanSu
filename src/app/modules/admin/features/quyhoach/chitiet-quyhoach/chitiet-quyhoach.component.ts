import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OvicFile } from '@core/models/file';
import { AuthService } from '@core/services/auth.service';
import { FileService } from '@core/services/file.service';
import { NotificationService } from '@core/services/notification.service';
import { DanhSachQuyHoach } from '@modules/shared/models/quy-hoach';
import { QhDanhsachService } from '@modules/shared/services/qh-danhsach.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-chitiet-quyhoach',
  templateUrl: './chitiet-quyhoach.component.html',
  styleUrls: ['./chitiet-quyhoach.component.css']
})
export class ChitietQuyhoachComponent implements OnInit {
  qh_id: string = '';
  data_danhSachQuyHoach: DanhSachQuyHoach[];
  danhSachQuyHoach: DanhSachQuyHoach;

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private qhDanhsachService: QhDanhsachService,
    private auth: AuthService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());

  }
  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params); // { ns_id: "price" }
        this.qh_id = this.auth.decryptData(params['code']);
        console.log(this.qh_id);
      }
      );
    this.loadData();
  }

  loadData() {
    const filter = this.qh_id ? { search: this.qh_id.trim() } : null;
    this.notificationService.isProcessing(true);
    this.qhDanhsachService.list(1, filter).subscribe({
      next: dsQuyhoach => {
        this.data_danhSachQuyHoach = dsQuyhoach;
        this.notificationService.isProcessing(false);
        console.log(dsQuyhoach);

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
}
