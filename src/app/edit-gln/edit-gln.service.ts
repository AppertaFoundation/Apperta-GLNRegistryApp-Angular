//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { LoadingService } from './../services/loading.service';
import { Router } from '@angular/router';
import { Contact } from './../shared/types/contact';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IContact } from './../shared/interfaces/IContact';
import { IGln } from './../shared/interfaces/igln';
import { Gln } from './../shared/types/gln';
import { IAddress } from './../shared/interfaces/iaddress';
import { Address } from './../shared/types/address';
import { IGlnSummary } from './../shared/interfaces/igln-summary';

import { MessagesService } from './../services/messages.service';
import { GlnService } from './../services/gln.service';
import { AddressService } from './../services/address.service';
import { PrimaryContactService } from './../services/primary-contact.service';

const UNKNOWN_GLN: Gln = new Gln();
const UNKNOWN_ADDRESS: Address = new Address();
const UNKNOWN_PRIMARY_CONTACT: Contact = new Contact();

@Injectable()
export class EditGlnService {

  // GLN being edited
  private glnSubject = new BehaviorSubject<IGln>(UNKNOWN_GLN);
  gln$ = this.glnSubject.asObservable();

  // Assigned address
  private currentAddressSubject = new BehaviorSubject<IAddress>(UNKNOWN_ADDRESS);
  currentAddress$ = this.currentAddressSubject.asObservable();

  // Assigned address
  private selectedAddressSubject = new BehaviorSubject<IAddress>(UNKNOWN_ADDRESS);
  selectedAddress$ = this.selectedAddressSubject.asObservable();

  // Current parent belonging to GLN being edited
  private currentParentGlnSubject = new BehaviorSubject<IGln>(UNKNOWN_GLN);
  currentParentGln$ = this.currentParentGlnSubject.asObservable();

  // GLN selected to be parent of above GLN
  private selectedParentGlnSubject = new BehaviorSubject<IGln>(UNKNOWN_GLN);
  selectedParentGln$ = this.selectedParentGlnSubject.asObservable();

  // Children of selected parent GLN above
  private childrenOfParentGlnSubject = new BehaviorSubject<IGln[]>([]);
  childrenOfParentGln$ = this.childrenOfParentGlnSubject.asObservable();

  // GLN selected primary Contact
  private selectedPrimaryContactSubject = new BehaviorSubject<IContact>(UNKNOWN_PRIMARY_CONTACT);
  selectedPrimaryContact$ = this.selectedPrimaryContactSubject.asObservable();

  // All primary contacts
  private primaryContactsSubject = new BehaviorSubject<IContact[]>([]);
  primaryContacts$ = this.primaryContactsSubject.asObservable();

  // GLNs currently associated with GLN
  private associatedGlnsSubject = new BehaviorSubject<IGlnSummary[]>([]);
  associatedGlns$ = this.associatedGlnsSubject.asObservable();

  parentGln: string;

  contact: IContact;
  address: IAddress;
  primaryContact: IContact;
  gln: IGln;
  currentParent: IGln;
  selectedParent: IGln;

  constructor(private _http: Http,
                  private _messagesService: MessagesService,
                  private _glnService: GlnService,
                  private _addressService: AddressService,
                  private _primaryContactService: PrimaryContactService,
                  private _loadingService: LoadingService,
                  private _router: Router) {
   }

   updateGlnForAssigning() {
      this.gln.ContactId = this.contact.Id;
      this.gln.AddressId = this.address.Id;
   }

   changeParent() {
      return this._glnService.changeParent(this.gln.Id, this.gln.ParentGln, this.selectedParent.OwnGln)
            .do(gln => this.gln = gln)
            .do(gln => this.glnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   assignParent(parentToAssign: IGln): Observable<IGln> {
      // This logic is to stop creating any parent child relationships above five tiers
      let newParent: string;
      if (parentToAssign.TierLevel >= 5) {
            newParent = parentToAssign.ParentGln;
      } else {
            newParent = parentToAssign.OwnGln;
      }

      if (this.gln.OwnGln !== newParent && this.gln.ParentGln !== newParent) {
            return this._glnService.changeParent(this.gln.Id, this.gln.ParentGln, newParent)
                  .do(loading => this._loadingService.loading())
                  .do(gln => this.gln = gln)
                  .do(gln => this.glnSubject.next(gln))
                  .publishLast().refCount()
                  .catch(this.handlerError);
      } else {
            return this.gln$.take(1);
      }
   }

   assignParentToPhysicalInit(parentToAssign: IGln, event: boolean) {
      if (parentToAssign.OwnGln !== this.gln.OwnGln && parentToAssign.OwnGln !== this.gln.ParentGln) {
            return this._glnService.changeParent(this.gln.Id, this.gln.ParentGln, parentToAssign.OwnGln)
                  .do(loading => this._loadingService.loading())
                  .do(gln => this.gln = gln)
                  .do(gln => this.gln.PhysicalType = event)
                  .do(gln => this.glnSubject.next(gln))
                  .publishLast().refCount()
                  .catch(this.handlerError)
                  .subscribe( success => {
                        this._loadingService.finishLoading();
                        this._messagesService.update('Parent GLN updated because of Physical Type change.');
                  },
                  error => {
                        this._loadingService.finishLoading();
                        this._messagesService.error('Error could not update parent GLN because of Physical Type change.');
                  });
      }
   }

   assignParentToPhysicalInitBGln(parentToAssign: string, event: boolean) {
      if (parentToAssign !== this.gln.OwnGln && parentToAssign !== this.gln.ParentGln) {
            return this._glnService.changeParent(this.gln.Id, this.gln.ParentGln, parentToAssign)
                  .do(loading => this._loadingService.loading())
                  .do(gln => this.gln = gln)
                  .do(gln => this.gln.PhysicalType = event)
                  .do(gln => this.glnSubject.next(gln))
                  .publishLast().refCount()
                  .catch(this.handlerError)
                  .subscribe( success => {
                        this._loadingService.finishLoading();
                        this._messagesService.update('Parent GLN updated because of Physical Type change.');
                  },
                  error => {
                        this._loadingService.finishLoading();
                        this._messagesService.error('Error could not update parent GLN because of Physical Type change.');
                  });
      }
   }

   getParentGlnById(id: number) {
      return this._glnService.getGlnById(id)
            .do(gln => this.selectedParent = gln)
            .do(gln => this.selectedParentGlnSubject.next(gln))
            .switchMap(() => this.getChildrenOfParentGlnById(id))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   getCurrentParent(parentGln: string) {
      return this._glnService.getGlnByGln(parentGln)
            .do(gln => this.parentGln = gln.ParentGln)
            .do(gln => this.currentParent = gln)
            .do(gln => this.currentParentGlnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   getSelectedParentByGln(parentGln: string) {
      return this._glnService.getGlnByGln(parentGln)
            .do(gln => this.parentGln = gln.ParentGln)
            .do(gln => this.selectedParent = gln)
            .do(gln => this.selectedParentGlnSubject.next(gln))
            .switchMap((gln) => this.getChildrenOfParentGlnById(gln.Id))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   getChildrenOfParentGlnById(parentId: number) {
      return this._glnService.getChildrenByParentId(parentId)
            .do(gln => this.childrenOfParentGlnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   getGlnById(glnId: number): Observable<IGln> {
      return this._glnService.getGlnById(glnId)
            .do(gln => this.gln = gln)
            .do(gln => this.glnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

  updateGln(updatedGln: IGln): Observable<IGln> {
      return this._glnService.updateGln(updatedGln)
            .do(gln => this.gln = gln)
            .do(gln => this.glnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
    }

  updateGlnAddress(): Observable<IGln> {
      this.gln.AddressId = this.address.Id;
      return this._glnService.updateGln(this.gln)
            .do(gln => this.gln = gln)
            .do(gln => this.glnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
    }

  updateGlnContact(): Observable<IGln> {
      this.gln.ContactId = this.contact.Id;
      return this._glnService.updateGln(this.gln)
            .do(gln => this.gln = gln)
            .do(gln => this.glnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
    }

   getNextAddress(id: number): Observable<IAddress> {
      return this._addressService.getAddressById(id)
            .do(address => this.address = address)
            .do(address => this.selectedAddressSubject.next(address))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   getSelectedParentAddress(): Observable<IAddress> {
      return this._addressService.getAddressByGln(this.gln.ParentGln)
            .do(address => this.address = address)
            .do(address => this.selectedAddressSubject.next(address))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   getNextPrimaryContact(id: number): Observable<IContact> {
      return this._primaryContactService.getPrimaryContactById(id)
            .do(contact => this.contact = contact)
            .do(contact => this.selectedPrimaryContactSubject.next(contact))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

   getNextPrimaryContacts(): Observable<IContact[]> {
      return this._primaryContactService.getAllPrimaryContacts()
            .do(contact => this.primaryContactsSubject.next(contact))
            .publishLast().refCount()
            .catch(this.handlerError);
   }

  getGlnsAssociatedWithGln(glnId: number) {
    return this._glnService.getAssociatedGlnsByParentId(glnId)
            .do(associatedGlns => this.associatedGlnsSubject.next(associatedGlns))
            .publishLast().refCount()
            .catch(this.handlerError);
  }

getNextFunctionalGln(): Observable<IGln> {
      return this._glnService.getNextUnassignedGln()
            .do(gln => this.glnSubject.next(gln))
            .do(gln => this.gln = gln)
            .publishLast().refCount()
            .catch(this.handlerError);
}

assignAddressGetNextFunctionalGln(addressId: number): Observable<IGln> {
      return this._glnService.assignAddressGetNextUnassignedGln(addressId)
            .do(gln => this.glnSubject.next(gln))
            .do(gln => this.gln = gln)
            .publishLast().refCount()
            .catch(this.handlerError);
}

newParentSelection(parentGln: IGln) {
      this.selectedParentGlnSubject.next(parentGln);
      this.selectedParentGln$.publishLast().refCount();

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
