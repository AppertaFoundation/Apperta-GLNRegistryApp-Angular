//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
export class Titles {

    public options: Array<Title>;

    constructor() {

        this.options = Array<Title>();
        this.options.push(new Title(-1, 'Please Select'));
        this.options.push(new Title(1, 'Mr'));
        this.options.push(new Title(2, 'Mrs'));
        this.options.push(new Title(3, 'Ms'));
        this.options.push(new Title(4, 'Miss'));
        this.options.push(new Title(5, 'Sir'));
        this.options.push(new Title(6, 'Dr'));
        this.options.push(new Title(7, 'Prof'));

    }

    public AddSalutation(title: Title): void {

        this.options.push(title);
    }
}

export class Title {
    public id: number;
    public name: string;

    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }
}
