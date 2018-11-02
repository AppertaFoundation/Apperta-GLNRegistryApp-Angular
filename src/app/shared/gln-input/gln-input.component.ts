//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IGlnSummary } from './../interfaces/igln-summary';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, NgZone } from '@angular/core';

import { IGln } from './../interfaces/igln';
import { Gln } from './../types/gln';
import { IIpr } from './../interfaces/Iipr';

import { StartUpService } from './../../services/start-up.service';
import { SearchGlnService } from './../search-gln/search-gln.service';
import { MessagesService } from './../../services/messages.service';
import { LoadingService } from './../../services/loading.service';
import { EditGlnService } from './../../edit-gln/edit-gln.service';

@Component({
  selector: 'app-gln-input',
  templateUrl: './gln-input.component.html',
  styleUrls: ['./gln-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlnInputComponent implements OnInit {

  @Input()
  gln: IGln = new Gln();

  gln$: Observable<IGln>;
  loading$: Observable<boolean>;
  ipr$: Observable<IIpr>;
  answer$: Observable<boolean>;

  glnInputForm: FormGroup;

  @Output()
  isValid = new EventEmitter<boolean>();

  validForm$: Observable<any>;

   // Labels for types
  physical = 'Physical';
  functional = 'Functional';
  digital = 'Digital';
  legal = 'Legal';
  trustNotSuspeneded = 'Trust Active';
  trustSuspended = 'Trust Suspended';

  constructor(private _fb: FormBuilder,
              private _editGlnService: EditGlnService,
              private _searchService: SearchGlnService,
              private _messageService: MessagesService,
              private _loadingService: LoadingService,
              private _startUp: StartUpService,
              private _ngZone: NgZone) {
  }

  ngOnInit() {
    this.ipr$ = this._startUp.ipr$;
    this.glnInputForm = this.initForm();
    this.gln$ = this._editGlnService.gln$;
    this.loading$ = this._loadingService.loading$;
    this.answer$ = this._messageService.answer$;
    this.updateFormFromService();

    this.glnInputForm.valueChanges.subscribe(value => {
      if (this.glnInputForm.dirty) {
        this.isValid.emit(false);
      } else {
        this.isValid.emit(true);
      };
    });

    this.onActiveValueChange();
  }

  initForm(): FormGroup {
    return this._fb.group({
          'descriptionPurpose': [ null, Validators.compose([Validators.required,
                                                            Validators.minLength(5)])],
          'department': [ null, Validators.compose([Validators.minLength(2)])],
          'function': [ null, Validators.compose([Validators.minLength(2)])],
          'active': { value: true , disabled: true }, // read only
          'functionalType': [ true, ], // Only one set to true by default
          'physicalType': [ false, ],
          'digitalType': [ false, ],
          'legalType': [ false, ],
          'public': [ false, ],
          'trustActive': [true, ],
          'suspensionReason': [''],
          'deliveryNote': [''],
          'level': [1],
        });
  }

  onActiveValueChange() {
    let activeValueChange$ = this.glnInputForm.get('active').valueChanges;
    this.isValid.emit(true);

    activeValueChange$.subscribe(
      active => {
        if (active) {
          this.onValueChange(active, 'trustActive');
          this.glnInputForm.patchValue({
            suspensionReason: ''
          });
        } else {
          this.onValueChange(active, 'trustActive');
          this.glnInputForm.patchValue({
            suspensionReason: 'National deactivated'
          });
        }
      }
    );
  }

  areAllTypesFalse(formControlName: string): boolean {
    let numberOfFalse = 0;

    if (!this.glnInputForm.get('digitalType').value && formControlName != 'digitalType') {
      numberOfFalse = ++numberOfFalse;
    }
    if (!this.glnInputForm.get('functionalType').value && formControlName != 'functionalType') {
      numberOfFalse = ++numberOfFalse;
    }
    if (!this.glnInputForm.get('legalType').value && formControlName != 'legalType') {
      numberOfFalse = ++numberOfFalse;
    }
    if (!this.glnInputForm.get('physicalType').value && formControlName != 'physicalType') {
      numberOfFalse = ++numberOfFalse;
    }

    if (numberOfFalse >= 3) {

      return true;
    } else {
      return false;
    }
  }
  // changes active values for specified boolean types
  onValueChange(event: any, formControlName: string) {

      this.glnInputForm.get(formControlName).patchValue(event);
      this.glnInputForm.get(formControlName).markAsDirty();
      this.isValid.emit(false);

      if (formControlName === 'trustActive') {
        if (!event) {
          this.glnInputForm.get('suspensionReason').setValidators( Validators.compose([Validators.required,
                                                            Validators.minLength(5)]));
          this.glnInputForm.get('suspensionReason').updateValueAndValidity();

        } else {
          this.glnInputForm.get('suspensionReason').clearValidators();
          this.glnInputForm.get('suspensionReason').updateValueAndValidity();
        }
      }
  }

  updateGlnModel(): IGln {
    this.gln.FriendlyDescriptionPurpose = this.glnInputForm.get('descriptionPurpose').value;
    this.gln.Function = this.glnInputForm.get('function').value;
    this.gln.Department = this.glnInputForm.get('department').value;
    this.gln.FunctionalType = this.glnInputForm.get('functionalType').value;
    this.gln.PhysicalType = this.glnInputForm.get('physicalType').value;
    this.gln.LegalType = this.glnInputForm.get('legalType').value;
    this.gln.DigitalType = this.glnInputForm.get('digitalType').value;
    this.gln.Public = this.glnInputForm.get('public').value;
    this.gln.TierLevel = this.glnInputForm.get('level').value;
    this.gln.DeliveryNote = this.glnInputForm.get('deliveryNote').value;

    this.gln.TrustActive = this.glnInputForm.get('trustActive').value;
    this.gln.Active = this.glnInputForm.get('active').value;

    if ( this.glnInputForm.get('suspensionReason').dirty && !this.glnInputForm.get('trustActive').value) {
      this.gln.SuspensionReason = this.glnInputForm.get('suspensionReason').value;
      this.gln.SuspensionDate = new Date();
    } else {
      this.gln.SuspensionReason = '';
    }
    console.log(this.gln);
    return this.gln;

  }

  updateFormFromService() {
    // Update form from service, get last published GLN details
    let lastGln = this._editGlnService.gln$;

    lastGln.subscribe(gln => {
      this.glnInputForm.patchValue({
        descriptionPurpose: gln.FriendlyDescriptionPurpose,
        trustActive: gln.TrustActive,
        department: gln.Department,
        function: gln.Function,
        functionalType: gln.FunctionalType,
        physicalType: gln.PhysicalType,
        legalType: gln.LegalType,
        digitalType: gln.DigitalType,
        public: gln.Public,
        level: gln.TierLevel,
        active: gln.Active,
        suspensionReason: gln.SuspensionReason,
        deliveryNote: gln.DeliveryNote
      });

      if (!gln.TrustActive && gln.Assigned) {
        this.glnInputForm.get('suspensionReason').setValidators( Validators.compose([Validators.required,
                                                  Validators.minLength(5)]));
        this.glnInputForm.get('suspensionReason').updateValueAndValidity();
      }
      // If a new functional assignemtn GLN form has to be set so that description purpose is blank
      this.setNextFunctionalGlnFormValues(gln);
    });

    lastGln.publishLast();
  }

  checkChildActive(child: IGlnSummary) {
    if (child.Active) {
      return true;
    }
  }

  checkIfAnyChildrenAreActive() {
    return this.gln.Children.some(this.checkChildActive);
  }

  subscribeToAnswer() {
    this.answer$.take(1).subscribe(a => {
      if (a) {
        console.log(a);
        // Cannot deactivate GLN because it has children, they have to processed first
        // Assigned new parent or deactivated themselves.
        debugger;
        if (this.gln.NumberOfChildren > 0 ) {
          // If it has children and any of them are active then do not proceed deactivating
          let anyChildrenActive = this.checkIfAnyChildrenAreActive();
          if (anyChildrenActive) {
            this._messageService.error(`Cannot deactivate GLN as it has at least one active child, 
            please deactivate children first or assign new parent to children.`);
            this.onValueChange(true, 'active');
            this.glnInputForm.markAsPristine();
            this.isValid.emit(true);
            return;
          }
        }

        let numberOfAssociations: number;

        this._editGlnService.associatedGlns$.take(1).subscribe(associatedGlns => numberOfAssociations = associatedGlns.length);
        // Cannot deactivate GLN because it has associated GLN(s), they have to removed
        if (numberOfAssociations > 0) {
          this._messageService.error(`Cannot deactivate GLN as it has associated GLN(s), 
          please remove associations before deactivating.`);
          this.onValueChange(true, 'active');
          this.glnInputForm.markAsPristine();
          this.isValid.emit(true);
          return;
        }

        this.submit();
      } else {
        console.log(a);
        this.onValueChange(true, 'active');
        this.glnInputForm.markAsPristine();
        this.isValid.emit(true);
      }
    });
  }

  saveChanges() {
    this._editGlnService.gln$.subscribe(gln => {
      this.gln = gln;
      this.gln.Assigned = true;
      this.gln.Version = gln.Version;
    });
    this._editGlnService.gln$.last();

    if (!this.glnInputForm.get('active').value) {
      this._messageService.question('You are about to deactivate this GLN, it cannot be reactivated! Do you still want to continue?');
      this.subscribeToAnswer();
    } else {
      this.submit();
    }
  }

  submit() {
    this._loadingService.loading();
    this.updateGlnModel();

    if (this.gln.PhysicalType) {
      let currentSelectedGln: IGln;
      this._searchService.selectedGln$.take(1).subscribe(gln => currentSelectedGln = gln);

      this._editGlnService.updateGln(this.updateGlnModel())
                          .switchMap(() => this._editGlnService.assignParent(currentSelectedGln))
                          .subscribe( success => {
                            this._messageService.update('GLN has been successfully updated.');
                            this.gln.Version = success.Version;
                            this.glnInputForm.markAsPristine();
                            this.isValid.emit(true);
                            this._loadingService.finishLoading();
                            this.glnInputForm.patchValue({
                              trustActive: success.TrustActive
                            });
                          }, error => {
                            this._loadingService.finishLoading();
                            this._messageService.error('Unable to update GLN!');
                          });
    } else {
      // Otherwise it is a functional GLN and so parent should be primary GLN, top tier level GLN
      let currentSelectedGln: IGln;
      this._searchService.primaryGln$.take(1).subscribe(gln => currentSelectedGln = gln);

      this._editGlnService.updateGln(this.updateGlnModel())
                          .switchMap(() => this._editGlnService.assignParent(currentSelectedGln))
                          .subscribe( success => {
                            this._messageService.update('GLN has been successfully updated.');
                            this.gln.Version = success.Version;
                            this.glnInputForm.markAsPristine();
                            this.isValid.emit(true);
                            this._loadingService.finishLoading();
                            this.glnInputForm.patchValue({
                              trustActive: success.TrustActive
                            });
                          }, error => {
                            this._loadingService.finishLoading();
                            this._messageService.error('Unable to update GLN!');
                          });
    }
  }

  setNextFunctionalGlnFormValues(gln: IGln) {
    if (gln.FriendlyDescriptionPurpose.toUpperCase() === 'NOT ASSIGNED' ) {
      this.glnInputForm.patchValue({
      descriptionPurpose: '',
      trustActive: true
      });
    }

    this.glnInputForm.get('suspensionReason').clearValidators();
    this.glnInputForm.get('suspensionReason').updateValueAndValidity();
  }

}
