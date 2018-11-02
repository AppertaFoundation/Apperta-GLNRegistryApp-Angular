//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders, Component } from '@angular/core';

import { PreventUnsavedChangesGuard } from './shared/prevent-unaved-changes-guard.services';
import { SearchGlnComponent } from './shared/search-gln/search-gln.component';

import { SearchGlnResolveService } from './shared/search-gln/search-gln-resolve.service';

export const APP_ROUTES: Routes = [
    {
        path: '',
        redirectTo: '/search',
        pathMatch: 'full'
    },
    {
        path: 'search',
        component: SearchGlnComponent,
        data: {
            editMode: true,
            reloadPreviousQuery: false
        },
    },
    {
        path: 'search-back',
        component: SearchGlnComponent,
        data: {
            editMode: true,
            reloadPreviousQuery: true
        },
    },
    {
        // lazy load the edit gln module only when navigated to
        path: 'search-back/edit-gln/:id',
        loadChildren: './edit-gln/edit-gln.module#EditGlnModule'
    },
    {
        // lazy load the edit gln module only when navigated to
        path: 'search/edit-gln/:id',
        loadChildren: './edit-gln/edit-gln.module#EditGlnModule'
    },
    {
        // lazy load the edit gln module only when navigated to
        path: 'associated-gln/edit-gln/:id',
        loadChildren: './edit-gln/edit-gln.module#EditGlnModule'
    },
    {
        // lazy load the admin gln module only when navigated to
        path: 'admin-gln',
        loadChildren: './admin-gln/admin-gln.module#AdminGlnModule'
    },
    {
        // lazy load the associations gln module only when navigated to
        path: 'associated-gln',
        loadChildren: './associations-gln/associations-gln.module#AssociationsGlnModule'
    },
    {
        // lazy load the associations tags module only when navigated to
        path: 'associated-tags',
        loadChildren: './associated-tags/associated-tags.module#AssociatedTagsModule'
    },
    {
        // lazy load the associations gln module only when navigated to
        path: 'export-import',
        loadChildren: './export-import/export-import.module#ExportImportModule'
    },
];

