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

import { IIpr } from './../shared/interfaces/Iipr';

import { EnvironmentService } from './environment.service';

@Injectable()
export class IprService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  private baseUrl: string;

  constructor(private _http: Http,
            private _environmentService: EnvironmentService) {
    // this.baseUrl = this._environmentService.apiUrl;
    this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
  }

  getIpr(): Observable<IIpr> {
      if (!this.baseUrl) {
          setTimeout(() => {
            return this._http.get(`${this.baseUrl}api/Ipr`, this.options)
                .map((resp: Response) => <IIpr>resp.json())
                .catch(this.handleError);
          }, 500);
      } else {
          return this._http.get(`${this.baseUrl}api/Ipr`, this.options)
                .map((resp: Response) => <IIpr>resp.json())
                .catch(this.handleError);
      }
   }

  updateIpr(ipr: IIpr): Observable<IIpr> {
      return this._http.put(`${this.baseUrl}api/update-ipr`, ipr, this.options)
            .map((resp: Response) => <IIpr>resp.json())
            .catch(this.handleError);
   }

  private handleError(error: any): Observable<any> {
      console.error(error);
      return Observable.throw(error.json || 'Server Error');
  }

}
