//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { LoadingService } from './../../../services/loading.service';
import { MessagesService } from './../../../services/messages.service';
import { AdminGlnTagService } from './../../../admin-gln/admin-gln-tag.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { GlnTagType } from './../../types/gln-tag-type';
import { IGlnTagType } from './../../interfaces/igln-tag-type';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tag-type-input',
  templateUrl: './tag-type-input.component.html',
  styleUrls: ['./tag-type-input.component.css']
})
export class TagTypeInputComponent implements OnInit {

  @Input()
  TagType: IGlnTagType = new GlnTagType();

  tagType$: Observable<IGlnTagType>;
  loading$: Observable<boolean>;

  tagTypeForm: FormGroup;

  validForm$: Observable<any>;
  editMode$: Observable<boolean>;

  activeTitle: string;

  constructor(private _fb: FormBuilder,
              private _tagTypeService: AdminGlnTagService,
              private _messagesService: MessagesService,
              private _loadingService: LoadingService) { }

  ngOnInit() {
    this.tagTypeForm = this.initForm();
    this.tagType$ = this._tagTypeService.selectedTagType$;
    this.editMode$ = this._tagTypeService.editMode$;
    this.loading$ = this._loadingService.loading$;
    this.updateFormFromService();

  }

    initForm(): FormGroup {
      return this._fb.group({
          'id': { value: '', disabled: false },
          'code': [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(2)])],
          'description': [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(2)])],
          'active': { value: '', disabled: false },
      });
  }

  updateFormFromService() {
    this.tagType$.subscribe(t => {
      this.tagTypeForm.patchValue({
      id: t.GlnTagTypeId,
      code: t.Code,
      active: t.Active,
      description: t.Description,
    })});

    this.tagType$.publishLast();
  }

  updateModelFromForm() {
    this.TagType.Active = this.tagTypeForm.get('active').value;
    this.TagType.Code = this.tagTypeForm.get('code').value;
    this.TagType.Description = this.tagTypeForm.get('description').value;
    this.TagType.GlnTagTypeId = this.tagTypeForm.get('id').value;
  }

  submit() {
    this._loadingService.loading();
    this.updateModelFromForm();
    this._tagTypeService.updateTagType(this.TagType)
        .subscribe(
          success => {
            this._loadingService.finishLoading();
            this._messagesService.update('Tag Type has been successfully updated.');
            this._tagTypeService.repeatLastTagTypeQuery();
            this.tagTypeForm.markAsPristine();
            this._tagTypeService.createMode();
            this._tagTypeService.clearTagType();
          },
          error => {
            this._loadingService.finishLoading();
            this._messagesService.error('Unable to update TagType.');
          }
        );
  }

  createTagType() {
    this._loadingService.loading();
    this.updateModelFromForm();
    this.TagType.GlnTagTypeId = 0;
    this.TagType.Active = true;
    this._tagTypeService.createTagType(this.TagType)
        .subscribe(
          success => {
            this._tagTypeService.repeatLastTagTypeQuery();
            this._loadingService.finishLoading();
            this._messagesService.update('Tag Type has been successfully created.');
            this.tagTypeForm.markAsPristine();
            this._tagTypeService.createMode();
            this._tagTypeService.clearTagType();
          },
          error => {
            this._loadingService.finishLoading();
            this._messagesService.update('Unable to create new Tag Type.');
          }
        );
  }

  addNewTagType() {
    this.tagTypeForm.reset();
    this.tagTypeForm.markAsPristine();
    this._tagTypeService.createMode();
  }
  // changes active values for specified boolean types
  onValueChange(event: any, formControlName: string) {
      this.tagTypeForm.get(formControlName).patchValue(event);
      this.tagTypeForm.get(formControlName).markAsDirty();
  }

  ngOnDestroy() {
  }

}
