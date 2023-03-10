//
var svg = Snap("#paper");
var circ = svg.circle(2,2,2)
  .attr({fill:"rgba(86, 35, 204,.2)"})
  .pattern(0,0,16,16)
  .attr({patternTransform: "rotate(45)"});
svg.rect(0,0,'100%','100%').attr({fill: circ});

var svg = Snap("#paper");
var circ = svg.circle(3,3,3)
  .attr({fill:"rgba(142, 72, 228,.2)"})
  .pattern(0,0,8,8)
  .attr({patternTransform: "rotate(-45)"});
svg.rect(0,0,'100%','100%').attr({fill: circ});


//
var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		opts = {
			particles: 10,
			particleBaseSize: 40,
			particleAddedSize: 10,
			particleSizeSpeedMultiplier: .1,
			particleBaseRadiant: Math.PI / 2 - .04,
			particleAddedRadiant: .2,
			
			trails: 30,
			trailSizeBaseMultiplier: .6,
			trailSizeAddedMultiplier: .2,
			trailSizeSpeedMultiplier: .1,
			trailAddedBaseRadiant: -1,
			trailAddedAddedRadiant: 2,
			trailBaseLifeSpan: 50,
			trailAddedLifeSpan: 30
			
		},
		
		tau = Math.PI * 2,
		particles = [];



function Particle(){
	
	this.trails = [];
	
	this.reset();
}
Particle.prototype.reset = function(){
	
	this.size = opts.particleBaseSize + opts.particleAddedSize * Math.random();
	
	this.x = Math.random() * w;
	this.y = -this.size;
	
	var speed = this.size * opts.particleSizeSpeedMultiplier,
			rad = opts.particleBaseRadiant + opts.particleAddedRadiant * Math.random();
	
	this.vx = speed * Math.cos( rad );
	this.vy = speed * Math.sin( rad );
	
	this.rad = rad;
}
Particle.prototype.step = function(){
	
	if( this.trails.length < opts.trails && Math.random() < .1 )
		this.trails.push( new Trail( this ) );
	
	for( var i = 0; i < this.trails.length; ++i )
		this.trails[ i ].step();
	
	this.x += this.vx;
	this.y += this.vy;
	
	if( this.x < -this.size )
		this.x = w + this.size;
	else if( this.x > w + this.size )
		this.x = -this.size;
	
	if( this.y > h + this.size )
		this.reset();

	ctx.moveTo( this.x, this.y );
	ctx.arc( this.x, this.y, this.size, 0, tau );
}
function Trail( parent ){
	this.parent = parent;
	this.reset();
}
Trail.prototype.reset = function(){
	
	this.x = this.parent.x;
	this.y = this.parent.y;
	this.size = this.parent.size * ( opts.trailSizeBaseMultiplier + opts.trailSizeAddedMultiplier * Math.random() );
	
	var rad = this.parent.rad + opts.trailAddedBaseRadiant + opts.trailAddedAddedRadiant * Math.random(),
			speed = this.size * opts.trailSizeSpeedMultiplier;
	
	this.vx = speed * Math.atan( rad );
	this.vy = speed * Math.sin( rad );
	
	this.tick = 0;
	this.life = ( opts.trailBaseLifeSpan + opts.trailAddedLifeSpan * Math.random() ) |0;
}
Trail.prototype.step = function(){
	
	++this.tick;
	
	if( this.tick > this.life )
		return this.reset();
	
	this.x += this.vx;
	this.y += this.vy;
	
	ctx.moveTo( this.x, this.y )
	ctx.arc( this.x, this.y, ( 1 - ( this.tick / this.life ) ) * this.size, 0, tau );
			
}

function anim(){
	
	window.requestAnimationFrame( anim );

	ctx.fillStyle = 'hsla(0,100%,50%,.008)';
	ctx.fillRect( 0, 0, w, h );
	ctx.globalCompositeOperation = 'difference';
	
	ctx.fillStyle = 'hsla(0,100%,100%,.04';
	ctx.beginPath();
			ctx.globalCompositeOperation = 'xor';
	
	if( particles.length < opts.particles && Math.random() < .1 )
		particles.push( new Particle );
	
	for( var p = 0; p < particles.length; ++p )
		particles[ p ].step();
	
	ctx.fill();
		ctx.globalCompositeOperation = 'difference';
	
}
anim();

window.addEventListener( 'resize', function(){
	
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
})