import { Injectable } from '@angular/core';
import { BehaviorSubject , Observable } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { map , tap } from 'rxjs/operators';
import { UserMeta } from '@core/models/user';

export interface ThemeSettings extends Object {
	routingAnimation : string;
	rows : number;
	menuCollapse : boolean;
}

@Injectable( {
	providedIn : 'root'
} )
export class ThemeSettingsService {

	private readonly _settings : ThemeSettings = {
		routingAnimation : 'noAnimations' ,
		rows             : 10 ,
		menuCollapse     : false
	};

	private readonly OBSERVER_CHANGE_SETTINGS = new BehaviorSubject<ThemeSettings>( this.settings );

	private readonly storeKeyName = '__ovic_theme_settings';

	private readonly metaKeyName = 'USER_THEME_SETTINGS';

	constructor( private userService : UserService ) {}

	get onThemeSettingsChange() : Observable<ThemeSettings> {
		return this.OBSERVER_CHANGE_SETTINGS;
	}

	get settings() : ThemeSettings {
		const settings = localStorage.getItem( this.storeKeyName );
		return settings ? JSON.parse( settings ) : JSON.parse( JSON.stringify( this._settings ) );
	}

	get defaultSettings() : ThemeSettings {
		return this._settings;
	}

	getSetting( name : string ) : any {
		if ( this.settings.hasOwnProperty( name ) ) {
			return this.settings[ name ];
		}
		if ( this.defaultSettings.hasOwnProperty( name ) ) {
			return this.defaultSettings[ name ];
		}
		return null;
	}

	changeThemeSettings( settings : { item : string, value : any }[] , syncSettings = true ) : Observable<ThemeSettings> {
		const _settings = this.settings;
		settings.forEach( s => _settings[ s.item ] = s.value );
		const meta_value = JSON.stringify( _settings );
		const meta_key   = this.metaKeyName;
		const meta_title = 'Theme settings';
		return this.userService.updateMeta( { meta_key , meta_title , meta_value } ).pipe( tap( () => {
			this.__storeCurrentThemeSettings( _settings );
			if ( syncSettings ) {
				this.OBSERVER_CHANGE_SETTINGS.next( _settings );
			}
		} ) , map( () => _settings ) );
	}

	private __storeCurrentThemeSettings( settings : ThemeSettings ) {
		localStorage.setItem( this.storeKeyName , JSON.stringify( settings ) );
	}

	settingInit( meta : UserMeta[] ) {
		const m   = meta && meta.length ? meta.find( r => r.meta_key === this.metaKeyName ) : null;
		const str = m ? m.meta_value : '';
		try {
			const settings = str ? JSON.parse( str ) : {};
			if ( settings ) {
				const _settings = this.settings;
				Object.keys( settings ).forEach( key => _settings[ key ] = settings[ key ] );
				this.__storeCurrentThemeSettings( _settings );
			}
		} catch ( e ) {
			console.log( e );
		}
	}

}
