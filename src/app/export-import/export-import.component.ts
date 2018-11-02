//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { ExportImportService } from './export-import.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-export-import',
  templateUrl: './export-import.component.html',
  styleUrls: ['./export-import.component.css']
})
export class ExportImportComponent implements OnInit {

  constructor(private _exportImportService: ExportImportService) { }

  ngOnInit() {

  }

  createDownloadCsvForNationalExport() {
    this._exportImportService.createDownloadCsvForNationalExport();
  }

}
