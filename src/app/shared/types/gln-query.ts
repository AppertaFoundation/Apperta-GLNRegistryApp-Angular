//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IGlnQuery } from './../interfaces/iglnQuery';

export class GlnQuery implements IGlnQuery {
    Physical: boolean;
    Functional: boolean;
    Digital: boolean;
    Legal: boolean;
    MatchAllTypes: boolean;
    Public: boolean;
    Private: boolean;
    TrustActive: boolean;
    AllStatus: boolean;
    SortBy: string;
    Page: number;
    IsSortAscending: boolean;
    PageSize: number;
    SearchTerm: string;
    ParentGln: string;
    SearchAll: boolean;
    StartsWith: boolean;
    ChildrenOnly: boolean;
    TagTypeIds: number[];
}
