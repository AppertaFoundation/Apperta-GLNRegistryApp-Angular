//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AssociationsGlnComponent } from './associations-gln.component';
import { EditGlnComponent } from './../edit-gln/edit-gln/edit-gln.component';
import { AdminUserGuardService } from './../services/admin-user-guard.service';

const associatedGlnRoutes: Routes = [
    {
        path: '',
        component: AssociationsGlnComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'associated-gln',
        component: AssociationsGlnComponent,
        canActivate: [AdminUserGuardService]
    }
];

export const associatedGlnRouting: ModuleWithProviders = RouterModule.forChild(associatedGlnRoutes);