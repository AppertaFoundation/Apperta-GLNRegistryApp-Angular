//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { StartUpService } from './../../services/start-up.service';

import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { SearchGlnService } from './search-gln.service';
import { LoadingService } from './../../services/loading.service';

@Injectable()
export class SearchGlnResolveService {

  constructor(private _searchService: SearchGlnService,
                private _startUpService: StartUpService,
                private _loadingService: LoadingService) { }

    resolve(): void {

        // this._searchService.getPrimaryGln().subscribe(success => {
        //                                         this._loadingService.finishLoading();
        //                                     });
    }

}
