	class Draw_replicas {
		canvas: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;
		replicas:[Replica];  
		ops:Operation[]=[];
		mousedown:boolean = false;
		last_mousex:number =0; 
		last_mousey:number = 0;
		mousex:number =0;
		mousey:number = 0;
		updates:update[]=[];
		h:update;
		canvas_width:number;
		canvas_height:number;



		public constructor(left:number, top:number, width:number,height:number,canvas_name:string) {
			var can = document.createElement('canvas');

			can.id = canvas_name;
			can.width = width;
			can.height = height;
			can.style.zIndex = "8";
			can.style.position = "absolute";
			can.style.border = "2px solid #d3d3d3";
			var body = document.getElementsByTagName("body")[0];
			body.appendChild(can);



			this.canvas = <HTMLCanvasElement>document.getElementById(canvas_name);
			this.canvas.width=width;
			this.canvas.height=height;
			this.canvas.style.position="absolute";
			this.canvas.style.left=left+"px";
			this.canvas.style.top=top+"px";
			this.canvas_width=this.canvas.width;
			this.canvas_height=this.canvas.height;
			this.ctx = this.canvas.getContext("2d");
			this.title(this.ctx,this.canvas);
			var x= this.canvas_width/100*3.8  ;
			let r1 = new Replica(this.ctx,this.canvas,this.canvas_height,this.canvas_width,"R1", "blue", x,(this.canvas_height*0.2));
			let r2 = new Replica(this.ctx,this.canvas,this.canvas_height,this.canvas_width,"R2", "green",x,(this.canvas_height*0.5));
			let r3 = new Replica(this.ctx,this.canvas,this.canvas_height,this.canvas_width,"R3", "purple",x,(this.canvas_height*0.8));
			this.replicas=[r1,r2,r3];
			this.wait_for_operations(this.canvas,this.ctx,this.h);

		}
		public title(ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement) 
		{ctx.font =(this.canvas_width/100*3) +"px Comic Sans MS";
		ctx.fillStyle = "#680000 ";
		ctx.fillText("Crdt.name", (this.canvas_width/2),(this.canvas_height)*0.1); }

		public getReplica(x:number,y:number):Replica {
			var i:number=0;
			for (i;i<this.replicas.length;i++) {
				if ((x>=this.replicas[i].coordinates[0]) && (y>=this.replicas[i].coordinates[1]) && (x<=this.replicas[i].coordinates[2]) && (y<=this.replicas[i].coordinates[3]))
					{return this.replicas[i];}


			}
			return null; 
		}

		public check_Operation_clicked(x:number,y:number,canvas:HTMLCanvasElement):boolean {
			var i:number=0;
			for(i;i<this.ops.length;i++){
				if (this.ops[i].check_clicked(x,y))
					return true} return false;


			}

			public getX(evt):number {return evt.clientX-this.canvas.offsetLeft+document.body.scrollLeft;}		
			public getY(evt):number {return evt.clientY-this.canvas.offsetTop+document.body.scrollTop;}	

			public dbclick(evt,ctx) {

				if (this.ops.indexOf(this.getReplica(this.getX(evt),this.getY(evt)).getOpbyCoordinate(this.getX(evt),this.getY(evt)))!=(-1)){
					alert(this.getReplica(this.getX(evt),this.getY(evt)).getOpbyCoordinate(this.getX(evt),this.getY(evt)).name); 
				}

				else if (this.getReplica(this.getX(evt),this.getY(evt))!=null ){
					let x=this.getReplica(this.getX(evt),this.getY(evt)).add_Operation(ctx,this.getX(evt));
					x;
					this.ops.push(x);
				} 
			};

			public mmove (evt,ctx,canvas){




				if (this.ops.length>0 &&this.getReplica(this.getX(evt),this.getY(evt))!=null &&this.getReplica(this.getX(evt),this.getY(evt)).getOpbyCoordinate(this.getX(evt),this.getY(evt))!=null&&this.check_Operation_clicked(this.getX(evt),this.getY(evt),canvas) && !this.getReplica(this.getX(evt),this.getY(evt)).getOpbyCoordinate(this.getX(evt),this.getY(evt)).removed )
					{canvas.style.cursor="pointer";
				this.getReplica(this.getX(evt),this.getY(evt)).getOpbyCoordinate(this.getX(evt),this.getY(evt)).change_color('red');


			}
			else{
				var i:number=0;
				for(i;i<this.ops.length;i++){this.ops[i].change_color('#c60000')}
					canvas.style.cursor="default";}}

				public ctxmenu (e,canvas) {
					e.preventDefault();

					if (this.check_Operation_clicked(this.getX(e),this.getY(e),canvas))
						{if( ! confirm("Do you really want to remove the operation?") ){
							e.preventDefault(); // ! => don't want to do this
						}else{
							this.getReplica(this.getX(e),this.getY(e)).getOpbyCoordinate(this.getX(e),this.getY(e)).delete(this.getReplica(this.getX(e),this.getY(e)).color);

							let index = this.ops.indexOf(this.getReplica(this.getX(e),this.getY(e)).getOpbyCoordinate(this.getX(e),this.getY(e)), 0);
							if (index > -1) {
								this.ops.splice(index, 1);
								this.getReplica(this.getX(e),this.getY(e)).remove_op(this.getReplica(this.getX(e),this.getY(e)).getOpbyCoordinate(this.getX(e),this.getY(e)));
							}}}}	





							public  wait_for_operations(canvas: HTMLCanvasElement,ctx:CanvasRenderingContext2D,h:update) {

								canvas.addEventListener('dblclick',(evt) => this.dbclick(evt,ctx),false);

								canvas.addEventListener('mousemove',(evt) => this.mmove(evt,ctx,canvas),false);

								canvas.addEventListener("contextmenu",(e) => this.ctxmenu(e,canvas), false);



							}



						} 



						class Replica {
							i:number=0;
							width:number;
							height:number;
							posX:number;
							posY:number;
							name:string;
							bubble_r:number;
							color:string;
							//coordinates of left upper corner and right down corner
							coordinates:number[];
							operaions:Operation[]=[];


							public constructor(ctx: CanvasRenderingContext2D,canvas:HTMLCanvasElement,canvas_height:number,canvas_width:number,name:string,color:string,posX:number,posY:number) {
								this.posX=posX;
								this.posY=posY;
								this.name=name;
								this.color=color;
								this.width=canvas_width/100*90;
								this.height=canvas_height/100*8; 
								this.bubble_r=this.height/2.4;
								this.coordinates=[this.posX,this.posY,this.posX+this.width,this.posY+this.height];
								ctx.beginPath();
								ctx.rect(this.posX, this.posY, this.width, this.height);
								ctx.fillStyle = color;
								ctx.fill();
								ctx.font = (canvas_width/100*3) + "px Arial";
								ctx.fillText(name,0,this.posY);
							}
							public add_Operation(ctx: CanvasRenderingContext2D,posX:number):Operation{
								let promptValue = prompt('Enter a valid operation','');
								let mpoint:number=((this.coordinates[1] + this.coordinates[3]) / 2);
								if (promptValue != null && promptValue!="") {
									let x=new Operation(promptValue,posX,mpoint,this.bubble_r,ctx,this.width);
									this.operaions.push(x);
									x.draw(ctx,posX,mpoint);
									return x;

								}}
								public getOpbyCoordinate (x:number, y:number) {
									var i:number=0;
									for (i;i<this.operaions.length;i++) { if (this.operaions[i].check_clicked(x,y)) return this.operaions[i] }

										return null;
								}
								public remove_op(op:Operation) {


									var index = this.operaions.indexOf(op, 0);
									if (index > -1) {
										this.operaions.splice(index, 1);}


									}  



								}

								class Operation {
									name:string;
									posX:number;
									posY:number;
									bubble_r:number;
									canvas_width:number;
									removed:boolean=false;
									ctx;
									public constructor (name:string,posX:number, posY:number, bubble_r:number,ctx,canvas_width:number) {
										this.canvas_width=canvas_width;
										this.name=name;
										this.posX=posX;
										this.posY=posY;
										this.bubble_r=bubble_r;
										this.ctx=ctx;}   
										public check_clicked (x:number,y:number):boolean {
											var dx = x - this.posX;
											var dy = y - this.posY;
											var dist = Math.sqrt(dx * dx + dy * dy);
											return (dist < this.bubble_r)
										}
										public draw(ctx,posX,mpoint) {
											ctx.beginPath();
											ctx.arc(posX,mpoint,this.bubble_r,0,2*Math.PI);
											ctx.fillStyle = '#c60000';
											ctx.fill();
											ctx.lineWidth = this.canvas_width/100*0.2;
											ctx.strokeStyle = '#003300';
											ctx.stroke();
										}

										public change_color(color:string) {
											this.ctx.beginPath();
											this.ctx.arc(this.posX,this.posY,this.bubble_r,0,2*Math.PI);
											this.ctx.fillStyle = color;
											this.ctx.fill();
											this.ctx.lineWidth =this.canvas_width/100*0.2;
											this.ctx.strokeStyle = '#003300';
											this.ctx.stroke();


										}

										public delete(color:string) {
											this.ctx.beginPath();
											this.ctx.arc(this.posX,this.posY,(this.bubble_r+this.canvas_width/100*0.2),0,2*Math.PI);
											this.ctx.fillStyle = color;
											this.ctx.fill();
											this.ctx.strokeStyle = color;
											this.ctx.stroke();
											this.removed=true;



										}
										public redraw () {
											this.ctx.beginPath();
											this.ctx.arc(this.posX,this.posY,this.bubble_r,0,2*Math.PI);
											this.ctx.fillStyle = '#c60000';
											this.ctx.fill();
											this.ctx.lineWidth = this.canvas_width/100*0.2;
											this.ctx.strokeStyle = '#003300';
											this.ctx.stroke();

										}

									}



									class update  {
										r1:Replica;
										t1:number;
										r2:Replica;
										t2:number;
										ctx: CanvasRenderingContext2D;
										public constructor(){}
										public save (ctx,r1,t1,r2,t2) {
											this.ctx=ctx;	
											this.r1=r1;
											this.t1=t1;
											this.r2=r2;
											this.t2=t2;



										}

										public draw_line(ctx,last_mousex,last_mousey,mousex,mousey,canvas_width) {
											ctx.beginPath();
											ctx.moveTo(last_mousex,last_mousey);
											ctx.lineTo(mousex,mousey);
											ctx.strokeStyle = 'black';
											ctx.lineWidth = canvas_width*0.005;
											ctx.lineJoin = ctx.lineCap = 'round';
											ctx.stroke();
											ctx.closePath();


										}  


									}                




