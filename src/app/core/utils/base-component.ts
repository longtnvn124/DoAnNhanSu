import { BehaviorSubject , defer , Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export abstract class BaseComponent {
	public states$ = new BehaviorSubject<'error' | 'success' | 'loading'>( 'loading' );

	public observerLoadingState<T>() : ( source : Observable<T> ) => Observable<T> {
		return source => {
			return defer( () => {
				this.states$.next( 'loading' );
				return source.pipe(
					tap( {
						next  : () => this.states$.next( 'success' ) ,
						error : () => this.states$.next( 'error' )
					} )
				);
			} );
		};
	}
}
