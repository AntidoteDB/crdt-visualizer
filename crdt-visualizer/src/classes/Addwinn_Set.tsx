
import {CRDT_type} from './CRDT_type';
 type AddWinnsSetStateType = {
    element:string;
    tag:number;
}
export type  AddWinsSet_state = AddWinnsSetStateType[];
class set_type{
	
	element:string;
	tag:number;
	constructor(e:string, t:number){
		this.element = e;
		this.tag= t;
	}
	
}

export type  AddWinsSet_Downstream =  {op: "add", added: AddWinnsSetStateType}| {op: "remove", removed:AddWinnsSetStateType};

export class Addwinn_Set extends CRDT_type {

//---------- Properties---------------------    

    //state: AddWinsSet_state;
    last_tag:number;    
    AddWinsSetOperation :	{op: "add"; element:number}  | {op: "remove"; element: number};
	delete_tage: number;
	downstream_counter:number;
	 state: set_type []=[];
//----------Metods--------------------------

//////////CONSTRUCTOR///////////////////////
    constructor() {
        super();
        this.state = [];
		this.last_tag=1;
		this.delete_tage=1;
		this.downstream_counter=1;
    }

    init(){
		this.state = [];
		//this.test=[];
		this.last_tag=1;
		this.delete_tage=1;
		this.downstream_counter=1;
	}

    new_downstream(downstream_effect: AddWinsSet_Downstream){
		
		var mytest: set_type []=[];
        if (downstream_effect.op == "add") {
			
			 var se: set_type;
			 var n : number= this.downstream_counter;
			 var st: string= downstream_effect.added.element;
			 se= new set_type(st,n);

			 mytest.push(se);
			 this.state.push(se);
			 this.downstream_counter=this.downstream_counter+1;
			
		
		} else {
			let newState: set_type []=[];			
			for (var i = 0; i < this.state.length; i++) {
				
				let removed = false;
					if (this.state[i].element == downstream_effect.removed.element) {
							if ((this.state[i].tag<downstream_effect.removed.tag)||(this.state[i].tag==downstream_effect.removed.tag)){
							removed = true;
						}
					}
				if (!removed) {
					newState.push(this.state[i]);
				}
			} 
			this.state= newState;
		}
       
    }


    new_at_source(operation_name: string, elem: string): AddWinsSet_Downstream {
		var c: AddWinsSet_Downstream;
        if (operation_name == "remove") {
			this.delete_tage=this.last_tag;
			c= {op: "remove", removed: {element: elem, tag: this.delete_tage}};
			return c;
		} else {
			let tag = this.last_tag;
			c= {op: "add", added: {element: elem, tag: tag}};
			this.last_tag++;
			return c;
        }        
       
	}

	display(): string {
		let result : string = '{ ';
		for (var i=0 ; i< this.state.length;i++ ){
			result += '( ' + this.state[i].element + ', '+ this.state[i].tag +   ')';
		}
		result+=' }';
		return result;
	}
	



}

