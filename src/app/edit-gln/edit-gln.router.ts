//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AssignPrimaryContactComponent } from './assign-primary-contact/assign-primary-contact.component';
import { AssignAddressGlnComponent } from './assign-address-gln/assign-address-gln.component';
import { AssignParentGlnResolveService } from './assign-parent-gln/assign-parent-gln-resolve.service';
import { AssignParentGlnComponent } from './assign-parent-gln/assign-parent-gln.component';

import { AssignFunctionalResolveService } from './../assign-functional-gln/assign-functional-resolve.service';
import { EditGlnResolveService } from './edit-gln/edit-gln-resolve.service';
import { EditGlnComponent } from './edit-gln/edit-gln.component';
import { PreventUnsavedChangesGuard } from './../shared/prevent-unaved-changes-guard.services';
import { AdminUserGuardService } from './../services/admin-user-guard.service';

const editGlnRoutes: Routes = [
    {
        path: '',
        component: EditGlnComponent,
        resolve: {
            gln: EditGlnResolveService
        }
    },
    {
        path: 'assign-next-functional-gln/:addressId',
        component: EditGlnComponent,
        canActivate: [AdminUserGuardService],
        resolve: {
            gln: AssignFunctionalResolveService
        }
    },
    {
        path: 'assign-next-functional-gln/assign-parent/:gln',
        component: AssignParentGlnComponent,
        canActivate: [AdminUserGuardService],
        resolve: {
            gln: AssignParentGlnResolveService
        }
    },
    {
        path: 'assign-next-functional-gln/assign-address',
        component: AssignAddressGlnComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'assign-next-functional-gln/assign-primary-contact',
        component: AssignPrimaryContactComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'assign-next-functional-gln/:addressId/assign-address',
        component: AssignAddressGlnComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'assign-next-functional-gln/:addressId/assign-primary-contact',
        component: AssignPrimaryContactComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'assign-next-functional-gln/:addressId/assign-parent/:gln',
        component: AssignParentGlnComponent,
        canActivate: [AdminUserGuardService],
        resolve: {
            gln: AssignParentGlnResolveService
        }
    },
    {
        path: 'assign-parent/:gln',
        component: AssignParentGlnComponent,
        canActivate: [AdminUserGuardService],
        resolve: {
            gln: AssignParentGlnResolveService
        }
    },
    {
        path: 'assign-address',
        component: AssignAddressGlnComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'assign-primary-contact',
        component: AssignPrimaryContactComponent,
        canActivate: [AdminUserGuardService]
    }
];

export const editGlnRouting: ModuleWithProviders = RouterModule.forChild(editGlnRoutes);
