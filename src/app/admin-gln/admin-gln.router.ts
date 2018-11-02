//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAdditionalContactsComponent } from './admin-additional-contacts/admin-additional-contacts.component';
import { AdminReplacementAddressComponent } from './admin-address/admin-replacement-address/admin-replacement-address.component';
import { AdminAddressComponent } from './admin-address/admin-address.component';
import { AdminReplacementPrimaryContactComponent } from './admin-primary-contact/admin-replacement-primary-contact/admin-replacement-primary-contact.component';
import { AdminGlnNavComponent } from './admin-gln-nav/admin-gln-nav.component';
import { AdminPrimaryContactComponent } from './admin-primary-contact/admin-primary-contact.component';
import { AdminTagComponent } from './admin-tag/admin-tag.component';
import { AdminIprComponent } from './admin-ipr/admin-ipr.component';

import { AdminPrimaryContactResolveService } from './admin-primary-contact/admin-primary-contact-resolve.service';
import { AdminUserGuardService } from './../services/admin-user-guard.service';

const adminGlnRoutes: Routes = [
    {
        path: '',
        component: AdminGlnNavComponent,
        canActivate: [AdminUserGuardService]
    },
    {
        path: 'admin-primary-contact',
        component: AdminPrimaryContactComponent,
    },
    {
        path: 'admin-primary-contact/admin-replacement',
        component: AdminReplacementPrimaryContactComponent,
    },
    {
        path: 'admin-address',
        component: AdminAddressComponent,
    },
    {
        path: 'admin-address/admin-replacement',
        component: AdminReplacementAddressComponent,
    },
    {
        path: 'admin-additional-contact',
        component: AdminAdditionalContactsComponent,
    },
    {
        path: 'admin-ipr',
        component: AdminIprComponent
    },
    {
        path: 'admin-tag',
        component: AdminTagComponent
    },
];

export const adminGlnRouting: ModuleWithProviders = RouterModule.forChild(adminGlnRoutes);
