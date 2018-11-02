//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { APP_ROUTES } from './../app.routes';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Components
import { ActiveComponent }   from './directives/active/active.component';
import { PublicPrivateComponent }   from './directives/public-private/publicPrivate.component';
import { DropdownComponent }   from './directives/dropdown/dropdown.component';
import { ToggleOnOffComponent }   from './directives/toggle-on-off/toggleOnOff.component';
import { DirectionalComponent } from './directives/directional/directional.component';
import { ExclamationComponent } from './directives/exclamation/exclamation.component';
import { PopUpInputComponent } from './directives/pop-up/pop-up-input.component';
import { LoadSpinnerComponent } from './directives/load-spinner/load-spinner.component';
import { PopUpWarningComponent } from './directives/pop-up/pop-up-warning.component';
import { PaginationComponent } from './directives/pagination/pagination.component';
import { GlnSummaryComponent } from './../shared/gln-summary/gln-summary.component';
import { GlnComponent } from './../shared/gln/gln.component';
import { LoadingComponent } from './directives/loading/loading.component';
import { GlnAddressSummaryComponent } from './../shared/gln-address-summary/gln-address-summary.component';
import { GlnAddressComponent } from './../shared/gln-address/gln-address.component';
import { GlnContactComponent } from './../shared/gln-contact/gln-contact.component';
import { GlnInputComponent } from './gln-input/gln-input.component';
import { GlnContactInputComponent } from './gln-contact/gln-contact-input/gln-contact-input.component';
import { GlnAddressInputComponent } from './gln-address/gln-address-input/gln-address-input.component';
import { SearchGlnComponent } from './../shared/search-gln/search-gln.component';
import { CheckBoxComponent } from './directives/check-box/check-box.component';
import { GlnRowSummaryComponent } from './gln-row-summary/gln-row-summary.component';
import { RadioButtonComponent } from './directives/radio-button/radio-button.component';
import { GlnAdditionalContactComponent } from './gln-additional-contact/gln-additional-contact.component';
import { GlnAdditionalContactInputComponent } from './gln-additional-contact/gln-additional-contact-input/gln-additional-contact-input.component';
import { IprComponent } from './../shared/ipr/ipr.component';
import { IprInputComponent } from './../shared/ipr/ipr-input/ipr-input.component';
import { TagInputComponent } from './../shared/tag/tag-input/tag-input.component';
import { TagTypeComponent } from './tag-types/tag-type.component';
import { TagComponent } from './tag/tag.component';
import { TagTypeInputComponent } from './tag-types/tag-type-input/tag-type-input.component';
// Services
import { SearchGlnResolveService } from './search-gln/search-gln-resolve.service';

import { RemoveSlashesPipe } from './directives/remove-slashes.pipe';
import { TakeLastValuePipe } from './take-last-value.pipe';

@NgModule({
    imports:
    [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations:
    [
        ActiveComponent,
        PublicPrivateComponent,
        DropdownComponent,
        ToggleOnOffComponent,
        DirectionalComponent,
        ExclamationComponent,
        PopUpInputComponent,
        LoadSpinnerComponent,
        PopUpWarningComponent,
        PaginationComponent,
        LoadingComponent,
        GlnSummaryComponent,
        GlnComponent,
        GlnAddressSummaryComponent,
        GlnAddressComponent,
        GlnContactComponent,
        GlnInputComponent,
        GlnContactInputComponent,
        GlnAddressInputComponent,
        RemoveSlashesPipe,
        TakeLastValuePipe,
        GlnRowSummaryComponent,
        SearchGlnComponent,
        CheckBoxComponent,
        RadioButtonComponent,
        GlnAdditionalContactComponent,
        GlnAdditionalContactInputComponent,
        IprComponent,
        IprInputComponent,
        TagInputComponent,
        TagTypeComponent,
        TagComponent,
        TagTypeInputComponent
    ],
    exports:
    [
        ActiveComponent,
        PublicPrivateComponent,
        DropdownComponent,
        ToggleOnOffComponent,
        DirectionalComponent,
        ExclamationComponent,
        PopUpInputComponent,
        PopUpWarningComponent,
        LoadSpinnerComponent,
        PaginationComponent,
        LoadingComponent,
        GlnSummaryComponent,
        GlnComponent,
        GlnAddressSummaryComponent,
        GlnAddressComponent,
        GlnContactComponent,
        GlnInputComponent,
        GlnContactInputComponent,
        GlnAddressInputComponent,
        RemoveSlashesPipe,
        TakeLastValuePipe,
        GlnRowSummaryComponent,
        SearchGlnComponent,
        CheckBoxComponent,
        RadioButtonComponent,
        GlnAdditionalContactComponent,
        GlnAdditionalContactInputComponent,
        IprComponent,
        IprInputComponent,
        TagInputComponent,
        TagTypeComponent,
        TagComponent,
        TagTypeInputComponent
    ],
    providers:
    [
        SearchGlnResolveService
    ],
})

export class SharedModule { }
