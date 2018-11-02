//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IGln } from './../shared/interfaces/igln';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { EditGlnService } from './../edit-gln/edit-gln.service';
import { AssignFunctionalService } from './assign-functional.service';

@Injectable()
export class AssignFunctionalResolveService  implements Resolve<Observable<IGln>> {

  id: number;
  addressId: number;
  gln: IGln;

  constructor(private _assignFunctionalService: AssignFunctionalService,
              private _editGlnService: EditGlnService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
      this.id = route.params['id'];
      this._assignFunctionalService.toAssociateId = this.id;
      this.addressId = route.params['addressId'];

      // return this._editGlnService.getNextFunctionalGln();
      return this._editGlnService.assignAddressGetNextFunctionalGln(this.addressId);

  }
}
