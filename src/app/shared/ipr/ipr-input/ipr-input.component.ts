//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { StartUpService } from './../../../services/start-up.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Ipr } from './../../types/ipr';
import { IIpr } from './../../interfaces/Iipr';

import { MessagesService } from './../../../services/messages.service';
import { LoadingService } from './../../../services/loading.service';
import { AdminGlnIprService } from './../../../admin-gln/admin-gln-ipr.service';

@Component({
  selector: 'app-ipr-input',
  templateUrl: './ipr-input.component.html',
  styleUrls: ['./ipr-input.component.css']
})
export class IprInputComponent implements OnInit {

  @Input()
  ipr: IIpr = new Ipr();

  ipr$: Observable<IIpr>;
  loading$: Observable<boolean>;

  iprInputForm: FormGroup;

  validForm$: Observable<any>;
  editMode$: Observable<boolean>;

  activeTitle: string;

  default: string;

  subscriberTitle = 'Subscriber';

  constructor(private _fb: FormBuilder,
            private _loadingService: LoadingService,
            private _adminGlnService: AdminGlnIprService,
            private _startUp: StartUpService,
            private _messagesService: MessagesService) { }

  ngOnInit() {
    this.iprInputForm = this.initForm();
    this.ipr$ = this._adminGlnService.ipr$;
    // this.editMode$ = this._adminGlnService.editMode$;
    this.loading$ = this._loadingService.loading$;
    this.updateFormFromService();
  }

  initForm(): FormGroup {
    return this._fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'imageAddress': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'active': [true],
    });
  }

  updateFormFromService() {
    this._startUp.ipr$.subscribe(ipr => {this.iprInputForm.patchValue({
        name: ipr.IprName,
        imageAddress: ipr.IprImageAddress,
      });
    });

    this.ipr$.publishLast();
  }

  updateModelFromForm() {
    this.ipr.IprName = this.iprInputForm.get('name').value;
    this.ipr.IprImageAddress = this.iprInputForm.get('imageAddress').value;
  }

  submit() {
    this.updateModelFromForm();
    this._adminGlnService.updateIpr(this.ipr)
      .do(loading => this._loadingService.loading())
      .subscribe(
        ipr => {
          this._loadingService.finishLoading();
          this._messagesService.update('Local IPR has been updated successfully.');
          this.iprInputForm.markAsPristine();
        },
        error => {
          this._loadingService.finishLoading();
          this._messagesService.error('Local IPR could not be updated.');
        }
      );
  }
}
