import { Injectable } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject, debounceTime } from 'rxjs';
import { catchError, filter, take, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ACCESS_TOKEN, getHost, REFRESH_TOKEN } from '@env';
import { AuthService } from '@core/services/auth.service';
import { Token } from '@core/models/auth';

@Injectable({
	providedIn: 'root'
})
export class InterceptorsService {

	private root = getHost();

	// private googleDrive = getLinkDrive( null );

	private isRefreshing = false;

	private refreshTokenSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

	private observeRemoveCurrentSession$ = new Subject<string>();

	serverResponseCode: { [T: string]: string } = {
		update_fail: 'Update failed',
		create_fail: 'Create failed',
		delete_fail: 'Delete failed',
		auth_fail: 'Login failed',
		user_not_found: 'User not found',
		user_disable: 'User has been disabled',
		user_not_exist: 'User does not exist',
		wrong_password: 'Wrong password',
		system_error: 'System error',
		not_exist: 'Does not exist',
		not_found: 'Not found',
		forbidden: 'Forbidden',
		unauthorized: 'Unauthorized'
	};

	constructor(
		private auth: AuthService,
		private notificationService: NotificationService,
		private router: Router
	) {
		this.auth.appLanguageSettings().pipe(filter(v => v !== null && v !== undefined), map((res: { translations: any }) => res.translations ? res.translations.serverResponseCode : this.serverResponseCode)).subscribe({ next: (serverResponseCode: any) => this.serverResponseCode = serverResponseCode });
		this.observeRemoveCurrentSession$.asObservable().pipe(debounceTime(150)).subscribe(() => this.removeSession());
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (!request.url.endsWith('refresh-token') && token) {
			request = InterceptorsService.addToken(request, token);
		}
		if (!request.params.has('limit')) {
			request = request.clone({ setParams: { limit: '-1' } });
		}

		request = request.clone({ setHeaders: { 'X-APP-ID': 'd47bfe38-c57b-4b8d-9e58-87b4ef6d7a73' } });
		return next.handle(request).pipe(catchError(res => {
			if (res instanceof HttpErrorResponse) {
				const isLoginPage = this.router.isActive('login', { paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' });
				if (res.status === 401) {
					if (res['error'] && res['error']['message'] && res['error']['message'] === 'jwt expired') {
						this.triggerRemoveSession();
					} else {
						if (localStorage.getItem(REFRESH_TOKEN)) {
							return this.handle401Error(request, next);
						} else if (!isLoginPage) {
							this.triggerRemoveSession();
						}
					}
				}
				if (res.error && res.error['code']) {
					const message: string = this.serverResponseCode[res.error['code']] || res.error['message'];
					if (typeof message === 'string') {
						this.notificationService.toastError(message);
					} else if (typeof message === 'object' && Object.keys(message).length) {
						Object.keys(message).forEach(key => this.notificationService.toastError(message[key]));
					}
				}
			}
			return throwError(res);
		}));
	}

	private triggerRemoveSession() {
		this.observeRemoveCurrentSession$.next('remove');
	}

	private removeSession() {
		this.notificationService.closeALlActiveModal(null);
		this.auth.logout().then(() => this.router.navigate(['login']).then(() => this.notificationService.toastInfo(`Phiên làm việc của bạn đã hết hạn \n vui lòng đang nhập lại`, 'Thông báo')));
	}

	private static addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
		return request.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
	}

	private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject$.next(null);
			return this.auth.refreshTokenActor.pipe(
				switchMap(({ data }) => {
					this.isRefreshing = false;
					this.refreshTokenSubject$.next(data);
					return next.handle(InterceptorsService.addToken(request, data));
				}),
				catchError(err => {
					this.refreshTokenSubject$.error('Invalid refresh token');
					return throwError(err);
				})
			);
		} else {
			return this.refreshTokenSubject$.pipe(
				filter(token => token != null),
				take(1),
				switchMap(access_token => next.handle(InterceptorsService.addToken(request, access_token))));
		}
	}
}
