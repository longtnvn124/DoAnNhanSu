/**
 * Generate Browser Unique Signature (fingerprint)
 */
export const BrowserSignature = () => {
	// Count Browser window object keys
	const windowCount = () => {
		const keys = [];
		// tslint:disable-next-line:forin
		for ( const i in window ) {
			keys.push( i );
		}
		return keys.length.toString( 36 );
	};
	// window obj and navigator aggregate
	const pad         = ( str : string , size : number ) => {
		return ( new Array( size + 1 ).join( '0' ) + str ).slice( -size );
	};

	// Browser mimiTypes and User Agent count
	const navi        = ( navigator.mimeTypes.length + navigator.userAgent.length ).toString( 36 );
	const padString   = pad( navi + windowCount() , 4 );
	// Browser screen specific properties
	const width       = window.screen.width.toString( 36 );
	const height      = window.screen.height.toString( 36 );
	const availWidth  = window.screen.availWidth.toString( 36 );
	const availHeight = window.screen.availHeight.toString( 36 );
	const colorDepth  = window.screen.colorDepth.toString( 36 );
	const pixelDepth  = window.screen.pixelDepth.toString( 36 );
	// Base64 encode
	return window.btoa( padString + width + height + availWidth + availHeight + colorDepth + pixelDepth );
};
