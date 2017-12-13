import {operation} from './operation';

export class counter {

//---------- Properties---------------------    
    
    inner_value: number;
    id: number;    
    public operation_list: operation []=[];
   

//----------Metods--------------------------

//////////CONSTRUCTOR///////////////////////
    constructor(id:number) {  
        this.inner_value = 0;         
        this.id = id;
    }
    
perform_operations_on_replica(c: counter, lower_time: number, upper_time: number){
      this.operation_sort();
      for (var i=0; i < this.operation_list.length; i++) {
        
        if ( (this.operation_list[i].time_stamp >lower_time)&&( this.operation_list[i].time_stamp <=upper_time)){
          this.operation_list[i].apply(c);          
        }
      }
      
  }


perform_self_operations(lower_time: number, upper_time: number){

      this.operation_sort();
      for (var i=0; i < this.operation_list.length; i++) {
        
        if ( (this.operation_list[i].time_stamp >lower_time)&&( this.operation_list[i].time_stamp <=upper_time)){
          this.operation_list[i].apply(this);         
        }
      }
      
 }

//executes the operations in the operation arry and change the inner_state of the object -downstream-
  execute_operations(lower_time: number, upper_time: number): boolean{
      this.operation_sort();

      for (var i=0; i < this.operation_list.length; i++) {
        
        if ( (this.operation_list[i].time_stamp >=lower_time)&&( this.operation_list[i].time_stamp <upper_time)){
          this.operation_list[i].apply(this);          
        }
      }
      if (i>0){ return true;}
      return false;
  }

//-----------------------------------------------------------
remove_op(op_time:number){
  var index: number = 0;
  for (var i=0; i < this.operation_list.length; i++) {
    if (op_time == this.operation_list[i].time_stamp){    
      index = i;
    }
  }
  this.operation_list.splice(index,1);  
}

//----------------------------------------------------------

//  operation_sort sorts the operations before performing downstream function, so that the operation are executed with respect of their timestamp    
    operation_sort(){
        var temp_op:operation;
        for (var i=0; i < this.operation_list.length; i++) {
            for (var j=i+1; j < this.operation_list.length; j++) {
                if (this.operation_list[i].time_stamp > this.operation_list[j].time_stamp){
                    temp_op = this.operation_list[i];
                    this.operation_list[i] = this.operation_list[j];
                    this.operation_list[j] = temp_op;
                }
            }
        }
    }

// increment the inner_state of this object by 1.
    increment(){    
        this.inner_value = this.inner_value + 1;        
    }
    
// decrement the inner_state of this object by 1.
    decrement(){    
        this.inner_value = this.inner_value - 1; 
    }



}

