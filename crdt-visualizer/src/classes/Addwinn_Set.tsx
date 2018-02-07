
import {CRDT_type} from './CRDT_type';
 type AddWinnsSetStateType = {
    element:string;
    tag:number;
}
export type  AddWinsSet_state = AddWinnsSetStateType[];

export type  AddWinsSet_Downstream =  {op: "add", added: AddWinnsSetStateType}| {op: "remove", removed_element:string};

export class Addwinn_Set extends CRDT_type {

//---------- Properties---------------------    

    state: AddWinsSet_state;
    last_tag:number;    
    AddWinsSetOperation :	{op: "add"; element:number}  | {op: "remove"; element: number};

//----------Metods--------------------------

//////////CONSTRUCTOR///////////////////////
    constructor() {
        super();
        this.state = [];
        this.last_tag=0;
    }

    init(){
        this.state = [];
        this.last_tag=0;
    }

    new_downstream(downstream_effect: AddWinsSet_Downstream){
        if (downstream_effect.op == "add") {
			 this.state.push(downstream_effect.added);
		} else {
			let newState: AddWinsSet_state = [];
			for (let e1 of this.state) {
				let removed = false;
				//for (let e2 of downstream_effect.removed) {
					if (e1.element === downstream_effect.removed_element) {
						removed = true;
						break;
					}
				//}
				if (!removed) {
					newState.push(e1);
				}
			}
			this.state= newState;
		}
       

    }


    new_at_source(operation_name: string, elem: string): AddWinsSet_Downstream {
		console.log(elem);
        if (operation_name == "remove") {
			/* let R: string='';
			for (var i = 0; i < this.state.length; i++) {
				if (this.state[i].element == elem) {
					console.log('equal found!');
					R= this.state[i].element;
				}
				console.log('equal not  found!');
			}            
			console.log('R');
			console.log(R); */
			return {op: "remove", removed_element: elem};
		} else {
			this.last_tag++;
            let tag = this.last_tag;
            console.log('aading : ');
			return {op: "add", added: {element: elem, tag: tag}};
        }
        
       
    }


}

