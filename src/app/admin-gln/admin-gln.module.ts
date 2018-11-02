//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.

// Angular/third party modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Custom components
import { AdminGlnNavComponent } from './admin-gln-nav/admin-gln-nav.component';
import { AdminPrimaryContactComponent } from './admin-primary-contact/admin-primary-contact.component';
import { AdminAddressComponent } from './admin-address/admin-address.component';
import { AdminReplacementPrimaryContactComponent } from './admin-primary-contact/admin-replacement-primary-contact/admin-replacement-primary-contact.component';
import { AdminTagComponent } from './admin-tag/admin-tag.component';
// Custom modules
import { SharedModule } from './../shared/shared.module';
// Module routes
import { adminGlnRouting } from './../admin-gln/admin-gln.router';
// Services
import { AdminPrimaryContactResolveService } from './admin-primary-contact/admin-primary-contact-resolve.service';
import { AdminReplacementAddressComponent } from './admin-address/admin-replacement-address/admin-replacement-address.component';
import { AdminAdditionalContactsComponent } from './admin-additional-contacts/admin-additional-contacts.component';
import { AdminIprComponent } from './admin-ipr/admin-ipr.component';

@NgModule({
  imports: [
    adminGlnRouting,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminGlnNavComponent,
    AdminPrimaryContactComponent,
    AdminReplacementPrimaryContactComponent,
    AdminAddressComponent,
    AdminReplacementAddressComponent,
    AdminAdditionalContactsComponent,
    AdminIprComponent,
    AdminTagComponent
    ],
  providers: [
    AdminPrimaryContactResolveService
  ]
})
export class AdminGlnModule { }
