//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IPagination } from './../interfaces/ipagination';


export class Pagination implements IPagination {
    CurrentPage: number;
    FirstPageToDisplay: number;
    LastPageToDisplay: number;
    ItemsPerPage: number;
    TotalItems: number;
    TotalItemsForDisplay: Number;
    TotalPages: number;
    Items: any[];
    PageOneItems: any[];
    PageTwoItems: any[];
    PageThreeItems: any[];
    PageOneIndex: number;
    PageTwoIndex: number;
    PageThreeIndex: number;
    SearchTerm: string;
    PreviousSearchTerm: string;
}
