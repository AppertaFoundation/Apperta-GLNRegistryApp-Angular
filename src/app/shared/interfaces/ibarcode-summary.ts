//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.

export interface IBarcodeSummary {

    Id: number;
    FriendlyDescriptionPurpose: string;
    Active: boolean;
    OwnGln: string;
    ParentGln: string;
    ParentDescriptionPurpose: string;
    FunctionalType: boolean;
    LegalType: boolean;
    DigitalType: boolean;
    PhysicalType: boolean;
    NumberOfChildren: number;
    TrustActive: boolean;
    SuspensionReason: string;
    SuspendedBy: string;
    SuspensionDate: Date;
    Version: number;
    Primary: boolean;
    TruthDescriptionPurpose: string;
    AlternativeSystemIsTruth: boolean;
    Public: boolean;
}
