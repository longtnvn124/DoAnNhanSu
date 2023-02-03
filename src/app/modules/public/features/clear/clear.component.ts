import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component( {
	selector    : 'app-clear' ,
	templateUrl : './clear.component.html' ,
	styleUrls   : [ './clear.component.css' ]
} )
export class ClearComponent implements OnInit {

	constructor(
		private router : Router ,
		private auth : AuthService
	) { }

	ngOnInit() : void {
		this.auth.removeSession();
		this.router.navigate( [ '/login' ] );
	}

}
