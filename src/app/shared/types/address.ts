//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IAddress } from '../interfaces/iaddress';

export class Address implements IAddress {

    Id: number;
    AddressLineOne: string;
    AddressLineTwo: string;
    AddressLineThree: string;
    AddressLineFour: string;
    City: string;
    RegionCounty: string;
    Postcode: string;
    Country: string;
    Level: number;
    Room: string;
    DeliveryNote: string;
    Active: boolean;
    Version: number;
}