//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.

import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { IContact } from './../../shared/interfaces/icontact';
import { AdminGlnPrimaryContactService } from './../admin-gln-primary-contact.service';

@Injectable()
export class AdminPrimaryContactResolveService implements Resolve<Observable<IContact[]>>  {

  constructor(private _adminGlnService: AdminGlnPrimaryContactService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this._adminGlnService.getPrimaryContacts();
  }
}
