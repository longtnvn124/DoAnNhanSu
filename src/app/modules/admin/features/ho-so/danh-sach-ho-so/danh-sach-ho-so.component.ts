import { Component, OnInit } from '@angular/core';
import { HoSo } from '@shared/models/ho-so';
import { HoSoService } from '@shared/services/ho-so.service';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-danh-sach-ho-so',
  templateUrl: './danh-sach-ho-so.component.html',
  styleUrls: ['./danh-sach-ho-so.component.css']
})
export class DanhSachHoSoComponent implements OnInit {

  search = '';

  data: HoSo[];

  private OBSERVER_SEARCH_DATA = new Subject<string>();

  constructor(
    private hoSoService: HoSoService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.OBSERVER_SEARCH_DATA.asObservable().pipe(distinctUntilChanged(), debounceTime(500)).subscribe(() => this.loadData());
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const filter = this.search ? { search: this.search.trim() } : null;
    this.notificationService.isProcessing(true);
    this.hoSoService.list(1, filter).subscribe({
      next: danhSachHoSo => {
        this.data = danhSachHoSo;
        this.notificationService.isProcessing(false);
        console.log(danhSachHoSo);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });
  }

  searchData() {
    this.OBSERVER_SEARCH_DATA.next(this.search);
  }

  editHoSo(hoSo: HoSo) {
    this.router.navigate(['sua-ho-so']);
  }

  async deleteHoSo(hoSo: HoSo) {
    const xacNhanXoa = await this.notificationService.confirmDelete();
    if (xacNhanXoa) {
      this.notificationService.isProcessing(true);
      this.hoSoService.delete(hoSo.id).subscribe({
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

}
