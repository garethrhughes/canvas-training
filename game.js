(function(){
	var canvas;

	window.addEventListener('load', function(){
		canvas = document.getElementById('training');
		
		var game = new Game();
		canvas.addEventListener('mousemove', game.updateMousePosition.bind(game), false);
		
		game.start(canvas.getContext('2d'));
	}, false);
	
	
	var Game = function() {	
		this.map = [[1, 0, 0, 0, 0, 0 , 0], [1, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]];
		this.tileData = ['water.png', 'land.png'];
		this.resources = [];
		this.loaded = 0;
		
		this.sprites = [{
			stage: 0,
			pose: 0,
			resource: 'http://i.imgur.com/JOgtn.png',
			update: function(){
				this.stage += 1;
				if(this.stage >= 8) {
					this.stage = 0;
					this.pose += 1;
					if(this.pose >= 9) {
						this.pose = 0;
					}
				}
			},
			image: new Image(),
			draw: function(ctx){
				ctx.drawImage(this.image, 110 * this.stage, 128 * this.pose, 110, 128, 95, 50, 55, 64)
			}
		}];
		
		this.loadResources();
	};
	
	Game.prototype.renderText = function(ctx, x, y, text) {
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 1;

		ctx.fillRect  (x, y, 45, 25);
		ctx.strokeRect(x,  y, 45, 25);

		ctx.fillStyle = '#fff';
		ctx.font = '12px sans-serif';
		ctx.textBaseline = 'top';
		ctx.fillText(text, x + 5, y + 5);
	}

	Game.prototype.loadResources = function(){
		for(var i = 0; i < this.tileData.length; i++){
			this.resources[i] = new Image();
			this.resources[i].src = this.tileData[i];
			this.resources[i].onload = function(){
				this.loaded++;
			}.bind(this);
		}
		
		for(var i in this.sprites){
			this.sprites[i].image.src = this.sprites[i].resource;
		}
	};
	
	Game.prototype.start = function(ctx){
		var t = this;
		
		var drawLoop = setInterval(function(){
			if(this.loaded == this.tileData.length){
				ctx.clearRect ( 0 , 0 , canvas.offsetWidth , canvas.offsetHeight );

				this.drawMap(ctx);
				
				for(var i in this.sprites){
					this.sprites[i].draw(ctx);
				}
				
				this.renderText(ctx, 140, 45, "Hello!");
			}
		}.bind(this), 1000/60);
		
		var animation = setInterval(function(){
			if(this.loaded == this.tileData.length){
				for(var i in this.sprites){
					this.sprites[i].update();
				}
			}
		}.bind(this), 100);
	};
	
	Game.prototype.sizes = {
		tileH : 25,
		tileW : 50,
		mapX : 150,
		mapY : 50
	};
	
	Game.prototype.mouseLocation = {
		x: null,
		y: null
	};
	
	Game.prototype.updateMousePosition = function(e){
		var x = e.pageX,
			y = e.pageY;
			
		this.mouseLocation.y = (2*(y-canvas.offsetTop-this.sizes.mapY)-x+canvas.offsetLeft+this.sizes.mapX)/2;
		this.mouseLocation.x = x+this.mouseLocation.y-this.sizes.mapX-25-canvas.offsetLeft;
		
		this.mouseLocation.y=Math.round(this.mouseLocation.y/25);
		this.mouseLocation.x=Math.round(this.mouseLocation.x/25);
	};
	
	Game.prototype.drawMouse = function(ctx, xpos, ypos){
		ctx.fillStyle = 'rgba(255, 255, 120, 0.7)';
		ctx.beginPath();
		ctx.moveTo(xpos, ypos+12.5);
		ctx.lineTo(xpos+25, ypos);
		ctx.lineTo(xpos+50, ypos+12.5);
		ctx.lineTo(xpos+25, ypos+25);
		ctx.fill();
	}
		
	Game.prototype.drawMap = function(ctx){
		for(var i = 0; i < this.map.length; i++){
			for(var j = 0; j < this.map[i].length; j++){
				var tile = this.map[i][j];
				
				var xpos = (i-j)*this.sizes.tileH + this.sizes.mapX;
				var ypos = (i+j)*this.sizes.tileH/2+ this.sizes.mapY;
				ctx.drawImage(this.resources[tile],xpos,ypos);
				
				if(i == this.mouseLocation.x && j == this.mouseLocation.y) this.drawMouse(ctx, xpos, ypos);
			}
		}
	};
	
	Function.prototype.bind = function( obj ) {
		var method = this;
		var oldargs = [].slice.call( arguments, 1 );
		return function () {
			var newargs = [].slice.call( arguments );
			return method.apply( obj, oldargs.concat( newargs ));
		};
	}

})();