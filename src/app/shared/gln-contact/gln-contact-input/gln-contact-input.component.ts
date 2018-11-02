//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

import { Titles } from './../../types/titles';
import { Contact } from './../../types/contact';
import { IContact } from './../../interfaces/icontact';
import { Salutations } from './../../types/salutations';

import { MessagesService } from './../../../services/messages.service';
import { AdminGlnPrimaryContactService } from './../../../admin-gln/admin-gln-primary-contact.service';
import { LoadingService } from './../../../services/loading.service';

@Component({
  selector: 'app-gln-contact-input',
  templateUrl: './gln-contact-input.component.html',
  styleUrls: ['./gln-contact-input.component.css']
})
export class GlnContactInputComponent implements OnInit {

  @Input()
  primaryContact: IContact = new Contact();

  primaryContact$: Observable<IContact>;
  loading$: Observable<boolean>;

  contactInputForm: FormGroup;

  validForm$: Observable<any>;
  editMode$: Observable<boolean>;

  activeTitle: string;

  options = new Salutations();
  default: string;

  subscriberTitle = 'Subscriber';

  constructor(private _fb: FormBuilder,
            private _adminGlnService: AdminGlnPrimaryContactService,
            private _loadingService: LoadingService,
            private _messagesService: MessagesService) { }

  ngOnInit() {
    this.contactInputForm = this.initForm();
    this.primaryContact$ = this._adminGlnService.primaryContact$;
    this.editMode$ = this._adminGlnService.editMode$;
    this.loading$ = this._loadingService.loading$;
    this.updateFormFromService();
    this.default = this.options.options[0];

  }

  initForm(): FormGroup {
    return this._fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'email': ['', Validators.compose([Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required])],
      'function': [''],
      'telephone': ['', Validators.compose([Validators.required])],
      'fax': [''],
      'active': [true],
      'id': [''],
      'salutation': ['']
    });
  }

  addNewPrimaryContact() {
    this.contactInputForm.reset();
    this.contactInputForm.markAsPristine();
    this._adminGlnService.createMode();
  }

  updateFormFromService() {
    this.primaryContact$.subscribe(pc => {this.contactInputForm.patchValue({
        name: pc.Name,
        email: pc.Email,
        function: pc.Function,
        telephone: pc.Telephone,
        fax: pc.Fax,
        active: pc.Active,
        id: pc.Id,
        salutation: pc.Salutation
      });
      this.setTitle(pc.Salutation);
      this.contactInputForm.markAsPristine();
    });

    this.primaryContact$.publishLast();
  }

  updateModelFromForm() {
    this.primaryContact.Name = this.contactInputForm.get('name').value;
    this.primaryContact.Email = this.contactInputForm.get('email').value;
    this.primaryContact.Telephone = this.contactInputForm.get('telephone').value;
    this.primaryContact.Function = this.contactInputForm.get('function').value;
    this.primaryContact.Fax = this.contactInputForm.get('fax').value;
    this.primaryContact.Active = this.contactInputForm.get('active').value;
    this.primaryContact.Id = this.contactInputForm.get('id').value;
    this.primaryContact.Salutation = this.contactInputForm.get('salutation').value;
  }

  submit() {
    this._loadingService.loading();
    this.updateModelFromForm();
    this._adminGlnService.updatePrimaryContact(this.primaryContact).subscribe(
      contacts => {
        this._messagesService.update('Primary contact has been updated successfully.');
        this._adminGlnService.repeatLastQuery();
        this.contactInputForm.markAsPristine();
        this._adminGlnService.createMode();
        this._adminGlnService.clearPrimaryContact();
        this._loadingService.finishLoading()
      },
      error => {
        this._messagesService.error('Primary contact could not be updated.');
        this._loadingService.finishLoading()
      }
    );
  }

  createPrimaryContact() {
    this._loadingService.loading()
    this.updateModelFromForm();
    this.primaryContact.Id = 0;
    this.primaryContact.Function = '';
    this._adminGlnService.createPrimaryContact(this.primaryContact).subscribe(
      contacts => {
        this._messagesService.update('New primary contact has been created.');
        this._adminGlnService.repeatLastQuery();
        this.updateFormFromService();
        this.contactInputForm.markAsPristine();
        this._adminGlnService.createMode();
        this._adminGlnService.clearPrimaryContact();
        this._loadingService.finishLoading()
      },
      error => {
        this._messagesService.error('New primary contact could not be created');
        this._loadingService.finishLoading()
      });
  }
  // changes active values for specified boolean types
  onValueChange(event: any, formControlName: string) {
      this.contactInputForm.get(formControlName).patchValue(event);
      this.contactInputForm.get(formControlName).markAsDirty();
  }

  setTitle(title: string) {
      let i = this.options.options.findIndex(t => t === title);

      if (i === -1) {
        this.default = this.options.options[0];
      } else {
        this.default = this.options.options[i];
      }
  }

  setTitles(event: string) {
    this.contactInputForm.get('salutation').markAsDirty();

    if (event === 'Please Select') {
      this.contactInputForm.patchValue({
            salutation: ''
        });
      } else {
          this.contactInputForm.patchValue({
              salutation: event
          });
      }
  }

}
