import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { ModuleGuard } from '@core/guards/module.guard';

const routes : Routes = [
	{
		path         : 'admin' ,
		canActivate  : [ ModuleGuard ] ,
		loadChildren : () => import('@modules/admin/admin.module').then( m => m.AdminModule )
	} ,
	{
		path         : '' ,
		loadChildren : () => import('@modules/public/public.module').then( m => m.PublicModule )
	} ,
	{
		path       : '**' ,
		redirectTo : 'login' ,
		pathMatch  : 'full'
	}
];

@NgModule( {
	imports : [ RouterModule.forRoot( routes ) ] ,
	exports : [ RouterModule ]
} )
export class AppRoutingModule {}
