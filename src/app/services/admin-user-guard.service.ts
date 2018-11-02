//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { MessagesService } from './messages.service';
import { Injectable } from '@angular/core';
import { StartUpService } from './../services/start-up.service';
import { CanActivate } from '@angular/router';

@Injectable()
export class AdminUserGuardService  implements CanActivate {

  constructor(private _startUpService: StartUpService,
            private _messagesService: MessagesService) { }

  canActivate(): boolean {

        if (this._startUpService.isAdmin) {
            return true;
        };

        this._messagesService.error('You are not an admin user, access to this section is denied!');
        return false;
  }
}
