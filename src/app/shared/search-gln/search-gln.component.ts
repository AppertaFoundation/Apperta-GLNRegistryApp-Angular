//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { GlnQueryResult } from './../types/gln-query-result';
import { EnvironmentService } from './../../services/environment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, AfterViewInit,
  ViewChild, Renderer, EventEmitter, ElementRef, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { IGlnQueryResult } from './../interfaces/iglnQueryResult';
import { IGlnQuery } from './../interfaces/iglnQuery';
import { IGln } from './../interfaces/igln';
import { Gln } from './../types/gln';
import { GlnQuery } from './../types/gln-query';
import { IIpr } from './../interfaces/Iipr';
import { RadBtnItem } from './../types/radio-btn-item';

import { LoadingService } from './../../services/loading.service';
import { StartUpService } from './../../services/start-up.service';
import { AssociationsGlnService } from './../../associations-gln/associations-gln.service';
import { SearchGlnService } from './search-gln.service';
import { MessagesService } from './../../services/messages.service';
import { EditGlnService } from './../../edit-gln/edit-gln.service';
import { IGlnTagType } from '../interfaces/igln-tag-type';


@Component({
  selector: 'app-search-gln',
  templateUrl: './search-gln.component.html',
  styleUrls: ['./search-gln.component.css']
})
export class SearchGlnComponent implements OnInit, OnDestroy {

  public myFocusTriggeringEventEmitter = new EventEmitter<boolean>();

  primaryGln$: Observable<IGln>;
  selectedGln$: Observable<IGln>;
  currentlyBeingEditedGln$: Observable<IGln>;
  currentParentGln$: Observable<IGln>;
  glnQueryResult$: Observable<IGlnQueryResult>;
  glnQueryResult = new GlnQueryResult;
  breadCrumbs$: Observable<Array<IGln>>;
  previousQueryForm$: Observable<FormGroup>;
  loading$: Observable<boolean>;
  ipr$: Observable<IIpr>;
  tagTypes$: Observable<IGlnTagType[]>;

  subscriptions: Subscription;
  searchSubscriptions: Subscription;

  glnQuery = new GlnQuery();

  selectedGln: string;
  lastSelectedGln: IGln;

  currentPage = 1;
  itemsOnCurrentPage: number;

  searchForm: FormGroup;
  queryForm: FormGroup;
  // Titles for filter check boxes
  trustSuspendedFilterTitle = 'Trust Suspended';
  publicFilterTitle = 'Public';
  privateFilterTitle = 'Private';
  activeFilterTitle = 'Active';
  inActiveFilterTitle = 'In-Active';
  physicalFilterTitle = 'Physical';
  functionalFilterTitle = 'Functional';
  legalFilterTitle = 'Legal';
  digitalFilterTitle = 'Digital';
  exactMatchTitle = 'Match all';
  includeAllTitle = 'Include all';
  searchAllTitle = 'Search All';
  noTagTypeFilters = 'None';

  // Labels for types
  physical = 'Physical';
  functional = 'Functional';
  digital = 'Digital';
  legal = 'Legal';
  trustSuspended = 'Trust Suspended';
  trustActive = 'Trust Active';

  radBtnAll: boolean;
  radBtnActive: boolean;
  radBtnInActive: boolean;
  matchAll: boolean;
  searchAll: boolean;

  @Input()
  associateMode = false;

  @Input()
  editMode = false;

  @Input()
  reloadPreviousQuery = false;

  @Input()
  assignParentMode = false;

  constructor(
    private _router: Router,
    public _searchService: SearchGlnService,
    public _glnAssociationService: AssociationsGlnService,
    private _glnEditService: EditGlnService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _messageService: MessagesService,
    private _loadingService: LoadingService,
    private _startUpService: StartUpService,
    private _envService: EnvironmentService,
    private _zone: NgZone) {}

    ngOnInit() {
      this.radBtnActive = true;
      this.matchAll = false;
      this.searchAll = false;
      this.subscriptions = new Subscription();
      this._route.data.forEach((data: { editMode: boolean, reloadPreviousQuery: boolean }) => {
        this.editMode = data.editMode;
        // If imbeded in component then route data is undefined
        // use previous value or let be set by input property
        if (data.reloadPreviousQuery !== undefined) {
          this.reloadPreviousQuery = data.reloadPreviousQuery;
        }
      });

      this.primaryGln$ = this._startUpService.primaryGln$;
      this.selectedGln$ = this._searchService.selectedGln$;
      this.currentlyBeingEditedGln$ = this._glnEditService.gln$;
      this.currentParentGln$ = this._glnEditService.currentParentGln$;
      this.breadCrumbs$ = this._searchService.glnBreadCrumbs$;
      this.glnQueryResult$ = this._searchService.glnQueryResults$;
      this.previousQueryForm$ = this._searchService.previousQueryForm$;
      this.loading$ = this._loadingService.loading$;
      this.ipr$ = this._startUpService.ipr$;
      this.tagTypes$ = this._startUpService.tagTypes$;

      if (this.reloadPreviousQuery) {
        // Unsubscribe subscriptions and create new forms otherwise queries run twice
        this.subscriptions.unsubscribe();
        this.subscriptions = new Subscription();
        this.searchForm = this.initSearchForm();
        this.queryForm = this.initQueryForm();
        this.reloadUsingPreviousQuery();
      } else {
        this._searchService.getPrimaryGln()
        .do(searchForm => this.initAndSubscribeToSearchFormValueChanges())
        .do(queryForm => this.initAndSubscribeToQueryFormValueChanges())
        .subscribe(success => {
          this._loadingService.finishLoading();
        });
      }
    }

  reloadUsingPreviousQuery() {
    // Reload using previous search criteria.
    console.log('reloadUsingPreviousQuery()')
      this.previousQueryForm$.take(1).subscribe(queryForm => {
          this.currentPage = queryForm.get('currentPage').value;
          this.queryForm.patchValue({
            'physical': queryForm.get('physical').value,
            'functional': queryForm.get('functional').value,
            'legal': queryForm.get('legal').value,
            'digital': queryForm.get('digital').value,
            'matchAllTypes': queryForm.get('matchAllTypes').value,
            'public': queryForm.get('public').value,
            'private': queryForm.get('private').value,
            'trustSuspended': queryForm.get('trustSuspended').value,
            'parentGln': queryForm.get('parentGln').value,
            'searchAll': queryForm.get('searchAll').value,
            'currentPage': queryForm.get('currentPage').value,
            'searchTerm': queryForm.get('searchTerm').value,
            'allStatus': queryForm.get('allStatus').value,
            'active': queryForm.get('active').value,
            'inActive': queryForm.get('inActive').value,
            'tagTypeId': queryForm.get('tagTypeId').value,
          });
          this.searchForm.patchValue({
            searchTerm: queryForm.get('searchTerm').value
          });
          // Forms updated now safe to subscribe without repeating queries
          this.subscribeToSearchFormValueChanges();
          this.subscribeToQueryFormValueChanges();
      },
      error => {console.log('No previous query to reload.'); }
      );
  }

  subscribeToSearchFormValueChanges() {
    let searchValueChange$ = this.searchForm.get('searchTerm').valueChanges
                                            .distinctUntilChanged()
                                            .debounceTime(2000)
                                            .subscribe(queryResult => {
                                                      this.queryForm.patchValue({
                                                        currentPage: 1,
                                                        searchTerm: this.searchForm.get('searchTerm').value,
                                                        parentGln: this.selectedGln,
                                                      });
                                                      this.currentPage = 1;
                                                  });

    this.subscriptions.add(searchValueChange$);
  }

  initAndSubscribeToSearchFormValueChanges() {

    this.searchForm = this.initSearchForm();
    this.subscribeToSearchFormValueChanges();

  }

  subscribeToQueryFormValueChanges() {
      let queryValueChange$ = this.queryForm.valueChanges
      .distinctUntilChanged()
      .do(loading => this._loadingService.loading())
      .debounceTime(1000)
      .do(queryUpdate => this.createQueryFromForm(this.queryForm))
      .do(() => this._searchService.getGlnsQueryResult(this.glnQuery))
      .subscribe(queryResult => {
        // Wait until all components are rendered
        this._zone.onMicrotaskEmpty.first().subscribe(() => {
          this._loadingService.finishLoading();
        });
      },
      error => {
        this._messageService.error('Unable to load GLN search results. ' + error);
        this._loadingService.finishLoading();
      });

      this.subscriptions.add(queryValueChange$);
  }

  initAndSubscribeToQueryFormValueChanges() {
    this.queryForm = this.initQueryForm();
    // this.checkIfTypesAreAllFalse(this.queryForm);
    this.subscribeToQueryFormValueChanges();
  }

  initQueryForm(): FormGroup {
    return this._fb.group({
      'physical': [false],
      'functional': [false],
      'legal': [false],
      'digital': [false],
      'matchAllTypes': [false],
      'public': [false],
      'private': [false],
      'trustSuspended': [false],
      'allStatus': [true],
      'page': [1],
      'sortBy': [''],
      'isSortingAscending': [true],
      'pageSize': [10],
      'parentGln': [this.getPrimaryGln().OwnGln],
      'searchAll': [false],
      'currentPage': [1],
      'searchTerm': [''],
      'childrenOnly': [true],
      'active': [false],
      'inActive': [false],
      'tagTypeId': [0]
    });
  }

  getPrimaryGln(): IGln {
    console.log('getPrimaryGln()')
    let pGln: IGln;
    this.primaryGln$.take(1).subscribe(primaryGln => pGln = primaryGln);
    return pGln;
  }

  clearSearch() {
    this._loadingService.loading();
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    let pGln = this.getPrimaryGln();
    this._searchService.selectedGln(pGln);
    this.selectedGln = pGln.OwnGln;
    this.lastSelectedGln = pGln;
    this.currentPage = 1;
    // Need to blank search term in case it tries to query using an existing search term
    this.searchForm.patchValue({
      searchTerm: '' });
    this._searchService.clearSearch();
    this.initAndSubscribeToQueryFormValueChanges();
    this.initAndSubscribeToSearchFormValueChanges();
    this.radBtnAll = false;
    this.radBtnActive = true;
    this.radBtnInActive = false;
    this.matchAll = false;
    this.searchAll = false;
    this._loadingService.finishLoading();
  }

  getLastSearchTerm() {
    let lastSearchTerm: string;

    this.previousQueryForm$.take(1).subscribe(form => {
      if (form != null || form != undefined) {
        lastSearchTerm = form.get('searchTerm').value;
      } else {
        lastSearchTerm = '';
      }});

    return lastSearchTerm;
  }

  initSearchForm(): FormGroup {
    return this._fb.group({
      'searchTerm': ['']
    });
  }

  createQueryFromForm(queryForm: FormGroup) {
    this.glnQuery.Physical = queryForm.get('physical').value;
    this.glnQuery.Functional = queryForm.get('functional').value;
    this.glnQuery.Legal = queryForm.get('legal').value;
    this.glnQuery.Digital = queryForm.get('digital').value;
    this.glnQuery.MatchAllTypes = queryForm.get('matchAllTypes').value;
    // this.glnQuery.TrustActive = this.radBtnActive;
    // this.glnQuery.AllStatus = this.radBtnAll;
    this.glnQuery.Page = queryForm.get('page').value;
    this.glnQuery.SortBy = queryForm.get('sortBy').value;
    this.glnQuery.IsSortAscending = queryForm.get('isSortingAscending').value;
    this.glnQuery.PageSize = queryForm.get('pageSize').value;
    this.glnQuery.Public = queryForm.get('public').value;
    this.glnQuery.Private = queryForm.get('private').value;
    this.glnQuery.Page = queryForm.get('currentPage').value;
    this.glnQuery.SearchAll = queryForm.get('searchAll').value;
    this.glnQuery.StartsWith = false;
    this.glnQuery.SearchTerm = queryForm.get('searchTerm').value;
    this.glnQuery.ChildrenOnly = this.searchAll;
    this.glnQuery.TagTypeIds = new Array();
    this.glnQuery.TagTypeIds.push(queryForm.get('tagTypeId').value);

    if (this.queryForm.get('searchAll').value) {
      this.glnQuery.ParentGln = this.queryForm.get('parentGln').value;
    } else {
      this.glnQuery.ParentGln = this.selectedGln;
    }

    if ((this.queryForm.get('active').value && this.queryForm.get('inActive').value) ||
      (!this.queryForm.get('active').value && !this.queryForm.get('inActive').value)) {
        this.glnQuery.AllStatus = true;
    } else {
      this.glnQuery.AllStatus = false;
      this.glnQuery.TrustActive = this.queryForm.get('active').value;
    }
  }

  goToBreadcrumb(gln: IGln) {
    this._searchService.selectedGln(gln);
    this.selectedGln = gln.OwnGln;
    this.lastSelectedGln = gln;
    this.currentPage = 1;
    // Need to blank search term in case it tries to query using an existing search term
    this.glnQuery.SearchTerm = '';

    this.queryForm.patchValue({
        'parentGln': this.selectedGln,
        'currentPage': this.currentPage
      });
    this._searchService.removeBreadcrumbs(gln.OwnGln);
  }

  selectGln(gln: IGln) {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.searchForm.patchValue({
      'searchTerm': ''
    });
    this.subscribeToSearchFormValueChanges();
    this.subscribeToQueryFormValueChanges();

    if ( this.assignParentMode) {
      this._glnEditService.newParentSelection(gln);
    }
    this.lastSelectedGln = gln;
    this.selectedGln = gln.OwnGln;
    this.selectedGln$ = this._searchService.selectedGln$;
    this._searchService.selectedGln(gln);

    if (this.glnQuery.SearchAll) {
      this._searchService.removeBreadcrumbs();
      this._searchService.addBreadcrumb(gln);
    } else {
      this._searchService.addBreadcrumb(gln);
    }

    this.currentPage = 1;

    this.queryForm.patchValue({
      parentGln: this.selectedGln,
      currentPage: this.currentPage
    });
  }

  private setPageToOne() {
    this.currentPage = 1;
      this.queryForm.patchValue({
        'currentPage': this.currentPage
      });
  }

  previousPage() {
    if (this.currentPage - 1 >= 1) {
      this.currentPage -= 1;
      this.queryForm.patchValue({
        currentPage: this.currentPage
      });
    }
  }

  nextPage() {
    this.currentPage += 1;
    this.queryForm.patchValue({
        currentPage: this.currentPage
      });
  }

  associatedGlnToGln(gln: IGln) {
    this._searchService.associatedGlnToGln(gln);
  }

  associatedGlnToGln$(gln: Observable<IGln>) {
    gln.take(1).subscribe(value => {
      this._searchService.associatedGlnToGln(value);
    });
  }

  assignParent(gln: IGln) {
    this._glnEditService.assignParent(gln);
  }

  assignParent$(gln: Observable<IGln>) {
      gln.take(1).subscribe(value => {
          this._glnEditService.assignParent(value)
                              .subscribe( success => {
                                    this._loadingService.finishLoading();
                                    this._messageService.update('New Parent GLN successfully assigned.');
                                    window.scrollTo(0, 0 );
                                    this._router.navigate(['search/edit-gln/ ' + success.Id]);
                              },
                              error => {
                                    this._loadingService.finishLoading();
                                    this._messageService.error('New parent GLN could not be assigned.');
                              });
      });
  }

  // changes active values for filters
  onValueChange(event: boolean, formControlName: string) {
      this.queryForm.get(formControlName).patchValue(event);
      this.queryForm.get('currentPage').patchValue(1);
      this.currentPage = 1;
  }

  // changes active values for filters
  onTagValueChange(event: boolean, tagTypeId: number) {
    console.log('tagTypeId: ', tagTypeId );
      this.queryForm.get('tagTypeId').patchValue(tagTypeId);
      this.queryForm.get('currentPage').patchValue(1);
      this.currentPage = 1;
  }

  toggleMatchAllTypes() {
    setTimeout(() => {
      this.matchAll = !this.matchAll;
      this.queryForm.get('matchAllTypes').patchValue(this.matchAll);
    }, 1000);

  }

  toggleChildrenOnlySearch() {
    setTimeout(() => {
      this.searchAll = !this.searchAll;
      this.queryForm.get('childrenOnly').patchValue(this.searchAll);
    }, 1000);

  }

  setStatusOnQueryForm() {

    if ( this.radBtnAll) {
      this.queryForm.patchValue({
        allStatus: true,
        trustActive: false
      });
    }

    if ( this.radBtnActive) {
      this.queryForm.patchValue({
        allStatus: false,
        trustSuspended: true
      });
    } else {
      this.queryForm.patchValue({
        allStatus: false,
        trustSuspended: false
      });
    }
  }

  filterStatus(event: any) {
    console.log(event);

    setTimeout(() => {

      if (event === 'all') {
        this.radBtnAll = true;
        this.radBtnActive = false;
        this.radBtnInActive = false;
        this.queryForm.patchValue({
          allStatus: true,
          trustActive: false
        })
      };

      if (event === 'active') {
        this.radBtnAll = false;
        this.radBtnActive = true;
        this.radBtnInActive = false;
        this.queryForm.patchValue({
          allStatus: false,
          trustSuspended: true
        })
      };

      if (event === 'in-active') {
        this.radBtnAll = false;
        this.radBtnActive = false;
        this.radBtnInActive = true;
        this.queryForm.patchValue({
          allStatus: false,
          trustSuspended: false
        })
      };

    }, 1000);
  }

  viewDrawing() {
    if (this.selectedGln != null || this.selectedGln != undefined) {
      let newWindow = window.open(this._startUpService.iprImageEndpoint + this.selectedGln);
    }
  }

  setActiveStatus() {
    if (!this.radBtnActive) {
      this.radBtnActive = !this.radBtnActive;
      this.radBtnAll = false;
      this.radBtnInActive = false;
      this.filterStatus('active');
    }
  }

  setAllStatus() {
    if (!this.radBtnAll) {
      this.radBtnAll = !this.radBtnAll;
      this.radBtnActive = false;
      this.radBtnInActive = false;
      this.filterStatus('all');
    }
  }

  setInActiveStatus() {
    if (!this.radBtnInActive) {
      this.radBtnInActive = ! this.radBtnInActive;
      this.radBtnActive = false;
      this.radBtnAll = false;
      this.filterStatus('in-active');
    }
  }

  ngOnDestroy(): void {
    this._searchService.publishLastQueryForm(this.queryForm);
    this.subscriptions.unsubscribe();
  }

}
