
import {CRDT_type} from './CRDT_type';
 type AddWinnsSetStateType = {
    element:string;
    tag:number;
}
export type  AddWinsSet_state = AddWinnsSetStateType[];


export type  AddWinsSet_Downstream =  {op: "add", added: AddWinnsSetStateType}| {op: "remove", removed_elements:AddWinsSet_state};

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
				for (let e2 of downstream_effect.removed_elements) {
					if ((e1.element === e2.element)&&(e1.tag==e2.tag)) {
						removed = true;
						break;
					}
				}
				if (!removed) {
					newState.push(e1);
				}
			}
			
			this.state= newState;
		}
       
    }


    new_at_source(operation_name: string, elem: string): AddWinsSet_Downstream {
		
        if (operation_name == "remove") {
			let R: AddWinsSet_state = []
			for (let e of this.state) {
				if (e.element === elem) {
					R.concat(e)
				}
			} 			
			return {op: "remove", removed_elements: R};
		} else {
			this.last_tag++;
            let tag = this.last_tag;
			return {op: "add", added: {element: elem, tag: tag}};
        }        
       
	}

	display(): string {
		let result : string = '{ ';
		for (var i=0 ; i< this.state.length;i++ ){
			result += '( ' + this.state[i].element + ' )';
		}
		result+=' }';
		return result;
	}
	



}

