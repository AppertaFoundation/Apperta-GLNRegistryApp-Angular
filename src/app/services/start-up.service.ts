//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { IContact } from './../shared/interfaces/icontact';
import { IIpr } from './../shared/interfaces/Iipr';
import { Ipr } from './../shared/types/ipr';
import { IUser } from './../shared/interfaces/iuser';
import { User } from './../shared/types/user';
import { IGln } from './../shared/interfaces/igln';
import { Gln } from './../shared/types/gln';
import { IGlnTagType } from '../shared/interfaces/igln-tag-type';

import { EnvironmentService } from './environment.service';
import { PrimaryContactService } from './primary-contact.service';
import { IprService } from './ipr.service';
import { AuthenticationService } from './authentication.service';
import { MessagesService } from './messages.service';
import { LoadingService } from './loading.service';
import { TagService } from './tag.service';
import { GlnService } from './gln.service';

@Injectable()
export class StartUpService implements OnInit {

  private userSubject = new BehaviorSubject<IUser>(new User());
  user$ = this.userSubject.asObservable();

  private iprSubject = new BehaviorSubject<IIpr>(new Ipr());
  ipr$ = this.iprSubject.asObservable();

  private primaryContactsSubject = new BehaviorSubject<IContact[]>([]);
  primaryContacts$ = this.primaryContactsSubject.asObservable();

  private tagTypesSubject = new BehaviorSubject<IGlnTagType[]>([]);
  tagTypes$ = this.tagTypesSubject.asObservable();

    // Primary GLN (top tier GLN)
  private primaryGlnSubject = new BehaviorSubject<IGln>(new Gln());
  primaryGln$ = this.primaryGlnSubject.asObservable();

  isAdmin = false;
  iprImageEndpoint: string;
  apiUrl: string;

  constructor(private _authenticationService: AuthenticationService,
                private _iprService: IprService,
                private _glnService: GlnService,
                private _tagService: TagService,
                private _primaryContactService: PrimaryContactService,
                private _messagesService: MessagesService,
                private _envService: EnvironmentService) {
                    this._envService.setApiUrl().subscribe(url => {
                        this.apiUrl = url.apiUrl;
                    });
                }

    ngOnInit(): void {

    }

    startUp() {

        if (!this.apiUrl) {
            setTimeout(() => {
                return Observable.forkJoin(this._authenticationService.getCurrentUser(),
                                            this._iprService.getIpr(),
                                            this._glnService.getPrimaryGln(),
                                            this._tagService.getAllTagTypes())
                                        .do(data => this.userSubject.next(data[0]))
                                        .do(data => this.isAdmin = data[0].AdminGroupUser)
                                        .do(data => this.iprSubject.next(data[1]))
                                        .do(data => this.iprImageEndpoint = data[1].IprImageAddress)
                                        .do(data => this.primaryGlnSubject.next(data[2]))
                                        .do(data => this.tagTypesSubject.next(data[3]))
                                        .publishLast().refCount()
                                        .catch(this.handlerError);
            }, 500);
        } else {
            return Observable.forkJoin(this._authenticationService.getCurrentUser(),
                                            this._iprService.getIpr(),
                                            this._glnService.getPrimaryGln(),
                                            this._tagService.getAllTagTypes())
                                        .do(data => this.userSubject.next(data[0]))
                                        .do(data => this.isAdmin = data[0].AdminGroupUser)
                                        .do(data => this.iprSubject.next(data[1]))
                                        .do(data => this.iprImageEndpoint = data[1].IprImageAddress)
                                        .do(data => this.primaryGlnSubject.next(data[2]))
                                        .do(data => this.tagTypesSubject.next(data[3]))
                                        .publishLast().refCount()
                                        .catch(this.handlerError);
        }
    }

    handlerError(err) {
        let errMessage: string;

        if ( err instanceof Response ) {

            errMessage = `${err.status} - ${err.statusText || ''},  ${err.json().Message}`;
            this._messagesService.error(errMessage);

        } else {
            errMessage = err.message ? err.message : err.toString();
            this._messagesService.error(errMessage);
        }

        return Observable.throw(errMessage);
    }

}
