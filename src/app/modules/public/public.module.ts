import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './features/login/login.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { ContentNoneComponent } from './features/content-none/content-none.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ClearComponent } from './features/clear/clear.component';
import { FormsModule } from '@angular/forms';

@NgModule( {
	declarations : [
		LoginComponent ,
		ResetPasswordComponent ,
		ContentNoneComponent ,
		UnauthorizedComponent ,
		ClearComponent
	] ,
	imports      : [
		CommonModule ,
		PublicRoutingModule ,
		ReactiveFormsModule ,
		ButtonModule ,
		RippleModule ,
		FormsModule
	]
} )
export class PublicModule {}
