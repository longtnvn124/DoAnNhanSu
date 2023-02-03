import { Inject, Injectable } from '@angular/core';
import { getFileDir, getLinkDownload, getLinkMedia } from '@env';
import { HttpClient, HttpEvent, HttpEventType, HttpParams, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { OvicFile, Download, Upload } from '@core/models/file';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, scan } from 'rxjs/operators';
import { Dto } from '@core/models/dto';
import { saveAs } from 'file-saver';
import { SAVER, Saver } from '@core/providers/saver.provider';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly media = getLinkMedia('');
  private readonly dir = getFileDir();
  private readonly download = getLinkDownload(null);

  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver
  ) { }

  /**********************************************************
   * Convert, prebuild and packet functions
   * ********************************************************/
  private static packFiles(files: File[]): FormData {
    const formData = new FormData();
    if (files && files.length) {
      for (const file of files) {
        formData.append('upload', file);
      }
    }
    return formData;
  }

  /**************************************************************
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   *************************************************************/
  formatBytes(bytes, decimals = 2): string {
    if (!bytes || bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  base64ToFile(base64: string, fileName: string): File {
    const bytes = base64.split(',')[0].indexOf('base64') >= 0 ? atob(base64.split(',')[1]) : (<any>window).unescape(base64.split(',')[1]);
    const mime = base64.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new File([ia], fileName, { lastModified: new Date().getTime(), type: mime });
  }

  blobToBase64(blob: Blob | File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader;
      reader.onerror = () => resolve(null);
      reader.onload = () => resolve(reader.result.toString());
      reader.readAsDataURL(blob);
    });
  }

  getUploadDate(file: OvicFile): string {
    let result = '__/__/____ --:--';
    const fileDate = file['created_at'] || file['createdTime'];
    if (fileDate) {
      const postIn = new Date(fileDate),
        date = postIn.getDate() < 10 ? '0'.concat(postIn.getDate().toString()) : postIn.getDate().toString(),
        month = postIn.getMonth() < 10 ? '0'.concat((postIn.getMonth() + 1).toString()) : (postIn.getMonth() + 1).toString(),
        year = postIn.getFullYear().toString(),
        hour = postIn.getHours() < 10 ? '0'.concat(postIn.getHours().toString()) : postIn.getHours().toString(),
        min = postIn.getMinutes() < 10 ? '0'.concat(postIn.getMinutes().toString()) : postIn.getMinutes().toString();
      result = ''.concat(date, '/', month, '/', year, ' ', hour, ':', min);
    }
    return result;
  }

  deleteFiles(ids: number[]): Observable<any> {
    return this.http.delete<Dto>(''.concat(this.media, ids.join(',')));
  }

  deleteFile(id: number): Observable<any> {
    return this.http.delete<Dto>(''.concat(this.media, id.toString()));
  }

  getFileInfo(ids: string): Observable<OvicFile[]> {
    return this.http.get<Dto>(''.concat(this.media, ids)).pipe(map(res => res.data));
  }

  uploadFileWidthProgress(file, donvi_id: number = 0, user_id: number = 0): Observable<Upload> {
    const params = new HttpParams().set('donvi_id', donvi_id.toString()).set('user_id', user_id.toString());
    const initialState: Upload = { state: 'PENDING', progress: 0 };
    const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
      if (this.isHttpProgressEvent(event)) {
        return { progress: event.total ? Math.round((100 * event.loaded) / event.total) : upload.progress, state: 'IN_PROGRESS' };
      }
      if (this.isHttpResponse(event)) {
        return { progress: 100, state: 'DONE' };
      }
      return upload;
    };
    return this.http.post(this.media, FileService.packFiles([file]), { params: params, reportProgress: true }).pipe(scan(calculateState, initialState));
  }

  updateFileInfo(id: number, info: { title?: string; donvi_id?: number; user_id?: number; shared?: string }): Observable<number> {
    return this.http.put<Dto>(''.concat(this.media, id.toString()), info).pipe(map(res => res.data));
  }

  /**********************************************************
   * Download file functions
   * ********************************************************/
  downloadFileByName(fileName: string, title: string): Promise<boolean> {
    return new Promise(resolve => {
      this.getFileAsBlobByName(fileName).subscribe(
        {
          next: stream => {
            saveAs(stream, title);
            resolve(true);
          },
          error: () => resolve(false)
        }
      );
    });
  }

  /**********************************************************
   * Load folder and year
   * ********************************************************/
  loadDir(): Observable<any> {
    return this.http.get(this.dir);
  }

  getFileList(params: any): Observable<OvicFile[]> {
    const _params = ['orderby=created_at', 'order=desc'];
    Object.keys(params).forEach(function (key) {
      if (params[key]) {
        _params.push(`${key}=${params[key]}`);
      }
    });
    return this.http.get<Dto>(this.media, { params: new HttpParams({ fromString: _params.join('&') }) }).pipe(map(res => res.data));
  }

  getFileSize(file: OvicFile): string {
    const fileSize = file.size ? (typeof file.size === 'string' ? parseInt(file.size, 10) : file.size) : 0;
    return this.formatBytes(fileSize);
  }

  getFileAsBlobByName(fileName: string): Observable<Blob> {
    return this.http.get(''.concat(this.download, fileName), { responseType: 'blob' });
  }

  getFileAsObjectUrl(nameOrId: string): Observable<string> {
    return this.http.get(''.concat(this.download, nameOrId), { responseType: 'blob' }).pipe(map(res => URL.createObjectURL(res)));
  }

  /**************************************************************
   * Download and progress
   * ************************************************************/
  isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response;
  }

  isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
    return (event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress);
  }

  downloadWithProgress(id: number, filename?: string): Observable<Download> {
    return this.downloadExternalWithProgress(''.concat(this.download, id.toString()), filename || null);
  }

  downloadExternalWithProgress(url: string, filename?: string): Observable<Download> {
    const saver = filename ? blob => this.save(blob, filename) : null;
    return this.http.get(url, { reportProgress: true, observe: 'events', responseType: 'blob' }).pipe(this._downloadProcess(saver));
  }

  private _downloadProcess(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
    return (source: Observable<HttpEvent<Blob>>) => source.pipe(
      scan(
        (download: Download, event): Download => {
          if (this.isHttpProgressEvent(event)) {
            return {
              progress: event.total ? Math.round((100 * event.loaded) / event.total) : download.progress,
              state: 'IN_PROGRESS',
              content: null
            };
          }
          if (this.isHttpResponse(event)) {
            if (saver) {
              saver(event.body);
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body
            };
          }
          return download;
        },
        { state: 'PENDING', progress: 0, content: null }
      ),
      distinctUntilChanged((a, b) => a.state === b.state && a.progress === b.progress && a.content === b.content)
    );
  }

  getImageContentFromLocalAssesFile(file: string): Observable<string> {
    return this.http.get(file, { responseType: 'blob' }).pipe(map(res => URL.createObjectURL(res)));
  }

  getImageContent(name_or_id: string): Observable<string> {
    return this.http.get(''.concat(this.download, name_or_id), { responseType: 'blob' }).pipe(map(res => URL.createObjectURL(res)));
  }

  getImageContentByUrl(urlFile: string): Observable<string> {
    return this.getFileContentByUrl(urlFile);
  }

  getFileContentByUrl(urlFile: string): Observable<string> {
    return this.http.get(urlFile, { responseType: 'blob' }).pipe(map(res => URL.createObjectURL(res)));
  }

  uploadFiles(arrFiles, donvi_id: number, user_id: number): Observable<OvicFile[]> {
    const params = new HttpParams().set('donvi_id', donvi_id.toString()).set('user_id', user_id.toString());
    return this.http.post<Dto>(this.media, FileService.packFiles(arrFiles), { params: params }).pipe(map(res => res.data));
  }
}
