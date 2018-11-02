//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { StartUpService } from './../../services/start-up.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RequestOptions, Headers, Http, Response } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';

import { GlnQueryResult } from './../types/gln-query-result';
import { IGln } from './../interfaces/igln';
import { Gln } from './../types/gln';
import { IGlnQueryResult } from './../interfaces/iglnQueryResult';
import { GlnQuery } from './../types/gln-query';
import { IGlnQuery } from './../interfaces/iglnQuery';

import { GlnService } from './../../services/gln.service';
import { EditGlnService } from './../../edit-gln/edit-gln.service';
import { AssociationsGlnService } from './../../associations-gln/associations-gln.service';
import { MessagesService } from './../../services/messages.service';
import { LoadingService } from './../../services/loading.service';
import { EnvironmentService } from './../../services/environment.service';

import { IGlnTagType } from '../interfaces/igln-tag-type';

@Injectable()
export class SearchGlnService {

  private glnQuery: IGlnQuery;
  private lastSelectedGln: string;
  private breadCrumbs = new Array<IGln>();
  private tagTypes = new Array<IGlnTagType>();
  private lastQueryForm: FormGroup;

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  // GLN query for sending to API
  private glnQuerySubject = new BehaviorSubject<IGlnQuery>(new GlnQuery());
  glnQuery$ = this.glnQuerySubject.asObservable();

  // GLN query results sent back from API
  private glnQueryResultsSubject = new BehaviorSubject<IGlnQueryResult>(new GlnQueryResult());
  glnQueryResults$ = this.glnQueryResultsSubject.asObservable();

  // Selected GLN
  private selectedGlnSubject = new BehaviorSubject<IGln>(new Gln());
  selectedGln$ = this.selectedGlnSubject.asObservable();

  // Use selected GLN
  private useSelectedGlnSubject = new BehaviorSubject<IGln>(new Gln());
  useSelectedGln$ = this.useSelectedGlnSubject.asObservable();

  // Selected GLN
  private primaryGlnSubject = new BehaviorSubject<IGln>(new Gln());
  primaryGln$ = this.primaryGlnSubject.asObservable();

  // GLN Breadcrumbs
  private glnBreadCrumbsSubject = new BehaviorSubject<Array<IGln>>(this.breadCrumbs);
  glnBreadCrumbs$ = this.glnBreadCrumbsSubject.asObservable();

  // GLN last search form
  private previousQueryFormSubject = new BehaviorSubject<FormGroup>(this.lastQueryForm);
  previousQueryForm$ = this.previousQueryFormSubject.asObservable();


  constructor(private _http: Http,
              private _messagesService: MessagesService,
              private _associateGlnService: AssociationsGlnService,
              private _startUpService: StartUpService,
              private _glnService: GlnService,
              private _envService: EnvironmentService,
              private _router: Router) {

    this.initGlnQuery();
    this.primaryGln$ = this._startUpService.primaryGln$;
   }

   private getPrimaryGlnAfterInit(): IGln {
    let pGln: IGln;
    this.primaryGln$.take(1).subscribe(primaryGln => pGln = primaryGln);
    return pGln;
  }

   clearSearch() {
    this.removeBreadcrumbs(this.getPrimaryGlnAfterInit().OwnGln);
    this.initGlnQuery();
    this.getGlnsQueryResult(this.glnQuery);
   }

  getGlnsQueryResult(queryObj: IGlnQuery) {
    console.log('getGlnsQueryResult(queryObj: IGlnQuery) from search-gln.service', queryObj);
    queryObj.ParentGln = this.lastSelectedGln;

    this._glnService.getGlnQueryResults(queryObj).subscribe(qObj => {
        this.glnQueryResultsSubject.next(qObj);
    });
  }

  getPrimaryGln() {
    console.log('getPrimaryGln() from search-gln.service');
    // return this._glnService.getPrimaryGln()
    return this.primaryGln$
                .do(primaryGln => this.lastSelectedGln = primaryGln.OwnGln)
                .do(primaryGln => this.primaryGlnSubject.next(primaryGln))
                .do(primaryGln => this.selectedGlnSubject.next(primaryGln))
                .do(primaryGln => {
                  console.log('primaryGln getPrimaryGln(): ', primaryGln);
                  this.glnQuery.ParentGln = primaryGln.OwnGln ? primaryGln.OwnGln : 'wibble';
                  console.log('this.glnQuery.ParentGln getPrimaryGln(): ', this.glnQuery.ParentGln);
                })
                .do(primaryGln => this.removeAllBreadcrumbs())
                .do(primaryGln => this.addBreadcrumb(primaryGln))
                .do(primaryGln => this.glnQuery.SearchAll = false)
                .do(primaryGln => {
                    if (this._envService.apiUrl) {
                      this._glnService.getGlnQueryResults(this.glnQuery).subscribe(qObj => {
                        this.glnQueryResultsSubject.next(qObj);
                      });
                    }
                })
                .catch(this.handlerError);
  }

  selectedGln(gln: IGln) {
    this.lastSelectedGln = gln.OwnGln;
    this.selectedGlnSubject.next(gln);
    this.addBreadcrumb(gln);
    this.selectedGln$.publishLast().refCount();
  }

  publishLastQueryForm(queryForm: FormGroup) {
    this.lastQueryForm = queryForm;
    this.previousQueryFormSubject.next(queryForm);
    this.previousQueryForm$.publishLast().refCount();
  }

  associatedGlnToGln(gln: IGln) {
    this._associateGlnService.assignGlnToGln(gln.Id).subscribe( success => {
      this._messagesService.update('New association has been successfully created.');
      window.scrollTo(0, 0 );
    });
  }

  addBreadcrumb(gln: IGln) {
    let breadcrumb = gln;

    if (!this.breadCrumbs.find(bc => breadcrumb.Id === bc.Id)) {
      this.breadCrumbs.push(breadcrumb);
    }

    this.glnBreadCrumbsSubject.next(this.breadCrumbs);
  }

  removeBreadcrumbs(gln?: string) {
    if (gln === null || gln === undefined) {
      this.primaryGln$.take(1).subscribe( pgln => gln = pgln.OwnGln);
    }
    if (this.breadCrumbs.find(bc => bc.OwnGln === gln)) {
      let indexOfSelectedGln = this.breadCrumbs.findIndex(bc => bc.OwnGln === gln);
      for (let _i = this.breadCrumbs.length; _i > indexOfSelectedGln + 1; _i--) {

        this.breadCrumbs.pop();
      }
    }

    this.glnBreadCrumbsSubject.next(this.breadCrumbs);
  }

  removeAllBreadcrumbs() {
    this.breadCrumbs = new Array<IGln>();
    this.glnBreadCrumbsSubject.next(this.breadCrumbs);
  }

    handlerError(err) {
        let errMessage: string;

        return Observable.throw(err);
    }

  private initGlnQuery() {
    this.glnQuery = new GlnQuery();
    this.glnQuery.Digital = false;
    this.glnQuery.Legal = false;
    this.glnQuery.Functional = false;
    this.glnQuery.Physical = false;
    this.glnQuery.Public = false;
    this.glnQuery.Private = false;
    this.glnQuery.TrustActive = true;
    this.glnQuery.SearchTerm = '';
    this.glnQuery.SearchAll = true;
    this.glnQuery.MatchAllTypes = false;
    this.glnQuery.IsSortAscending = true;
    this.glnQuery.Page = 1;
    this.glnQuery.ParentGln = '';
    this.glnQuery.AllStatus = true;
  }
}
