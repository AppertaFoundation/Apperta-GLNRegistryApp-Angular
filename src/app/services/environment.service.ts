//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Http, Response } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { environment } from './../../environments/environment';

@Injectable()
export class EnvironmentService {

    apiUrl: string;
    appTitle: string;

    constructor(
        private _http: Http) {
    }

    setAllSettings() {
        return this._http.get('./../../assets/settings.json')
            .map((res: Response) => <any>res.json())
            .do(settings => {
                this.apiUrl = settings.apiUrl;
                this.appTitle = settings.appTitle;
            });
    }

    setAppTitle() {
        return this._http.get('./../../assets/settings.json')
                            .map((res: Response) => <any>res.json())
                            .do(settings => {
                                console.log('Title: ', settings.appTitle);
                                this.appTitle = settings.appTitle;
                            });
    }

    setApiUrl() {
        return this._http.get('./../../assets/settings.json')
                            .map((res: Response) => <any>res.json())
                            .do(settings => {
                                console.log('url: ', settings.apiUrl);
                                this.apiUrl = settings.apiUrl;
                            });
    }
}
