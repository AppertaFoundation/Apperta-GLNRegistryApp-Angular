//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { CanDeactivate } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { } from '../barcode/assign-new-barcode.component';

export interface FormComponent {
    form: FormGroup;
}

export class PreventUnsavedChangesGuard implements CanDeactivate<FormComponent> {
    canDeactivate(component: FormComponent) {
        if (component.form.dirty) {
            return window.confirm('There are unsaved changes are you sure you want to navigate away?');
        };

        return true;
    }
}
