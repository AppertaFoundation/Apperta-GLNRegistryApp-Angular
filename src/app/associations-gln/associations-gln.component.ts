//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IGln } from './../shared/interfaces/igln';
import { IGlnSummary } from './../shared/interfaces/igln-summary';

import { AssociationsGlnService } from './associations-gln.service';
import { EditGlnService } from './../edit-gln/edit-gln.service';
import { MessagesService } from './../services/messages.service';
import { SearchGlnService } from './../shared/search-gln/search-gln.service';
import { LoadingService } from './../services/loading.service';

@Component({
  selector: 'app-associations-gln',
  templateUrl: './associations-gln.component.html',
  styleUrls: ['./associations-gln.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationsGlnComponent implements OnInit {

  gln$: Observable<IGln>;
  newGlnAssociationSelected: Observable<IGln>;
  associatedGlns$: Observable<IGlnSummary[]>;
  newAssociationGln$: Observable<IGln>;
  loading$: Observable<boolean>;
  answer$: Observable<boolean>;

  buttonTitle = 'Associate GLN';

  searchMode = false;

  constructor(private _associatedGlnService: AssociationsGlnService,
              private _glnEditService: EditGlnService,
              private _searchGlnService: SearchGlnService,
              private _loadingService: LoadingService,
              public _messagesService: MessagesService) { }

  ngOnInit() {
    this.gln$ = this._glnEditService.gln$;
    this._associatedGlnService.gln$ = this.gln$;
    this.loading$ = this._loadingService.loading$;
    this.answer$ = this._messagesService.answer$;

    this.associatedGlns$ = this._associatedGlnService.associatedGlns$;
    this._associatedGlnService.getGlnsAssociatedWithGln()
                              .do(loading => this._loadingService.loading())
                              .subscribe( success => {
                              this._loadingService.finishLoading();
        },
      error => {
        this._loadingService.finishLoading();
        this._messagesService.error('Unable to retrieve associations. ' + error);
      });

    this.newAssociationGln$ = this._searchGlnService.useSelectedGln$;
  }

  removeAssociatedGln(id: number) {

    this._messagesService.question('You are about to remove an associated GLN do you wish to continue?');

    this.answer$.take(1).subscribe( answer => {
      if (answer) {
        this._associatedGlnService.removeAssignedGlnFromGln(id)
                                  .do(loading => this._loadingService.loading())
                                  .subscribe( success => {
                                    this._loadingService.finishLoading();
                                    this._messagesService.update('Association has been successfuly removed.');
                                  }, error => {
                                    this._loadingService.finishLoading();
                                    this._messagesService.error('Unable to remove assocation.' + error);
                                  });
      }
    });
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
  }

}
