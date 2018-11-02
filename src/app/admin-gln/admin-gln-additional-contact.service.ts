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

import { IAdditionalContact } from './../shared/interfaces/iadditional-contact';
import { AdditionalContact } from './../shared/types/additional-contact';

import { AdditionalContactQuery } from './../shared/types/additional-contact-query';
import { IAdditionalContactQuery } from './../shared/interfaces/iadditional-contact-query';

import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';
import { GlnQueryResult } from './../shared/types/gln-query-result';

// import { MessagesService } from './../services/messages.service';
import { AdditionalContactService } from './../services/additional-contact.service';

@Injectable()
export class AdminGlnAdditionalContactService {

  private additionalContactSubject = new BehaviorSubject<IAdditionalContact>(new AdditionalContact());
  additionalContact$: Observable<IAdditionalContact> = this.additionalContactSubject.asObservable();

  private replacementAdditionalContactSubject = new BehaviorSubject<IAdditionalContact>(new AdditionalContact());
  replacementAdditionalContact$: Observable<IAdditionalContact> = this.replacementAdditionalContactSubject.asObservable();

  // Address query results sent to API
  private additionalContactQuerySubject = new BehaviorSubject<IAdditionalContactQuery>(new AdditionalContactQuery());
  additionalContactQuery$ = this.additionalContactQuerySubject.asObservable();

  // Additional Contact query results sent back from API
  private additionalContactQueryResultsSubject = new BehaviorSubject<IGlnQueryResult>(new GlnQueryResult());
  additionalContactQueryResults$ = this.additionalContactQueryResultsSubject.asObservable();

  // GLN selected address
  private selectedAdditionalContactSubject = new BehaviorSubject<IAdditionalContact>(new AdditionalContact());
  selectedAdditionalContact$ = this.selectedAdditionalContactSubject.asObservable();
  // Edit mode
  private editSubject = new BehaviorSubject<boolean>(false);
  editMode$ = this.editSubject.asObservable();

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  private replacementId: number;
  private deactivateId: number;

  constructor(private _http: Http,
              private _additionalContactService: AdditionalContactService) { }

  createMode() {
    this.editSubject.next(false);
  }

  editMode() {
    this.editSubject.next(true);
  }

  clearAdditionalContact() {
      this.selectedAdditionalContactSubject.next(new AdditionalContact());
  }

  getAdditionalContactQueryResult(queryObj: IAdditionalContactQuery) {
    this.additionalContactQuerySubject.next(queryObj);
    return this._additionalContactService.getAdditionalContactQueryResults(queryObj)
                    .do(queryResult => this.additionalContactQueryResultsSubject.next(queryResult))
                    .publishLast().refCount();
  }

  repeatLastQuery() {
    this.additionalContactQuery$.take(1)
        .switchMap(query => this.getAdditionalContactQueryResult(query))
        .subscribe(query => {});
  }

    updateAdditionalContact(additionalContact: IAdditionalContact): Observable<IAdditionalContact> {
        return this._additionalContactService.updateAdditionalContact(additionalContact)
            .do(updatedAdditionalContact => this.additionalContactSubject.next(updatedAdditionalContact))
            .do(updatedAdditionalContact => this.selectedAdditionalContactSubject.next(updatedAdditionalContact))
            .publishLast().refCount();
  }

   getNextAdditionalContact(id: number): Observable<IAdditionalContact> {
      return this._additionalContactService.getAdditionalContactById(id)
            .do(() => this.editSubject.next(true))
            .do(additionalContact => this.selectedAdditionalContactSubject.next(additionalContact))
            .publishLast().refCount();
   }

  createAdditionalContact(newAdditionalContact: IAdditionalContact): Observable<IAdditionalContact> {
      return this._additionalContactService.addAdditionalContact(newAdditionalContact)
          .do(additionalContact => this.additionalContactSubject.next(additionalContact))
          .do(additionalContact => this.selectedAdditionalContactSubject.next(additionalContact))
          .publishLast().refCount();
  }

    deactivateAdditionalContact(): Observable<IAdditionalContact> {
        this.updateIds();
        return this._additionalContactService.deactivateAdditionalContact(this.deactivateId, this.replacementId)
            .do(additionalContact => this.additionalContactSubject.next(additionalContact))
            .publishLast().refCount();
    }

    assignReplacementAddress(additionalContact: IAdditionalContact) {
        this.replacementAdditionalContactSubject.next(additionalContact);
        this.deactivateAdditionalContact().subscribe();
    }

    private updateIds() {
        this.replacementAdditionalContact$.subscribe(
            contact => {
                this.replacementId = contact.Id;
            }
        );

        this.selectedAdditionalContact$.subscribe(
            contact => {
                this.deactivateId = contact.Id;
            }
        );

        this.selectedAdditionalContact$.publishLast();
        this.replacementAdditionalContact$.publishLast();
    }

}
