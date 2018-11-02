//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

import { IContact } from './../../shared/interfaces/icontact';
import { IGln } from './../../shared/interfaces/igln';

import { LoadingService } from './../../services/loading.service';
import { MessagesService } from './../../services/messages.service';
import { EditGlnService } from './../../edit-gln/edit-gln.service';

@Component({
  selector: 'app-assign-primary-contact',
  templateUrl: './assign-primary-contact.component.html',
  styleUrls: ['./assign-primary-contact.component.css']
})
export class AssignPrimaryContactComponent implements OnInit {

  selectedGln$: Observable<IGln>;
  primaryContacts$: Observable<IContact[]>;
  selectedPrimaryContact$: Observable<IContact>;
  loading$: Observable<boolean>;

  selectedContactTitle = 'Selected Contact';
  currentContactTitle = 'Current Contact';

  viewContact = false;

  constructor(private _editGlnService: EditGlnService,
            private _messageService: MessagesService,
            private _loadingService: LoadingService,
            private _router: Router,  
            private _location: Location) { }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {

    this.selectedGln$ = this._editGlnService.gln$;
    this.primaryContacts$ = this._editGlnService.primaryContacts$;
    this.selectedPrimaryContact$ = this._editGlnService.selectedPrimaryContact$;
    this.loading$ = this._loadingService.loading$;

    this._editGlnService.getNextPrimaryContacts().do(loading => this._loadingService.loading())
                                                  .subscribe(success => {
                                                    this._loadingService.finishLoading();
                                                  },
                                                error => {
                                                  this._messageService.error('Unable to load primary contacts. ' + error);
                                                  this._loadingService.finishLoading();
                                                });
  }

  selectContact(contactId: number) {
      this._editGlnService.getNextPrimaryContact(contactId).do(loading => this._loadingService.loading())
                                                  .subscribe(success => {
                                                    this._loadingService.finishLoading();
                                                  },
                                                error => {
                                                  this._messageService.error('Unable to load primary contact. ' + error);
                                                  this._loadingService.finishLoading();
                                                });
  }

  toggleViewContact() {
    this.viewContact = !this.viewContact;
  }

  assignContact() {
    this._editGlnService.updateGlnContact().do(loading => this._loadingService.loading())
    .subscribe(
      succcess => {
        this._messageService.update('New primary contact successfully assigned to GLN .');
        window.scrollTo(0, 0 );
        this._loadingService.finishLoading();
        this._router.navigate(['search/edit-gln/ ' + this._editGlnService.gln.Id]);
      },
      error => {
        this._messageService.error('Unable to assign primary contact to GLN .');
        this._loadingService.finishLoading();
      });
  }
}
