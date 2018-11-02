//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EnvironmentService } from './environment.service';

@Injectable()
export class ExportService {

  private headers: Headers = new Headers({ 'Content-Type': 'text/csv' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});
  private baseUrl: string;

  constructor(private _http: Http,
    private _environmentService: EnvironmentService) {
        // this.baseUrl = this._environmentService.apiUrl;
        this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
}

  createGlnCsvForNationalUpload() {
      return this._http.get(`${this.baseUrl}api/create-national-gln-csv`, this.options)
            .map((resp: Response) => resp.json())
            .catch(this.handleError);
   }

  downloadGlnCsvForNationalUpload() {
    let win = window.open(`${this.baseUrl}api/download-national-gln-csv`, '_blank');
   }

    private handleError(error: any): Observable<any> {
        console.error(error);
        return Observable.throw(error.json || 'Server Error');
    }

}
