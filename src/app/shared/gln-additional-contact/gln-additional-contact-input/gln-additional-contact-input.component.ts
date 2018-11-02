//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';

import { AdditionalContact } from './../../types/additional-contact';
import { IAdditionalContact } from './../../interfaces/iadditional-contact';
import { Salutations } from './../../types/salutations';

import { MessagesService } from './../../../services/messages.service';
import { AdminGlnAdditionalContactService } from './../../../admin-gln/admin-gln-additional-contact.service';
import { LoadingService } from './../../../services/loading.service';

@Component({
  selector: 'app-gln-additional-contact-input',
  templateUrl: './gln-additional-contact-input.component.html',
  styleUrls: ['./gln-additional-contact-input.component.css']
})
export class GlnAdditionalContactInputComponent implements OnInit {

  @Input()
  additionalContact: IAdditionalContact = new AdditionalContact();

  additionalContact$: Observable<IAdditionalContact>;
  loading$: Observable<boolean>;

  addContactInputForm: FormGroup;

  validForm$: Observable<any>;
  editMode$: Observable<boolean>;

  activeTitle: string;

  options = new Salutations();
  default: string;

  subscriberTitle = 'Subscribed';

  constructor(private _messagesService: MessagesService,
              private _adminGlnAdditionalContactService: AdminGlnAdditionalContactService,
              private _loadingService: LoadingService,
              private cdRef: ChangeDetectorRef,
              private _fb: FormBuilder) { }

  ngOnInit() {
    this.addContactInputForm = this.initForm();
    this.additionalContact$ = this._adminGlnAdditionalContactService.selectedAdditionalContact$;
    this.editMode$ = this._adminGlnAdditionalContactService.editMode$;
    this.loading$ = this._loadingService.loading$;
    this.updateFormFromService();
    this.default = this.options.options[0];

  }

  addNewAdditionalContact() {
    this.addContactInputForm.reset();
    this._adminGlnAdditionalContactService.createMode();
  }

  initForm(): FormGroup {
    return this._fb.group({
      'name': [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(2)])],
      'email': [{ value: '', disabled: false }, Validators.compose([
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required])],
      'system': [{ value: '', disabled: false }],
      'role': [{ value: '', disabled: false }],
      'telephone': [{ value: '', disabled: false }, Validators.compose([Validators.required])],
      'fax': [{ value: '', disabled: false }],
      'active': [{ value: true, disabled: false }],
      'id': [{ value: '', disabled: false }],
      'salutation': [{ value: '', disabled: false }],
      'trustUsername': [{ value: '', disabled: false }],
      'subscriber': [{ value: false, disabled: false }],
      'version': [{ value: '', disabled: false }]
    });
  }

  updateFormFromService() {
    this.additionalContact$.subscribe(pc => {
      this.addContactInputForm.patchValue({
        name: pc.Name,
        email: pc.Email,
        system: pc.System,
        role: pc.Role,
        telephone: pc.Telephone,
        fax: pc.Fax,
        active: pc.Active,
        id: pc.Id,
        salutation: pc.Salutation,
        subscriber: pc.NotificationSubscriber,
        version: pc.Version
      });

      if (pc.Active) {
        this.subscriberTitle = 'Subscribed';
      } else {
        this.subscriberTitle = 'Un-Subscribed';
      };

      this.setTitle(pc.Salutation);
      this.addContactInputForm.markAsPristine();
    });
    this.additionalContact$.publishLast();
  }

  updateModelFromForm() {
    this.additionalContact.Name = this.addContactInputForm.get('name').value;
    this.additionalContact.Email = this.addContactInputForm.get('email').value;
    this.additionalContact.Telephone = this.addContactInputForm.get('telephone').value;
    this.additionalContact.System = this.addContactInputForm.get('system').value;
    this.additionalContact.Role = this.addContactInputForm.get('role').value;
    this.additionalContact.Fax = this.addContactInputForm.get('fax').value;
    this.additionalContact.Active = this.addContactInputForm.get('subscriber').value;
    this.additionalContact.Id = this.addContactInputForm.get('id').value;
    this.additionalContact.Salutation = this.addContactInputForm.get('salutation').value;
    this.additionalContact.NotificationSubscriber = this.addContactInputForm.get('subscriber').value;
    this.additionalContact.Version = this.addContactInputForm.get('version').value;
  }

  submit() {
    this._loadingService.loading();
    this.updateModelFromForm();
    this._adminGlnAdditionalContactService.updateAdditionalContact(this.additionalContact)
      .subscribe(
        contacts => {
          this._messagesService.update('Subscriber has been updated successfully.');
          this._adminGlnAdditionalContactService.repeatLastQuery();
          this.addContactInputForm.markAsPristine();
          this._adminGlnAdditionalContactService.createMode();
          this._adminGlnAdditionalContactService.clearAdditionalContact();
          this._loadingService.finishLoading();
        },
        error => {
          this._messagesService.error('Subscriber could not be updated.');
          this._loadingService.finishLoading();
        }
      );
  }

  createAdditionalContact() {
    this._loadingService.loading()
    this.updateModelFromForm();
    this.additionalContact.Id = 0;
    this._adminGlnAdditionalContactService.createAdditionalContact(this.additionalContact)
      .subscribe(
        contacts => {
          this._messagesService.update('New subscriber has been created.');
          this._adminGlnAdditionalContactService.repeatLastQuery();
          this.updateFormFromService();
          this.addContactInputForm.markAsPristine();
          this._adminGlnAdditionalContactService.createMode();
          this._adminGlnAdditionalContactService.clearAdditionalContact();
          this._loadingService.finishLoading()
        },
        error => {
          this._loadingService.finishLoading()
        });
  }

  // changes active values for specified boolean types
  onValueChange(event: any, formControlName: string) {
      this.addContactInputForm.get(formControlName).patchValue(event);
      this.addContactInputForm.get(formControlName).markAsDirty();

      if (formControlName === 'subscriber') {
        if (event) {
          this.subscriberTitle = 'Subscribed';
        } else {
          this.subscriberTitle = 'Un-Subscribed';
        }
      }
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
    this.addContactInputForm.get('salutation').markAsDirty();

    if (event === 'Please Select') {
      this.addContactInputForm.patchValue({
            salutation: ''
        });
      } else {
          this.addContactInputForm.patchValue({
              salutation: event
          });
      }
  }

}
