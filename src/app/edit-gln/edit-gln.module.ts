//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';

import { editGlnRouting } from './edit-gln.router';

import { AssignParentGlnComponent } from './assign-parent-gln/assign-parent-gln.component';
import { AssignAddressGlnComponent } from './assign-address-gln/assign-address-gln.component';
import { AssignPrimaryContactComponent } from './assign-primary-contact/assign-primary-contact.component';
import { EditGlnComponent } from './edit-gln/edit-gln.component';

import { EditGlnResolveService } from './edit-gln/edit-gln-resolve.service';
import { AssignFunctionalResolveService } from './../assign-functional-gln/assign-functional-resolve.service';
import { AssignParentGlnResolveService } from './assign-parent-gln/assign-parent-gln-resolve.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    editGlnRouting
  ],
  declarations: [
    EditGlnComponent,
    AssignParentGlnComponent,
    AssignAddressGlnComponent,
    AssignPrimaryContactComponent
  ],
  providers: [
    EditGlnResolveService,
    AssignParentGlnResolveService,
    AssignFunctionalResolveService
  ]
})
export class EditGlnModule { }
