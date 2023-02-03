import { Component , OnInit } from '@angular/core';
import { ThemeSettingsService } from '@core/services/theme-settings.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { tap } from 'rxjs/operators';

@Component( {
	selector    : 'app-thong-tin-he-thong' ,
	templateUrl : './thong-tin-he-thong.component.html' ,
	styleUrls   : [ './thong-tin-he-thong.component.css' ]
} )
export class ThongTinHeThongComponent implements OnInit {

	tabActive : 'settings' | 'information' | 'changelog' = 'information';

	rowsOptions = [
		{ label : '10 dòng / bảng' , value : 10 } ,
		{ label : '20 dòng / bảng' , value : 20 } ,
		{ label : '30 dòng / bảng' , value : 30 } ,
		{ label : '40 dòng / bảng' , value : 40 } ,
		{ label : '50 dòng / bảng' , value : 50 } ,
		{ label : '60 dòng / bảng' , value : 60 } ,
		{ label : '70 dòng / bảng' , value : 70 } ,
		{ label : '80 dòng / bảng' , value : 80 } ,
		{ label : '90 dòng / bảng' , value : 90 } ,
		{ label : '100 dòng / bảng' , value : 100 }
	];

	rowActive : number;

	isLoading = false;

	constructor(
		private themeSettingsService : ThemeSettingsService ,
		private authService : AuthService ,
		private notificationService : NotificationService
	) {
		this.rowActive = this.themeSettingsService.settings.rows;
	}

	ngOnInit() : void {

	}

	changeTabActive( tabActive : 'settings' | 'information' | 'changelog' ) {
		this.tabActive = tabActive;
	}

	// changeRoutingAnimation() {
	// 	this.themeSettingsService.changeThemeSetting( 'routingAnimation' , this.routingAnimationActive.trim() );
	// }

	saveSettings() {
		const settings = [ { item : 'rows' , value : this.rowActive } ];
		this.isLoading = true;
		this.themeSettingsService.changeThemeSettings( settings ).pipe( tap( () => this.authService.syncUserMeta() ) ).subscribe( {
			next  : () => {
				this.isLoading = false;
				this.notificationService.toastSuccess( 'Lưu thành công' , 'Thông báo' );
			} ,
			error : () => {
				this.isLoading = false;
				this.notificationService.toastError( 'Lưu thất bại' , 'Thông báo' );
			}
		} );
	}

	resetSettings() {
		this.rowActive = this.themeSettingsService.defaultSettings.rows;
	}

}
