//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RequestOptions, Headers, Http, Response } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';

import { IAddress } from './../shared/interfaces/iaddress';
import { Address } from './../shared/types/address';
import { IAddressQuery } from './../shared/interfaces/iaddressQuery';
import { AddressQuery } from './../shared/types/address-query';

import { GlnQueryResult } from './../shared/types/gln-query-result';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';

import { environment } from './../../environments/environment';

import { MessagesService } from './../services/messages.service';
import { AddressService } from './../services/address.service';


@Injectable()
export class AdminGlnAddressService {

  private addressesSubject = new BehaviorSubject<IAddress[]>([]);
  addresses$: Observable<IAddress[]> = this.addressesSubject.asObservable();

  private addressSubject = new BehaviorSubject<IAddress>(new Address());
  address$: Observable<IAddress> = this.addressSubject.asObservable();

  private replacementAddressSubject = new BehaviorSubject<IAddress>(new Address());
  replacementAddress$: Observable<IAddress> = this.replacementAddressSubject.asObservable();

  private addressQuerySubject = new BehaviorSubject<IAddressQuery>(new AddressQuery());
  addressQuery$ = this.addressQuerySubject.asObservable();

  // Address query results sent back from API
  private addressQueryResultsSubject = new BehaviorSubject<IGlnQueryResult>(new GlnQueryResult());
  addressQueryResults$ = this.addressQueryResultsSubject.asObservable();

  // GLN selected address
  private selectedAddressSubject = new BehaviorSubject<IAddress>(new Address());
  selectedAddress$ = this.selectedAddressSubject.asObservable();
  // Edit mode
  private editSubject = new BehaviorSubject<boolean>(false);
  editMode$ = this.editSubject.asObservable();

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true });

  private replacementId: number;
  private deactivateId: number;

  constructor(private _http: Http, private _messagesService: MessagesService, private _addressService: AddressService) { }

  createMode() {
    this.editSubject.next(false);
  }

  editMode() {
    this.editSubject.next(true);
  }

  setNextAddress(address: IAddress) {
    this.selectedAddressSubject.next(address);
  }

  clearAddress() {
    this.selectedAddressSubject.next(new Address());
  }

  getAddressQueryResult(queryObj: IAddressQuery) {
      this.addressQuerySubject.next(queryObj);
    return this._addressService.getAddressQueryResults(queryObj)
                    .do(queryResult => this.addressQueryResultsSubject.next(queryResult))
                    .publishLast().refCount()
                    .catch(this.handlerError);
  }

  repeatLastQuery() {
    this.addressQuery$.take(1)
        .switchMap(query => this.getAddressQueryResult(query))
        .subscribe(query => {});
  }

    updateAddress(address: IAddress): Observable<IAddress> {
        return this._addressService.updateAddress(address)
            .do(updatedAddress => this.addressSubject.next(updatedAddress))
            .do(updatedAddress => this.selectedAddressSubject.next(updatedAddress))
            .publishLast().refCount()
            .catch(this.handlerError);
  }

   getNextAddress(id: number): Observable<IAddress> {
      return this._addressService.getAddressById(id)
            .do(() => this.editSubject.next(true))
            .do(address => this.selectedAddressSubject.next(address))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

  getAddressess(pageNumber: number, pageSize: number, searchTerm = ''): Observable<IAddress[]> {
      return this._addressService.getAddressBySearchTerm(pageNumber, pageSize, searchTerm)
          .do(addressess => this.addressesSubject.next(addressess))
          .publishLast().refCount()
          .catch(this.handlerError);
  }

  createAddress(newAddress: IAddress): Observable<IAddress> {
      return this._addressService.addAddress(newAddress)
          .do(address => this.addressSubject.next(address))
          .do(address => this.selectedAddressSubject.next(address))
          .publishLast().refCount()
          .catch(this.handlerError);
  }

    deactivateAddress(): Observable<IAddress> {
        this.updateIds();
        return this._addressService.deactivateAddress(this.deactivateId, this.replacementId)
            .do(address => this.addressSubject.next(address))
            .publishLast().refCount()
            .catch(this.handlerError);
    }

    assignReplacementAddress(address: IAddress) {
        this.replacementAddressSubject.next(address);
        this.deactivateAddress().subscribe();
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

    private updateIds() {
        this.replacementAddress$.subscribe(
            contact => {
                this.replacementId = contact.Id;
            }
        );

        this.selectedAddress$.subscribe(
            contact => {
                this.deactivateId = contact.Id;
            }
        );

        this.selectedAddress$.publishLast();
        this.replacementAddress$.publishLast();
    }

}
