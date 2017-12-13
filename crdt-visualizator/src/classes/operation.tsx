
export class operation {
   time_stamp: number;
   is_executed_locally: boolean = false;
   constructor(time_stamp: number){
	   	this.time_stamp = time_stamp;   
   }
    apply( obj:any){}
}


export class increment_operation extends operation{
   
   apply( obj:any){
   		obj.increment();
   }
}

export class decrement_operation extends operation{
   
   apply(obj:any){
   		obj.decrement();
   }
}