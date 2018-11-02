//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';

import { IGln } from './../../shared/interfaces/igln';

import { MessagesService } from './../../services/messages.service';
import { EditGlnService } from './../edit-gln.service';
import { LoadingService } from './../../services/loading.service';

@Component({
  selector: 'app-assign-parent-gln',
  templateUrl: './assign-parent-gln.component.html',
  styleUrls: ['./assign-parent-gln.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignParentGlnComponent implements OnInit, OnChanges {


  gln$: Observable<IGln>;
  glnPage$: Observable<IGln[]>;
  selectedParentGln$: Observable<IGln>;
  selectedParentTitle = 'New Parent GLN Selection';
  currentParentGln$: Observable<IGln>;
  currentParentTitle = 'Currently Assigned Parent GLN';
  childrenOfParentGln$: Observable<IGln[]>;
  searchCriteria$: Observable<string>;
  loading$: Observable<boolean>;

  searchForm: FormGroup;

  viewParent = false;

  constructor(private _editGlnService: EditGlnService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _loadingService: LoadingService,
              private _messageService: MessagesService,
              private _location: Location) { }

  ngOnInit() {

    this.gln$ = this._editGlnService.gln$;
    this.loading$ = this._loadingService.loading$;

    this.selectedParentGln$ = this._editGlnService.selectedParentGln$;
    this.currentParentGln$ = this._editGlnService.currentParentGln$;
    this.childrenOfParentGln$ = this._editGlnService.childrenOfParentGln$;
  }

  ngOnChanges(): void {
      this.glnPage$.publishLast();
  }

  selectParentGln(id: number) {
    this._editGlnService.getParentGlnById(id).do(loading => this._loadingService.loading()).subscribe( success => {
      this._loadingService.finishLoading();
    }, error => {
      this._loadingService.finishLoading();
      this._messageService.error('Unable to select parent GLN. ' + error);
    });
  }

  selectParentGlnByGln(gln: string) {
    this._editGlnService.getSelectedParentByGln(gln).do(loading => this._loadingService.loading()).subscribe( success => {
      this._loadingService.finishLoading();
    }, error => {
      this._loadingService.finishLoading();
      this._messageService.error('Unable to select parent GLN. ' + error);
    });
  }

  toggleViewParent() {
    this.viewParent = !this.viewParent;
  }

  backToGln() {
    this._location.back();
  }

}
