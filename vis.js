var Draw_replicas = /** @class */ (function () {
    function Draw_replicas(left, top, width, height, canvas_name) {
        this.ops = [];
        this.mousedown = false;
        this.last_mousex = 0;
        this.last_mousey = 0;
        this.mousex = 0;
        this.mousey = 0;
        this.updates = [];
        var can = document.createElement('canvas');
        can.id = canvas_name;
        can.width = width;
        can.height = height;
        can.style.zIndex = "8";
        can.style.position = "absolute";
        can.style.border = "2px solid #d3d3d3";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(can);
        this.canvas = document.getElementById(canvas_name);
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.position = "absolute";
        this.canvas.style.left = left + "px";
        this.canvas.style.top = top + "px";
        this.canvas_width = this.canvas.width;
        this.canvas_height = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");
        this.title(this.ctx, this.canvas);
        var x = this.canvas_width / 100 * 3.8;
        var r1 = new Replica(this.ctx, this.canvas, this.canvas_height, this.canvas_width, "R1", "blue", x, (this.canvas_height * 0.2));
        var r2 = new Replica(this.ctx, this.canvas, this.canvas_height, this.canvas_width, "R2", "green", x, (this.canvas_height * 0.5));
        var r3 = new Replica(this.ctx, this.canvas, this.canvas_height, this.canvas_width, "R3", "purple", x, (this.canvas_height * 0.8));
        this.replicas = [r1, r2, r3];
        this.wait_for_operations(this.canvas, this.ctx, this.h);
    }
    Draw_replicas.prototype.title = function (ctx, canvas) {
        ctx.font = (this.canvas_width / 100 * 3) + "px Comic Sans MS";
        ctx.fillStyle = "#680000 ";
        ctx.fillText("Crdt.name", (this.canvas_width / 2), (this.canvas_height) * 0.1);
    };
    Draw_replicas.prototype.getReplica = function (x, y) {
        var i = 0;
        for (i; i < this.replicas.length; i++) {
            if ((x >= this.replicas[i].coordinates[0]) && (y >= this.replicas[i].coordinates[1]) && (x <= this.replicas[i].coordinates[2]) && (y <= this.replicas[i].coordinates[3])) {
                return this.replicas[i];
            }
        }
        return null;
    };
    Draw_replicas.prototype.check_Operation_clicked = function (x, y, canvas) {
        var i = 0;
        for (i; i < this.ops.length; i++) {
            if (this.ops[i].check_clicked(x, y))
                return true;
        }
        return false;
    };
    Draw_replicas.prototype.getX = function (evt) { return evt.clientX - this.canvas.offsetLeft + document.body.scrollLeft; };
    Draw_replicas.prototype.getY = function (evt) { return evt.clientY - this.canvas.offsetTop + document.body.scrollTop; };
    Draw_replicas.prototype.dbclick = function (evt, ctx) {
        if (this.ops.indexOf(this.getReplica(this.getX(evt), this.getY(evt)).getOpbyCoordinate(this.getX(evt), this.getY(evt))) != (-1)) {
            alert(this.getReplica(this.getX(evt), this.getY(evt)).getOpbyCoordinate(this.getX(evt), this.getY(evt)).name);
        }
        else if (this.getReplica(this.getX(evt), this.getY(evt)) != null) {
            var x = this.getReplica(this.getX(evt), this.getY(evt)).add_Operation(ctx, this.getX(evt));
            x;
            this.ops.push(x);
        }
    };
    ;
    Draw_replicas.prototype.mmove = function (evt, ctx, canvas) {
        if (this.ops.length > 0 && this.getReplica(this.getX(evt), this.getY(evt)) != null && this.getReplica(this.getX(evt), this.getY(evt)).getOpbyCoordinate(this.getX(evt), this.getY(evt)) != null && this.check_Operation_clicked(this.getX(evt), this.getY(evt), canvas) && !this.getReplica(this.getX(evt), this.getY(evt)).getOpbyCoordinate(this.getX(evt), this.getY(evt)).removed) {
            canvas.style.cursor = "pointer";
            this.getReplica(this.getX(evt), this.getY(evt)).getOpbyCoordinate(this.getX(evt), this.getY(evt)).change_color('red');
        }
        else {
            var i = 0;
            for (i; i < this.ops.length; i++) {
                this.ops[i].change_color('#c60000');
            }
            canvas.style.cursor = "default";
        }
    };
    Draw_replicas.prototype.ctxmenu = function (e, canvas) {
        e.preventDefault();
        if (this.check_Operation_clicked(this.getX(e), this.getY(e), canvas)) {
            if (!confirm("Do you really want to remove the operation?")) {
                e.preventDefault(); // ! => don't want to do this
            }
            else {
                this.getReplica(this.getX(e), this.getY(e)).getOpbyCoordinate(this.getX(e), this.getY(e))["delete"](this.getReplica(this.getX(e), this.getY(e)).color);
                var index = this.ops.indexOf(this.getReplica(this.getX(e), this.getY(e)).getOpbyCoordinate(this.getX(e), this.getY(e)), 0);
                if (index > -1) {
                    this.ops.splice(index, 1);
                    this.getReplica(this.getX(e), this.getY(e)).remove_op(this.getReplica(this.getX(e), this.getY(e)).getOpbyCoordinate(this.getX(e), this.getY(e)));
                }
            }
        }
    };
    Draw_replicas.prototype.wait_for_operations = function (canvas, ctx, h) {
        var _this = this;
        canvas.addEventListener('dblclick', function (evt) { return _this.dbclick(evt, ctx); }, false);
        canvas.addEventListener('mousemove', function (evt) { return _this.mmove(evt, ctx, canvas); }, false);
        canvas.addEventListener("contextmenu", function (e) { return _this.ctxmenu(e, canvas); }, false);
    };
    return Draw_replicas;
}());
var Replica = /** @class */ (function () {
    function Replica(ctx, canvas, canvas_height, canvas_width, name, color, posX, posY) {
        this.i = 0;
        this.operaions = [];
        this.posX = posX;
        this.posY = posY;
        this.name = name;
        this.color = color;
        this.width = canvas_width / 100 * 90;
        this.height = canvas_height / 100 * 8;
        this.bubble_r = this.height / 2.4;
        this.coordinates = [this.posX, this.posY, this.posX + this.width, this.posY + this.height];
        ctx.beginPath();
        ctx.rect(this.posX, this.posY, this.width, this.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.font = (canvas_width / 100 * 3) + "px Arial";
        ctx.fillText(name, 0, this.posY);
    }
    Replica.prototype.add_Operation = function (ctx, posX) {
        var promptValue = prompt('Enter a valid operation', '');
        var mpoint = ((this.coordinates[1] + this.coordinates[3]) / 2);
        if (promptValue != null && promptValue != "") {
            var x = new Operation(promptValue, posX, mpoint, this.bubble_r, ctx, this.width);
            this.operaions.push(x);
            x.draw(ctx, posX, mpoint);
            return x;
        }
    };
    Replica.prototype.getOpbyCoordinate = function (x, y) {
        var i = 0;
        for (i; i < this.operaions.length; i++) {
            if (this.operaions[i].check_clicked(x, y))
                return this.operaions[i];
        }
        return null;
    };
    Replica.prototype.remove_op = function (op) {
        var index = this.operaions.indexOf(op, 0);
        if (index > -1) {
            this.operaions.splice(index, 1);
        }
    };
    return Replica;
}());
var Operation = /** @class */ (function () {
    function Operation(name, posX, posY, bubble_r, ctx, canvas_width) {
        this.removed = false;
        this.canvas_width = canvas_width;
        this.name = name;
        this.posX = posX;
        this.posY = posY;
        this.bubble_r = bubble_r;
        this.ctx = ctx;
    }
    Operation.prototype.check_clicked = function (x, y) {
        var dx = x - this.posX;
        var dy = y - this.posY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        return (dist < this.bubble_r);
    };
    Operation.prototype.draw = function (ctx, posX, mpoint) {
        ctx.beginPath();
        ctx.arc(posX, mpoint, this.bubble_r, 0, 2 * Math.PI);
        ctx.fillStyle = '#c60000';
        ctx.fill();
        ctx.lineWidth = this.canvas_width / 100 * 0.2;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    };
    Operation.prototype.change_color = function (color) {
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.bubble_r, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = this.canvas_width / 100 * 0.2;
        this.ctx.strokeStyle = '#003300';
        this.ctx.stroke();
    };
    Operation.prototype["delete"] = function (color) {
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, (this.bubble_r + this.canvas_width / 100 * 0.2), 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.removed = true;
    };
    Operation.prototype.redraw = function () {
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.bubble_r, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#c60000';
        this.ctx.fill();
        this.ctx.lineWidth = this.canvas_width / 100 * 0.2;
        this.ctx.strokeStyle = '#003300';
        this.ctx.stroke();
    };
    return Operation;
}());
var update = /** @class */ (function () {
    function update() {
    }
    update.prototype.save = function (ctx, r1, t1, r2, t2) {
        this.ctx = ctx;
        this.r1 = r1;
        this.t1 = t1;
        this.r2 = r2;
        this.t2 = t2;
    };
    update.prototype.draw_line = function (ctx, last_mousex, last_mousey, mousex, mousey, canvas_width) {
        ctx.beginPath();
        ctx.moveTo(last_mousex, last_mousey);
        ctx.lineTo(mousex, mousey);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = canvas_width * 0.005;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    };
    return update;
}());
