//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { LoadingService } from './../../services/loading.service';
import { MessagesService } from './../../services/messages.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGlnSummary } from './../../shared/interfaces/igln-summary';
import { IGln } from './../../shared/interfaces/igln';
import { IUser } from './../../shared/interfaces/iuser';

import { StartUpService } from './../../services/start-up.service';
import { SearchGlnService } from './../../shared/search-gln/search-gln.service';
import { EditGlnService } from './../edit-gln.service';
import { AssignFunctionalService } from './../../assign-functional-gln/assign-functional.service';

@Component({
  selector: 'app-edit-gln',
  templateUrl: './edit-gln.component.html',
  styleUrls: ['./edit-gln.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditGlnComponent implements OnInit {

  gln$: Observable<IGln>;
  parentGln$: Observable<IGln>;
  associated$: Observable<IGlnSummary[]>;
  selectedGln$: Observable<IGln>;
  user$: Observable<IUser>;
  loading$: Observable<boolean>;
  answer$: Observable<boolean>;

  formValid = false;
  loading = false;
  userIsAdmin = false;

  constructor(private _editGlnService: EditGlnService,
              private _searchGlnService: SearchGlnService,
              private _assignFunctionalService: AssignFunctionalService,
              private _route: ActivatedRoute,
              public _messagesService: MessagesService,
              private _loadingService: LoadingService,
              private _startUpService: StartUpService) { }

  ngOnInit() {

    this.gln$ = this._route.data.map(data => data['gln']);
    this.parentGln$ = this._editGlnService.selectedParentGln$;
    this.associated$ = this._editGlnService.associatedGlns$;
    this.loading$ = this._loadingService.loading$;
    this.answer$ = this._messagesService.answer$;

    this.userIsAdmin = this._startUpService.isAdmin;

    let glnId: number;
    this.gln$.subscribe(lastGln => glnId = lastGln.Id);
    this.gln$.last();
    this.gln$ = this._editGlnService.gln$;

    if (this._assignFunctionalService.toAssociateId > 0) {
      // Need to update the assign association observable so that it can retreive associations
      this._editGlnService.gln$.subscribe(gln => this._assignFunctionalService.nextGln(gln));
      this._editGlnService.gln$.last();

      this._assignFunctionalService.assignGlnToGln()
                          .do(loading => this._loadingService.loading())
                          .switchMap(() => this._editGlnService.getGlnsAssociatedWithGln(glnId))
                          .subscribe( success => {
                                        this._assignFunctionalService.toAssociateId = 0;
                                        this._loadingService.finishLoading();
                                      },
                                      error => {
                                        this._messagesService.error('Could not assign GLN' + error);
                                        this._loadingService.finishLoading();
                                       });
    } else {
      this._editGlnService.getGlnsAssociatedWithGln(glnId).do(loading => this._loadingService.loading())
                                                          .subscribe( success => {this._loadingService.finishLoading()},
                                                    error => {
                                                      this._messagesService.error('Could not retreive associated GLNs' + error);
                                                      this._loadingService.finishLoading();
                                                    });
    }
  }

  viewDrawing() {
    this.gln$.take(1).subscribe(value => {
      let gln = value.OwnGln;
      let newWindow = window.open(this._startUpService.iprImageEndpoint + gln);
    });
  }

}
