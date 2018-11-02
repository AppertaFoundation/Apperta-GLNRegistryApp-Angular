//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Subject } from 'rxjs/Subject';
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

import { ExportService } from './../services/export.service';
import { MessagesService } from './../services/messages.service';

@Injectable()
export class ExportImportService {

  constructor(private _exportService: ExportService,
            private _router: Router,
            private _messagesService: MessagesService) { }

  createDownloadCsvForNationalExport() {
    this._exportService.createGlnCsvForNationalUpload()
      .subscribe( success => {
        this._exportService.downloadGlnCsvForNationalUpload();
       },
      error => this._messagesService.error('Download did not suceed.'));
  }
}
