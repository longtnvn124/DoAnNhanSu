import { FormBuilder } from '@angular/forms';
import { KeHoacHocTapBoiTuong } from './../../../../shared/models/hoctap-boiduong';
import { Component, OnInit } from '@angular/core';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { HtBdKehoachService } from '@modules/shared/services/ht-bd-kehoach.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '@core/services/file.service';
import { OvicFile } from '@core/models/file';

@Component({
  selector: 'app-chitiet',
  templateUrl: './chitiet.component.html',
  styleUrls: ['./chitiet.component.css']
})
export class ChitietComponent implements OnInit {

  ht_id: string = '';
  data_keHoacHocTapBoiTuong:KeHoacHocTapBoiTuong[];
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
  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params); // { ns_id: "price" }
        this.ht_id = this.auth.decryptData(params['code']);
        console.log(this.ht_id);
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
        console.log(dsKeHoach);

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


  display: boolean = false;
  btnRegister(){
    this.display = true;
  }
}
