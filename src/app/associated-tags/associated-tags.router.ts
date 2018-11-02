//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AssociatedTagsComponent } from './associated-tags.component';

import { AdminUserGuardService } from './../services/admin-user-guard.service';

const associatedTagsRoutes: Routes = [
    {
        path: '',
        component: AssociatedTagsComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'associated-tags',
        component: AssociatedTagsComponent,
        canActivate: [AdminUserGuardService]
    }
];

export const associatedTagsRouting: ModuleWithProviders = RouterModule.forChild(associatedTagsRoutes);