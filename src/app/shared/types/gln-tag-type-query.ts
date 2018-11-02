//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IGlnTagTypeQuery } from './../interfaces/igln-tag-type-query';

export class GlnTagTypeQuery implements IGlnTagTypeQuery {
    Active: boolean;
    SortBy: string;
    Page: number;
    IsSortAscending: boolean;
    PageSize: number;
    SearchTerm: string;
}