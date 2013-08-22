"use strict";

var platforms = (function (spec) {
    var self = [];
    var position = 0;
    var defaultBounce = 17;
    var factor = 2;
    var bounceFactors = [1 / 3, 1 / 2, 1, 2, 3, 4];
    var groupWith;
    
    var createPlatform = function (x, y, type) {
        var platform = { width: 70, height: 20 };
        platform.isMoving = ~~(Math.random() * 2);
        platform.direction = ~~(Math.random() * 2) ? -1 : 1;
        platform.x = ~~x;
        platform.y = y;
        platform.type = type;
        platform.firstColor = type === 1 ? '#AADD00' : '#FF8C00';
        platform.secondColor = type === 1 ? '#698B22' : '#EEEE00';
      
        platform.onCollide = function (hero) {
            hero.fallStop();
            var index = factor;
            if (type===1) {
                index++;
            }
            hero.jump(defaultBounce * bounceFactors[index]);
        };
        return platform;
    };

    self.count = 7;

    self.bounce = function (bounce) {
        switch (true) {
            case /metal/i.test(bounce):
                factor = 0;
                break;
            case /wood/i.test(bounce):
                factor = 1;
                break;
            case /rubber/i.test(bounce):
                factor = 3;
                break;
            case /flubber/i.test(bounce):
                factor = 4;
                break;
            default:
                factor = 2;
        }
        
        _gaq.push(['_trackEvent','Adjust', 'Platforms', 'Bounce', bounce]);
    };

    self.reset = function () {
        position = 0;
        for (var j = 0; j < self.count; j++) {
            self[j] = createPlatform(
                0,
                position,
                ~~(Math.random() * 5) === 0 ? 1 : 0);
            self[j].x = Math.random() * (spec.width - self[j].width);

            if (position < spec.height - self[j].height) {
                position += ~~(spec.height / self.count);
            }
        }
    };

    self.draw = function () {
        var ctx = spec.context();
        for (var i = 0; i < this.count; i++) {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            var gradient = ctx.createRadialGradient(
                this[i].x + (this[i].width / 2),
                this[i].y + (this[i].height / 2),
                5,
                this[i].x + (this[i].width / 2),
                this[i].y + (this[i].height / 2),
                45);
            gradient.addColorStop(0, this[i].firstColor);
            gradient.addColorStop(1, this[i].secondColor);
            ctx.fillStyle = gradient;
            ctx.fillRect(
                this[i].x,
                this[i].y,
                this[i].width,
                this[i].height);
        }
    };

    self.grouping = function(closeGrouping) {
        if (this.closeGrouping !== closeGrouping) {
            _gaq.push(['_trackEvent', 'Adjust', 'Platforms', 'Grouping', closeGrouping]);
            this.closeGrouping = closeGrouping;
            self.changeGrouping(this.closeGrouping);
        }
    };

            self.changeGrouping = function(grouping) 
            {
                       
                function createCloseGrouping() {
            
                return {
                generateX: function (boardWidth, platform) {
                    var seed = Math.random();
                    var offset = platform.width * seed;
                    var direction = ~~(Math.random() * 2) ? -1 : 1;
                    var pos = platform.x + (direction * offset);
                    return pos;
                }
            };
        }
        
                function createRandomGrouping() {
				return {
                generateX: function(boardWidth, platform) {
                    return Math.random() * (boardWidth - platform.width);
                }
            };
        }
		
				function createHistogramGrouping(style)
				{
					return {
					generateX: function(boardWidth, platform){
						var rand = Math.random();
						if ( rand < .68) //68-95-99.7 rule
						{	
							if(style === "centered")
							var pos = ((boardWidth/3 + (Math.random()*(boardWidth/3))) - platform.width/2);
							
							if(style === "left")
							var pos = (((Math.random()*(boardWidth/3))) - platform.width/2);
							
							if(style === "right")
							var pos = ((2*boardWidth/3 + (Math.random()*(boardWidth/3))) - platform.width/2);
						
							if(style === "bimodal")
							{
								var side = ~~(Math.random() * 2) ? "left" : "right";
								
								if (side === "left")
								var pos = (((Math.random()*(boardWidth/3))) - platform.width/2);
								
								else
								var pos = ((2*boardWidth/3 + (Math.random()*(boardWidth/3))) - platform.width/2);
							}
						}
						if (rand < .95 && rand >= .68)
						{	
							if(style === "centered" || style === "bimodal")
							{
								//left or right side of the "histogram"?
								var side = ~~(Math.random() * 2) ? "left" : "right";
								if (side === "left")
									var pos = ((boardWidth/6 + (Math.random()*(boardWidth/6))) - platform.width/2) ;
								else
									var pos = ((2*boardWidth/3 + (Math.random()*(boardWidth/6))) - platform.width/2) ;
							}
							if(style=== "left" || style === "right")
							{
								var pos = ((boardWidth/3 + (Math.random()*(boardWidth/3))) - platform.width/2);
							}
						}
						if (rand >= .95)
						{
							if(style === "centered")
							{
								//left or right side of the "histogram"?
								var side = ~~(Math.random() * 2) ? "left" : "right";
								if (side === "left")
									var pos = (( (Math.random()*(boardWidth/6))) - platform.width/2) ;
								else
									var pos = ((5*boardWidth/6 + (Math.random()*(boardWidth/6))) - platform.width/2) ;
							}
							if (style === "left")
							{
								var pos = (( (Math.random()*(boardWidth/6))) - platform.width/2) ;
							}
							if (style === "right")
							{
								var pos = ((5*boardWidth/6 + (Math.random()*(boardWidth/6))) - platform.width/2) ;
							}
							
							if (style === "bimodal")
							{
								var pos = ((boardWidth/3 + (Math.random()*(boardWidth/3))) - platform.width/2);
							}
						}
						return pos;
					}
				};
				}
            switch (grouping) {
            case "anywhere":
                groupWith = createRandomGrouping();
                break;
            case "slightly-shifted":
                groupWith = createCloseGrouping();
                break;
            case "mostly-centered":
                groupWith = createHistogramGrouping("centered");
                break;
			case "mostly-on-left":
				groupWith = createHistogramGrouping("left");
                break;
			case "mostly-on-right":
				groupWith = createHistogramGrouping("right");
                break;
			case "mostly-on-left&right":
				groupWith = createHistogramGrouping("bimodal");
                break;
            default:
                groupWith = createRandomGrouping();
        }
        _gaq.push(['_trackEvent','Adjust', 'Platforms', 'Grouping', grouping]);
        return; 
            };  
	
	/*self.toggleGrouping = (function(grouping) {
        var toClose, toRandom, toggle;
        self.closeGrouping = false;
        
        function createCloseGrouping() {
            return {
                generateX: function (boardWidth, platform) {
                    var seed = Math.random();
                    var offset = platform.width * seed;
                    var direction = ~~(Math.random() * 2) ? -1 : 1;
                    var pos = platform.x + (direction * offset);
                    return pos;
                }
            };
        }
        

        function createRandomGrouping() {
            return {
                generateX: function(boardWidth, platform) {
                    return Math.random() * (boardWidth - platform.width);
                }
            };
        }

        toClose = function () {
            groupWith = createCloseGrouping();
            toggle = toRandom;
        };

        toRandom = function () {
            groupWith = createRandomGrouping();
            toggle = toClose;
        };

        toRandom();
        return toggle;
    })();*/

    self.move = function (canMove) {
        if (this.canMove !== canMove) {
            _gaq.push(['_trackEvent', 'Adjust', 'Platforms', 'CanMove', canMove]);
        }
        this.canMove = canMove;
    };

    self.update = function (deltaY) {
        if (this.count !== this.length) {
            _gaq.push(['_trackEvent', 'Adjust', 'Platforms', 'Count', this.count]);
            while (this.count !== this.length) {
                this.pop();
            }
            this.reset();
        }
        
        for (var i = 0; i < this.count; i++) {
            if (this[i].isMoving && this.canMove) {
                if (this[i].x < 0) {
                    this[i].direction = 1;
                } else if (this[i].x > spec.width - this[i].width) {
                    this[i].direction = -1;
                }
                this[i].x += this[i].direction * (i / 2) * ~~(points.value / 100);
            }

            this[i].y += deltaY;

            if (this[i].y > board.height) {
                this[i] = createPlatform(
                    groupWith.generateX(board.width, this[i]),
                    
                    this[i].y - board.height,
                    ~~(Math.random() * 5) == 0 ? 1 : 0);
            }
        }
    };

    self.reset();
    return self;
})(board);

var plt;
plt = new Tangle($('#platforms')[0], {
    initialize: function () {
        this.platformsBounce = "canvas";
        this.platformsCount = 7;
        this.platformsMove = false;
        this.platformsGrouping = "mostly-centered";
    },
    update: function () {
        platforms.bounce(this.platformsBounce);
        platforms.count = this.platformsCount;
        platforms.move(this.platformsMove);
        platforms.grouping(this.platformsGrouping);
    }
});