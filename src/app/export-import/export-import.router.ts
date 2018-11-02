//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportImportComponent } from './export-import.component';

const exportImportRoutes: Routes = [
    {
        path: '',
        component: ExportImportComponent
    },
    {
        path: 'import-export/',
        component: ExportImportComponent
    }
];

export const exportImportRouting: ModuleWithProviders = RouterModule.forChild(exportImportRoutes);
