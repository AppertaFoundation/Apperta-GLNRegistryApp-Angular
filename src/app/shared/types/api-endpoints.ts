//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { environment } from './../../../environments/environment';
export class ApiEndpoints {

    HOST = environment.apiURL;
    GET_GLN_QUERY_RESULT = `api/glnBarcodesQuery`;
    GET_PRIMARY_GLN = `api/glnPrimary`;
    CHANGE_PARENT = `api/glnChangeParent/`;
}