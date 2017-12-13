export class update {
   update_id: number;
   from_replica: number;
   to_replica : number;
   from_time_stamp: number;
   to_time_stamp: number;

   constructor(id: number, f_rep: number,f_time: number, t_rep: number, t_time: number ){
         this.update_id= id;
         this.from_replica = f_rep;
         this.to_replica= t_rep;
         this.from_time_stamp= f_time;
         this.to_time_stamp = t_time;
   }
}

