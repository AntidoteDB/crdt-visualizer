
import {replica} from './replica';
import {operation} from './operation';
import {update} from './update';
import {counter} from './counter';
export class visualizer {

//---------- Properties---------------------
public variable_list: counter []=[];
public replica_list: replica []=[];
public update_list: update []=[];
public execution_matrix: number [][];

//----------Metods--------------------------
constructor(){
	//???????? should we read the replica_num and var_num here from the json file or pass them as input for the constrictor???????????????ß
	var replica_num: number=3;
	
	//initializing replicas and variables

	for (var i=0; i < replica_num; i++) {
		this.add_replica(i);
		this.variable_list.push(new counter(i)); 
	}	          

    //initializing execution matrix
    this.execution_matrix= [];
    for (var i=0; i < replica_num; i++) {
    	this.execution_matrix[i]=[];
    	for (var j=0; j < replica_num; j++) {
			this.execution_matrix[i][j] = 0;
		}
	}

}

//------------------------------------------
add_replica(id: number){
	this.replica_list.push(new replica(id));
}


//-------------------------------------------
add_operation( replica_id : number, op: operation){
		this.variable_list[replica_id].operation_list.push(op);
}

//-------------------------------------------
remove_operation(replica_id: number, op_time : number){
	this.variable_list[replica_id].remove_op(op_time);	
}

//-------------------------------------------
add_update(u : update){
	// add the new update to the list
	this.update_list.push(u);
}

//----------------------------------------------------
remove_update(u_id: number){
	var index: number = 0;
  	for (var i=0; i < this.update_list.length; i++) {
    	if (u_id == this.update_list[i].update_id){
      		index = i;
    	}
  	}
  	this.update_list.splice(index,1); 
}

//---------------------------------------------------
execute_updates(){
	// initializing variables inner values
	for (var i=0; i < this.variable_list.length; i++) {
		this.variable_list[i].inner_value = 0; 
	}

	//initializing execution matrix
    this.execution_matrix= [];
    for (var i=0; i < this.replica_list.length; i++) {
    	this.execution_matrix[i]=[];
    	for (var j=0; j < this.replica_list.length; j++) {
			this.execution_matrix[i][j] = 0;
		}
	}

	// execute  updates list
	this.execute_update_List();
}


//-------------------------------------------
execute_update_List(){
		var max_from: number =0;
		var max_to : number = 0;
		for (var i=0; i < this.replica_list.length; i++) {//from replica loop
			for (var j=0; j < this.replica_list.length; j++) {//to replica loop
				if (i!=j){// we don't have updates on the same replica

					//we search in the update list for the last time stamp an update has occured
					for (var k=0; k < this.update_list.length; k++) {// update list loop
						if ((this.update_list[k].from_replica == this.replica_list[i].id)&&(this.update_list[k].to_replica == this.replica_list[j].id)){
							if (this.update_list[k].from_time_stamp > max_from){
								max_from = this.update_list[k].from_time_stamp;
							}
							if (this.update_list[k].to_time_stamp > max_to){
								max_to = this.update_list[k].to_time_stamp;
							}
						}
						
					}

					// perform the last update -if exists- from replica i to replica j
					if ((max_from !=0 )||(max_to != 0)){	
					//1. perform the operation list from i on i till max from				
					this.variable_list[i].perform_self_operations(this.execution_matrix[i][i],max_from);
					this.execution_matrix[i][i] = max_from;
					
					//2. perform the operation list from j on j till max to
					this.variable_list[j].perform_self_operations(this.execution_matrix[j][j],max_to);
					this.execution_matrix[j][j] = max_to;
					
					//3. perform the operation list from i on j till max from					
					this.variable_list[i].perform_operations_on_replica(this.variable_list[j],this.execution_matrix[i][j],max_from);					
					this.execution_matrix[i][j] = max_from;					
					}

					max_from = 0; 
					max_to = 0;
				}
			}
		}

}

//----------------------------------------------------------------------------------------




//-------------------------------------------
// we can easily add time_stamp to execute the operations till a given time point!!!!!!!!!
execute_operation( source_replica : number,from_time_stamp: number, destination_replica: number, to_time_stamp: number){
	
	///1//////apply operations from source on source -downstream-
	if (this.variable_list[source_replica].execute_operations(this.execution_matrix[source_replica][source_replica],from_time_stamp)) {
	// update the matrix
		this.execution_matrix[source_replica][source_replica] = from_time_stamp;
	}

	///2/////apply the operations of both source replica and destination replica on destination replica
	///2.1 ///apply operations from source replica on destination replica
	for (var i=0; i < this.variable_list[source_replica].operation_list.length; i++) {
		if ( this.variable_list[source_replica].operation_list[i].time_stamp <=from_time_stamp){
			this.variable_list[source_replica].operation_list[i].apply(this.variable_list[destination_replica]);}
		
	}
	//update the matrix 
	this.execution_matrix[source_replica][destination_replica] = from_time_stamp;

	///2.2 ///apply operations from destiation replica on destination replica
	if (this.variable_list[destination_replica].execute_operations(this.execution_matrix[destination_replica][destination_replica],to_time_stamp)) {
	// update the matrix
		this.execution_matrix[destination_replica][destination_replica] = to_time_stamp;
	}
	/// Add the time stamp to the execution matrix
	//this.execution_matrix[source_replica][source_replica] = from_time_stamp ;
	//this.execution_matrix[source_replica][destination_replica] = to_time_stamp ;
}	



//---------------Query--------------------
//----------------------------------------
execute_update_query(replica_id : number,time_stamp: number):number{
	var last_update: update;
	last_update = new update(1000,0,0,0,0);
	var last_update_list : update []= [];

	// initializing variables inner values
	for (var i=0; i < this.variable_list.length; i++) {
		this.variable_list[i].inner_value = 0; 
	}

	//initializing execution matrix
    this.execution_matrix= [];
    for (var i=0; i < this.replica_list.length; i++) {
    	this.execution_matrix[i]=[];
    	for (var j=0; j < this.replica_list.length; j++) {
			this.execution_matrix[i][j] = 0;
		}
	}

	//searching for the last update on the replica from all the other replicas, which occured before time_stamp
	for (var i=0; i < this.replica_list.length; i++) {// update list loop
		last_update = new update(1000,0,0,0,0);
		for (var k=0; k < this.update_list.length; k++) {// update list loop
			if ((this.update_list[k].to_time_stamp <= time_stamp)&&(this.update_list[k].to_replica == replica_id)&& (this.replica_list[i].id == this.update_list[k].from_replica )){
				if (this.update_list[k].to_time_stamp > last_update.to_time_stamp){
						last_update = this.update_list[k];
				}
					
			}//if
		}// k for
		// add the found update to all updates we should perform on a replica
		if (last_update.update_id != 1000){
			last_update_list.push(last_update);
		}	
	}// i for

	//performing all the updates on the replica
	for (var j=0; j < last_update_list.length; j++){
		this.variable_list[last_update_list[j].from_replica].perform_operations_on_replica(this.variable_list[replica_id],this.execution_matrix[last_update_list[j].from_replica][replica_id],last_update_list[j].from_time_stamp);
	}

	//perform all self operations on the replica till the time_stamp 
	this.variable_list[replica_id].perform_self_operations(this.execution_matrix[replica_id][replica_id],time_stamp);
	
	return this.variable_list[replica_id].inner_value;

}



}



















