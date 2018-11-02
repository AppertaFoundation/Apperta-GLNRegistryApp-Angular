//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IGlnTagType } from './../interfaces/igln-tag-type';
import { Component, OnInit, Input } from '@angular/core';
import { IGlnTag } from '../interfaces/igln-tag';

@Component({
  selector: 'app-tag-type',
  templateUrl: './tag-type.component.html',
  styleUrls: ['./tag-type.component.css']
})
export class TagTypeComponent implements OnInit {

  @Input()
  tagType: IGlnTagType;

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
  }
}
