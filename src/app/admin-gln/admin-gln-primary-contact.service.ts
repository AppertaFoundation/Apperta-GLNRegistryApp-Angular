//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RequestOptions, Headers, Http, Response } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';

import { Contact } from './../shared/types/contact';
import { IContact } from './../shared/interfaces/IContact';

import { ContactQuery } from './../shared/types/contact-query';
import { IContactQuery } from './../shared/interfaces/iContactQuery';

import { GlnQueryResult } from './../shared/types/gln-query-result';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';

import { MessagesService } from './../services/messages.service';
import { PrimaryContactService } from './../services/primary-contact.service';

@Injectable()
export class AdminGlnPrimaryContactService implements OnInit {

  private primaryContactsSubject = new BehaviorSubject<IContact[]>([]);
  primaryContacts$: Observable<IContact[]> = this.primaryContactsSubject.asObservable();

  private primaryContactSubject = new BehaviorSubject<IContact>(new Contact());
  primaryContact$: Observable<IContact> = this.primaryContactSubject.asObservable();

  private previousPrimaryContactSubject = new BehaviorSubject<IContact>(new Contact());
  previousPrimaryContact$: Observable<IContact> = this.primaryContactSubject.asObservable();

  private replacementPrimaryContactSubject = new BehaviorSubject<IContact>(new Contact());
  replacementPrimaryContact$: Observable<IContact> = this.replacementPrimaryContactSubject.asObservable();

  // Primary Contact query results sent to API
  private primaryContactQuerySubject = new BehaviorSubject<IContactQuery>(new ContactQuery());
  primaryContactQuery$ = this.primaryContactQuerySubject.asObservable();

  // Primary Contact query results sent back from API
  private primaryContactQueryResultsSubject = new BehaviorSubject<IGlnQueryResult>(new GlnQueryResult());
  primaryContactQueryResults$ = this.primaryContactQueryResultsSubject.asObservable();

  private editModeSubject = new BehaviorSubject<boolean>(false);
  editMode$: Observable<boolean> = this.editModeSubject.asObservable();

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  replacementId: number;
  deactivateId: number;

  constructor(private _http: Http, private _messagesService: MessagesService, private _primaryContactService: PrimaryContactService) { }

    ngOnInit(): void {
    }

  clearPrimaryContact() {
    this.primaryContactSubject.next(new Contact());
  }

  createMode() {
    this.editModeSubject.next(false);
  }

  editMode() {
    this.editModeSubject.next(true);
  }

  getAdditionalContactQueryResult(queryObj: IContactQuery) {
    this.primaryContactQuerySubject.next(queryObj);
    return this._primaryContactService.getPrimaryContactQueryResults(queryObj)
                    .do(queryResult => this.primaryContactQueryResultsSubject.next(queryResult))
                    .publishLast().refCount()
                    .catch(this.handlerError);
  }

  repeatLastQuery() {
    this.primaryContactQuery$.take(1)
        .switchMap(query => this.getAdditionalContactQueryResult(query))
        .subscribe(query => {});
  }


  getPrimaryContacts(): Observable<IContact[]> {
      return this._primaryContactService.getAllPrimaryContacts()
          .do(contacts => this.primaryContactsSubject.next(contacts))
          .publishLast().refCount()
          .catch(this.handlerError);
  }

  getPrimaryContact(id: number): Observable<IContact> {
      return this._primaryContactService.getPrimaryContactById(id)
          .do(() => this.editModeSubject.next(true))
          .do(contact => this.primaryContactSubject.next(contact))
          .publishLast().refCount()
          .catch(this.handlerError);
  }

  updatePrimaryContact(contactToUpdate: IContact): Observable<IContact> {
      return this._primaryContactService.updatePrimaryContact(contactToUpdate)
          .do(contact => this.primaryContactSubject.next(contact))
          .publishLast().refCount()
          .catch(this.handlerError);
  }

   getNextPrimaryContact(id: number): Observable<IContact> {
      return this._primaryContactService.getPrimaryContactById(id)
            .do(() => this.editModeSubject.next(true))
            .do(primaryContact => this.primaryContactSubject.next(primaryContact))
            .publishLast().refCount()
            .catch(this.handlerError);
   }


  createPrimaryContact(newContact: IContact): Observable<IContact> {
      return this._primaryContactService.addPrimaryContact(newContact)
          .do(contact => this.primaryContactSubject.next(contact))
          .publishLast().refCount()
          .catch(this.handlerError);
  }

    deactivatePrimaryContact(): Observable<IContact> {
        this.updateIds();
        return this._primaryContactService.deactivatePrimaryContact(this.deactivateId, this.replacementId)
            .do(contact => this.primaryContactSubject.next(contact))
            .publishLast().refCount()
            .catch(this.handlerError);
    }

    assignReplacementContact(contact: IContact) {
        this.replacementPrimaryContactSubject.next(contact);
        return this.deactivatePrimaryContact();
    }

    private updateIds() {
        this.replacementPrimaryContact$.subscribe(
            contact => {
                this.replacementId = contact.Id;
            }
        );

        this.primaryContact$.subscribe(
            contact => {
                this.deactivateId = contact.Id;
            }
        );

        this.primaryContact$.publishLast();
        this.replacementPrimaryContact$.publishLast();
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
