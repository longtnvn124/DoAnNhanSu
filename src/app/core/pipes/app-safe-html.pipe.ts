import { Pipe , PipeTransform } from '@angular/core';
import { DomSanitizer , SafeHtml } from '@angular/platform-browser';

@Pipe( { name : 'appSafeHtml' } )
export class AppSafeHtmlPipe implements PipeTransform {

	constructor(
		private sanitized : DomSanitizer
	) {}

	transform( html : string ) : SafeHtml {
		return this.sanitized.bypassSecurityTrustHtml( html );
	}

}
