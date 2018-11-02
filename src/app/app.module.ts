//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Response, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

// Custom Modules
import { SharedModule } from './shared/shared.module';
// Removed so that lazy loading of this module occurs, only loads when navigated to
// import { AdminModule } from './admin/admin.module';
// App Custom Components
import { AppComponent } from './app.component';
import { SiteNavComponent } from './site-nav/site-nav.component';
import { MessagesComponent } from './messages/messages.component';
import { AssignFunctionalGlnComponent } from './assign-functional-gln/assign-functional-gln.component';

// Services
import { APP_ROUTES } from './app.routes';
import { AdminGlnIprService } from './admin-gln/admin-gln-ipr.service';
import { PreventUnsavedChangesGuard } from './shared/prevent-unaved-changes-guard.services';
import { MessagesService } from './services/messages.service';
import { EditGlnService } from './edit-gln/edit-gln.service';
import { EnvironmentService } from './services/environment.service';
import { AdminGlnPrimaryContactService } from './admin-gln/admin-gln-primary-contact.service';
import { AdminGlnAddressService } from './admin-gln/admin-gln-address.service';
import { AssociationsGlnService } from './associations-gln/associations-gln.service';
import { SearchGlnService } from './shared/search-gln/search-gln.service';
import { AssignFunctionalService } from './assign-functional-gln/assign-functional.service';
import { AddressPagerService } from './services/address-pager.service';
import { GlnService } from './services/gln.service';
import { AddressService } from './services/address.service';
import { PrimaryContactService } from './services/primary-contact.service';
import { ExportService } from './services/export.service';
import { ExportImportService } from './export-import/export-import.service';
import { AdminGlnAdditionalContactService } from './admin-gln/admin-gln-additional-contact.service';
import { AdditionalContactService } from './services/additional-contact.service';
import { AuthenticationService } from './services/authentication.service';
import { StartUpService } from './services/start-up.service';
import { AdminUserGuardService } from './services/admin-user-guard.service';
import { IprService } from './services/ipr.service';
import { TagService } from './services/tag.service';
import { LoadingService } from './services/loading.service';
import { FocusDirective } from './shared/directives/focus.directive';
import { AdminGlnTagService } from './admin-gln/admin-gln-tag.service';
import { AssociatedTagsService } from './associated-tags/associated-tags.service';

// Pipes

@NgModule({
  declarations: [
    AppComponent,
    SiteNavComponent,
    MessagesComponent,
    AssignFunctionalGlnComponent,
    FocusDirective,
  ],
  imports: [
    // Angular and custom modules goes here
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(APP_ROUTES),
    SharedModule
  ],
  providers: [
    EnvironmentService,
    MessagesService,
    StartUpService,
    AddressPagerService,
    AddressService,
    AdditionalContactService,
    AdminGlnAdditionalContactService,
    AdminGlnAddressService,
    AdminGlnIprService,
    AdminGlnPrimaryContactService,
    AdminUserGuardService,
    AdminGlnTagService,
    AssignFunctionalService,
    AssociationsGlnService,
    AssociatedTagsService,
    AuthenticationService,
    EditGlnService,
    LoadingService,
    ExportService,
    ExportImportService,
    GlnService,
    IprService,
    PreventUnsavedChangesGuard,
    PrimaryContactService,
    SearchGlnService,
    TagService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
