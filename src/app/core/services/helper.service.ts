import { Injectable } from '@angular/core';
import { Is } from '@core/utils/is';

// import { OvicConditionParam } from '@core/models/dto';

@Injectable( {
	providedIn : 'root'
} )
export class HelperService {

	constructor() {}

	// private static _addNewParam( condition : OvicConditionParam ) : string {
	// 	let result = ''.concat( condition.conditionName , ',' , condition.condition , ',' , condition.value );
	// 	if ( condition.hasOwnProperty( 'orWhere' ) && [ 'and' , 'or' ].includes( condition.orWhere ) ) {
	// 		result = ''.concat( result , ',' , condition.orWhere );
	// 	}
	// 	return result;
	// }

	/**
	 * sort
	 * @param dataSource: array
	 * @param fieldSort: field chosen to sort
	 * @param ascending: ascending: 1; descending: -1; default: 1.
	 */
	sort( dataSource : any[] , fieldSort : any , ascending = 1 ) : any[] {
		return dataSource.sort( ( left , right ) : number => {
			if ( left[ fieldSort ] < right[ fieldSort ] ) {
				return -ascending;
			}
			if ( left[ fieldSort ] > right[ fieldSort ] ) {
				return ascending;
			}
			return 0;
		} );
	}

	sortWidthTwoConditions( dataSource : any[] , firstCondition : string , secondsCondition : string ) : any[] {
		return dataSource.sort( ( left , right ) : number => {
			if ( left[ firstCondition ] < right[ firstCondition ] ) {
				return -1;
			} else if ( left[ firstCondition ] > right[ firstCondition ] ) {
				return 1;
			}
			if ( left[ secondsCondition ] < right[ secondsCondition ] ) {
				return -1;
			} else if ( left[ secondsCondition ] > right[ secondsCondition ] ) {
				return 1;
			}
			return 0;
		} );
	}

	// need test
	shuffleArray( array : any[] ) : any[] {
		for ( let i = array.length - 1 ; i > 0 ; i-- ) {
			const j                     = Math.floor( Math.random() * ( i + 1 ) );
			[ array[ i ] , array[ j ] ] = [ array[ j ] , array[ i ] ];
		}
		return array;
	}

	tryParseJSON( str : string ) {
		try {
			const obj = JSON.parse( str );
			/**
			 * Handle non-exception-throwing cases:
			 * Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			 * but... JSON.parse(null) returns null, and typeof null === "object",
			 * so we must check for that, too. Thankfully, null is falsy, so this suffices:
			 * */
			return ( obj && typeof obj === 'object' ) ? obj : [];
		} catch ( e ) {
			return [];
		}
	}

	isValidJSON( str : string ) : boolean {
		try {
			JSON.parse( str );
			return true;
		} catch ( e ) {
			return false;
		}
	}

	slugVietnamese( title : string ) {
		let str    = title;
		str        = str.replace( /^\s+|\s+$/g , '' );
		str        = str.toLowerCase();
		const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;';
		const to   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------';
		for ( let i = 0 ; i <= from.length ; i++ ) {
			str = str.replace( new RegExp( from.charAt( i ) , 'g' ) , to.charAt( i ) );
		}

		str = str.replace( /[^a-z\d -]/g , '' ).replace( /\s+/g , '-' ).replace( /-+/g , '-' );
		return str;
	}

	encodeHTML( text : string ) : string {
		//return text.replace( /&/g , '&amp;' ).replace( /</g , '&lt;' ).replace( />/g , '&gt;' ).replace( /"/g , '&quot;' ).replace( /'/g , '&apos;' );
		return text ? text.replace( /[&<>'"]/g , tag => ( { '&' : '&amp;' , '<' : '&lt;' , '>' : '&gt;' , '\'' : '&apos;' }[ tag ] || tag ) ) : '';
	}

	decodeHTML( text : string ) : string {
		return text.replace( /&apos;/g , '\'' ).replace( /&quot;/g , '"' ).replace( /&gt;/g , '>' ).replace( /&lt;/g , '<' ).replace( /&amp;/g , '&' );
	}


	numberWithCommas( number : number ) : string {
		return number.toLocaleString( 'vi-VN' , { style : 'currency' , currency : 'VND' } );
	}

	safePhoneNumbers( phone : string , numberToShow = 4 ) : string {
		return phone && phone.length ? new Array( phone.length - numberToShow + 1 ).join( '*' ) + phone.slice( -numberToShow ) : '';
	}

	safeEmail( email : string ) : string {
		if ( !email || email.length < 5 ) {
			return '';
		}
		const arrEmail = email.split( '@' );
		if ( arrEmail[ 0 ].length < 2 ) {
			return email;
		}
		const trailingCharsIntactCount2 = Math.floor( arrEmail[ 0 ].length / 2 );
		arrEmail[ 0 ]                   = arrEmail[ 0 ].slice( 0 , trailingCharsIntactCount2 ) + new Array( arrEmail[ 0 ].length - trailingCharsIntactCount2 + 1 ).join( '*' );
		return arrEmail.join( '@' );
	}

	getYoutubeIdFromUrl( url : string ) : string {
		if ( Is.empty( url ) ) {
			return '';
		}
		const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		return url.match( regex ) ? RegExp.$2 : url;
	}

	removeAscent( str : string ) {
		if ( str === null || str === undefined ) {
			return str;
		}
		str = str.toLowerCase();
		str = str.replace( /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g , 'a' );
		str = str.replace( /è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g , 'e' );
		str = str.replace( /ì|í|ị|ỉ|ĩ/g , 'i' );
		str = str.replace( /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g , 'o' );
		str = str.replace( /ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g , 'u' );
		str = str.replace( /ỳ|ý|ỵ|ỷ|ỹ/g , 'y' );
		str = str.replace( /đ/g , 'd' );
		return str;
	}

	formatSQLTimeStamp( date : Date ) : string {
		const d = new Date( date.toUTCString() );
		return this.formatSQLDateTime( d );
	}

	formatSQLDateTime( date : Date ) : string {
		const y   = date.getFullYear().toString();
		const m   = ( date.getMonth() + 1 ).toString().padStart( 2 , '0' );
		const d   = date.getDate().toString().padStart( 2 , '0' );
		const h   = date.getHours().toString().padStart( 2 , '0' );
		const min = date.getMinutes().toString().padStart( 2 , '0' );
		const sec = date.getSeconds().toString().padStart( 2 , '0' );
		//'YYYY-MM-DD hh:mm:ss' type of sql DATETIME format
		return `${ y }-${ m }-${ d } ${ h }:${ min }:${ sec }`;
	}

	formatSQLDate( date : Date ) : string {
		const y = date.getFullYear().toString( 10 );
		const m = ( date.getMonth() + 1 ).toString().padStart( 2 , '0' );
		const d = date.getDate().toString().padStart( 2 , '0' );
		//'YYYY-MM-DD' type of sql DATETIME format
		return `${ y }-${ m }-${ d }`;
	}

	strToSQLDate( input : string ) : string {
		const date = input ? this.dateFormatWithTimeZone( input ) : null;
		return date ? this.formatSQLDate( date ) : '';
	}

	uniqueId() : string {
		const head = Date.now().toString( 36 );
		const tail = Math.random().toString( 36 ).substr( 2 );
		return head + tail;
	}

	copyToClipboard( text : string ) : void {
		if ( navigator.clipboard?.writeText ) {
			void navigator.clipboard.writeText( text );
		}
	}

	shallowClone( obj : Object ) : Object {
		return Object.assign( {} , obj );
	}

	countWords( str : string ) : number {
		return str.split( /[^a-zA-Z-]+/ ).filter( Boolean ).length;
	}

	randomIntegerInRange( min : number , max : number ) : number {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}

	minDate( dates : Date[] ) : Date {
		const arrNumber = dates.filter( Boolean ).map( d => d.getTime() );
		return new Date( Math.min( ... arrNumber ) );
	}

	// const array = [
	//  new Date(2017, 4, 13),
	//  new Date(2018, 2, 12),
	//  new Date(2016, 0, 10),
	//  new Date(2016, 0, 9)
	//  ];
	//  minDate(array); // 2016-01-08T22:00:00.000Z

	maxDate( dates : Date[] ) : Date {
		const arrNumber = dates.filter( Boolean ).map( d => d.getTime() );
		return new Date( Math.max( ... arrNumber ) );
	}

	isSameDate( dateOne : Date , dateTwo : Date ) : boolean {
		return dateOne.toISOString() === dateTwo.toISOString();
	}

	isBeforeDate( dateOne : Date , dateTwo : Date ) : boolean {
		return dateOne < dateTwo;
	}

	isAfterDate( dateOne : Date , dateTwo : Date ) : boolean {
		return dateOne > dateTwo;
	}

	isBrowserTabFocused = () => !document.hidden;

	/*paramsBuilder( params ) : HttpParams {
	 let _params = new HttpParams();
	 if ( params ) {
	 const _paramsKey = Object.keys( params );
	 if ( _paramsKey.length ) {
	 _paramsKey.forEach( k => {
	 _params = _params.set( k , params[ k ] );
	 } );
	 }
	 }
	 return _params;
	 }

	 paramsConditionBuilder( conditions : OvicConditionParam[] , params : HttpParams = null ) : HttpParams {
	 const newHttpParams = params || new HttpParams();
	 return conditions.reduce( ( prm , condtn , i ) => {
	 const key     = 'condition[' + i + '][key]';
	 const value   = 'condition[' + i + '][value]';
	 const compare = 'condition[' + i + '][compare]';
	 prm           = prm.append( key , condtn.conditionName || '' );
	 prm           = prm.append( value , condtn.value || '' );
	 prm           = prm.append( compare , condtn.condition || '' );
	 if ( condtn[ 'orWhere' ] ) {
	 const type = 'condition[' + i + '][type]';
	 prm        = prm.append( type , condtn[ 'orWhere' ] );
	 }
	 return prm;
	 } , newHttpParams );
	 }*/

	generateCode( length : number = 16 , dictionary : string = null ) : string {
		const permittedChars       = dictionary || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ&';
		const permittedCharsLength = permittedChars.length;
		let result                 = '';
		const usedList             = [];
		for ( let i = 0 ; i < length ; i++ ) {
			let position = Math.floor( Math.random() * permittedCharsLength );
			if ( usedList.includes( position ) ) {
				while ( usedList.includes( position ) ) {
					position = Math.floor( Math.random() * permittedCharsLength );
				}
			}
			usedList.unshift( position );
			usedList.length = 5;
			result          = ''.concat( result , permittedChars[ position ] );
		}
		return result;
	}

	capitalizedString( data : string ) : string {
		return data[ 0 ].toUpperCase() + data.slice( 1 );
	}

	dateFormatWithTimeZone( date : Date | string , timeZone = 'Asia/Ho_Chi_Minh' ) : Date {
		if ( typeof date === 'string' ) {
			return new Date(
				new Date( date ).toLocaleString( 'en-US' , { timeZone } )
			);
		}
		return new Date(
			date.toLocaleString( 'en-US' , { timeZone } )
		);
	}
}
