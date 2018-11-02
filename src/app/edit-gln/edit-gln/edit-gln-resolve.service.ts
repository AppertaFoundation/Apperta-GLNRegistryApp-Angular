//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { EditGlnService } from './../edit-gln.service';

import { IGln } from './../../shared/interfaces/igln';

@Injectable()
export class EditGlnResolveService implements Resolve<Observable<IGln>> {

  id: number;

  constructor(private _editGlnService: EditGlnService) {
  }

  resolve(route: ActivatedRouteSnapshot) {

      this.id = route.params['id'];

      return this._editGlnService.getGlnById(this.id);
  }
}
