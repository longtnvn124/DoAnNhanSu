import { Component , OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { APP_CONFIGS } from '@env';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OverlayPanel } from 'primeng/overlaypanel/overlaypanel';

interface MenuLanguage {
	name : string;
	label : string;
}

@Component( {
	selector    : 'admin-menu-language' ,
	templateUrl : './menu-language.component.html' ,
	styleUrls   : [ './menu-language.component.css' ]
} )
@AutoUnsubscribeOnDestroy()
export class MenuLanguageComponent implements OnInit {

	languages : MenuLanguage[] = APP_CONFIGS.languages;

	activeLang : MenuLanguage = APP_CONFIGS.defaultLanguage;

	subscriptions = new Subscription();

	constructor(
		private auth : AuthService
	) {
		const changeLanguage$ = this.auth.appLanguageSettings().pipe( filter( value => value !== undefined && value !== null ) ).subscribe(
			{
				next : ( settings ) => {
					const index = this.languages.findIndex( l => l.name === settings.lang );
					if ( index !== -1 ) {
						this.activeLang = this.languages[ index ];
					}
				}
			}
		);
		this.subscriptions.add( changeLanguage$ );
	}

	ngOnInit() : void {
	}

	changeLang( panel : OverlayPanel , lang : MenuLanguage ) {
		panel.hide();
		this.auth.changeUserLanguage( lang.name );
	}

}
