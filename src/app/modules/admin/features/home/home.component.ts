import { CheDo_NghiViec } from '@modules/shared/models/nghi-chedo';
import { CdNghiviecService } from './../../../shared/services/cd-nghiviec.service';
import { HelperService } from './../../../../core/services/helper.service';
import { filter } from 'rxjs/operators';
import { NhanSu } from './../../../shared/models/nhan-su';
import { NhansuService } from './../../../shared/services/nhansu.service';
import { Component, OnInit } from '@angular/core';
import { DropdownOptions } from '@shared/models/dropdown-options';
import { debounceTime, distinctUntilChanged, Subject, Subscription, forkJoin } from 'rxjs';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';
@AutoUnsubscribeOnDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sum_ns: any;
  sum_gioitinh_nam: any;
  sum_gioitinh_nu: any;
  sum_tongiao: any;
  sum_dantoc: any;
  data_age: any;
  sum_nghihuu: any;

  countPersonByAges = { thirtyYld: 0, fromThirtyToFortyFiveYld: 0, fromFortyFiveToSixtyYld: 0 };
  datanhansu: NhanSu[];
  cdNghiviec: CheDo_NghiViec[];

  constructor(
    private nhansuService: NhansuService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private cdNghiviecService: CdNghiviecService,
    private router :Router,
  ) { }

  ngOnInit(): void {
    this.loaddata();

  }

  loaddata(): void {

    const cDate = new Date();

    const currentTime = cDate.getTime() + 111600000; // ngày hiện tại + thêm 1 ngày

    // //new Date(year, monthIndex, day)
    // const lastThirtyYear = new Date(cDate.getFullYear() - 30, cDate.getMonth(), cDate.getDate() - 1, cDate.getHours());


    // console.log(cDate.toDateString())
    // console.log(lastThirtyYear.toDateString())
    // console.log(cDate.getTime() - lastThirtyYear.getTime());

    this.notificationService.isProcessing(true);

    this.nhansuService.list().subscribe({
      next: datanhansu => {
        this.notificationService.isProcessing(false);

        this.datanhansu = datanhansu;
        this.sum_ns = this.datanhansu.length.toString();
        this.sum_gioitinh_nam = this.datanhansu.filter(datanhansu => datanhansu.gioitinh === "Nam").length.toString();
        this.sum_gioitinh_nu = this.datanhansu.filter(datanhansu => datanhansu.gioitinh === "Nữ").length.toString();;
        this.sum_dantoc = this.datanhansu.reduce((collector, item) => collector.add(item.dantoc), new Set<string>()).size;
        this.sum_tongiao = this.datanhansu.reduce((collector, item) => {
          if (item.tongiao != "Không") {
            collector.add(item.tongiao);
          }
          return collector;
        }, new Set<string>()
        ).size;

        this.countPersonByAges = this.datanhansu.reduce((collector, employee) => {
          const employeeAge = new Date(employee.ngaysinh).getTime();
          if ((currentTime - employeeAge) < 946728000000) {
            collector.thirtyYld += 1;
          } else if ((currentTime - employeeAge) < 1420092000000) {
            collector.fromThirtyToFortyFiveYld += 1;
          } else if ((currentTime - employeeAge) < 1893456000000) {
            collector.fromFortyFiveToSixtyYld += 1;
          }
          return collector;
        }, { thirtyYld: 0, fromThirtyToFortyFiveYld: 0, fromFortyFiveToSixtyYld: 0 });

      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Lỗi không load được nội dung');
      }
    });


    this.cdNghiviecService.list().subscribe(
      {
        next: cdNghiviec => {
          this.notificationService.isProcessing(false);

          this.cdNghiviec = cdNghiviec;
          this.sum_nghihuu = this.cdNghiviec.filter(cdNghiviec => cdNghiviec.loai === "Nghỉ hưu").length.toString();

        }
      }
    )



  }

  btnGetNhansu(){
    this.router.navigate(['/admin/nhansu/danhsach-nhansu'])
  }
  btnGetQuyhoach(){
    this.router.navigate(['/admin/quyhoach/danhsach-quyhoach'])
  }
  btnGetNghichedo(){
    this.router.navigate(['/admin/nghi-chedo/chedo-nghiphep'])
  }
}
