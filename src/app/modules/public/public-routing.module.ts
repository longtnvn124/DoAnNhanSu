import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ContentNoneComponent } from './features/content-none/content-none.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';
import { ClearComponent } from './features/clear/clear.component';

const routes : Routes = [
	{
		path      : 'unauthorized' ,
		component : UnauthorizedComponent
	} ,
	{
		path      : 'clear' ,
		component : ClearComponent
	} ,
	{
		path      : 'login' ,
		component : LoginComponent
	} ,
	{
		path      : 'content-none' ,
		component : ContentNoneComponent
	} ,
	{
		path       : '' ,
		redirectTo : 'login' ,
		pathMatch  : 'prefix'
	} ,
	{
		path       : '**' ,
		redirectTo : 'content-none' ,
		pathMatch  : 'prefix'
	}
];

@NgModule( {
	imports : [ RouterModule.forChild( routes ) ] ,
	exports : [ RouterModule ]
} )
export class PublicRoutingModule {}
