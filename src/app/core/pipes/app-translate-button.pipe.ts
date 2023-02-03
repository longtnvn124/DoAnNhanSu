import { Pipe , PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '@core/services/auth.service';
import { LangChangeEvent } from '@ngx-translate/core/lib/translate.service';
import { OvicButton } from '@core/models/buttons';

@Pipe( {
	name : 'appTranslateButton'
} )
export class AppTranslateButtonPipe implements PipeTransform {

	lang : LangChangeEvent;

	constructor(
		private sanitized : DomSanitizer ,
		private auth : AuthService
	) {
		this.auth.appLanguageSettings().subscribe( lang => this.lang = lang );
	}

	transform( btn : OvicButton ) : string {
		let result = btn.label;
		if ( this.lang && this.lang.translations && this.lang.translations.buttons && this.lang.translations.buttons.hasOwnProperty( btn.name ) ) {
			result = this.lang.translations.buttons[ btn.name ];
		}
		return result;
	}

}
