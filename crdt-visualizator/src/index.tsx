
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {operation} from './classes/operation';
import {update} from './classes/update';
import {increment_operation} from './classes/operation';
import {decrement_operation} from './classes/operation';
import {visualizer} from './classes/visualizer';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);

// we have 3 replicas on this example
//_________________________________-
// Step 1 initializing the visualizer
var v = new visualizer();


//____________________________________
// Step 2 adding operations on each replica

// R2 increment(X2)
var op1 : operation;
op1 = new increment_operation(1);
//add_operation (replica_id, operation as object)
v.add_operation(2,op1); 

// R2 increment(X2)
op1 = new increment_operation(4);
v.add_operation(2,op1);

// R2 increment(X2)
var op2 : operation;
op2 = new increment_operation(2);
v.add_operation(2,op2);

// R1 decrement(X1)
var op3 : operation;
op3 = new decrement_operation(3);
v.add_operation(1,op3);

// R1 decrement(X1)
var op3 : operation;
op3 = new decrement_operation(8);
v.add_operation(1,op3);

// R0 increment(X0)
op2 = new increment_operation(7);
v.add_operation(0,op2);

// R0 increment(X0)
op2 = new increment_operation(5);
v.add_operation(0,op2);

// R0 decrement(y0)
op2 = new decrement_operation(9);
v.add_operation(0,op2);

// To check the values within each variable, we have a variable list which conatins 3 variables (X0, X1, X2) coresponding with the replicas (R0, R1, R2)
console.log(v.variable_list[0].inner_value);
console.log(v.variable_list[2].inner_value);

//_____________________________________________
// Step 3 adding updates between replicas

// we create a new update object then we add it to the visualizer
// constructor of update (id, from Replica, from time, to replica, to time)

// update  from R2 (from time: 4)--> R0 (to time: 1)
var u = new update(1,2,4,0,1);
v.add_update(u);

// execute from R0 (from time 9)--> R2 (to time 3)
var u1 = new update(2,0,9,2,3);
v.add_update(u1);

//_________________________________________
// Step 4 removing updates or replicas
// we can remove updates by calling remove_update method remove_update(update_id: number)
v.remove_update(1);

// we can remove operations by calling remove_operation(replica_id: number, op_time : number)
// to remove operation at time_stamp 5 on replica R0
v.remove_operation(0,5);

//_________________________________________
// Step 5 inquery of a variable value at a time_stamp
// to get the value of X0 on R0  at point 6
var num = v.execute_update_query(0,6);
console.log( 'the result :' + num);
//______________________________________________________



registerServiceWorker();

