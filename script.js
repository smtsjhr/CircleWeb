var record_animation = false;
var name = "image_"
var total_frames = 300;
var frame = 0;
var loop = 0;
var total_time = 4*Math.PI;
var rate = total_time/total_frames;


var enable_interaction = true;

var t = 0;
var t_rate = .02;

var r = .05;
var f = 0.5*r;
var f_base = 1-.75*r**2;
var f_amp = 5*(1-r)**4 + .25*r**4
var f_rate = -.5;

var g = 10;
var s = 50;


var stop_animation = false;
var fps, fpsInterval, startTime, now, then, elapsed;

var get_mouse_pos = false;
var get_touch_pos = false;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


startAnimating(25);


function draw() {

    W = canvas.width = 300; //window.innerWidth;
    H = canvas.height = 300; //window.innerHeight;
    
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, W, H);

    for(j = 0; j<400; j++){
        let i = (j - j%2)/2;
        let a = 2.4*i;      
        let k = 1.025**(i-110)
        let l = 0+1*(f_base+f_amp*Math.cos(t*f_rate+f*i));
        let c = (j+1)%2*255;
        ctx.fillStyle = `rgba(${c},${c},${c}, ${l})`;
        ctx.beginPath();
        ctx.arc(W/2 + 150*Math.cos(a)*k,
                H/2 + 150*Math.sin(a)*k,
                k*(s - j%2*3 - g*Math.sin(t + i/10)),
                0, 2*Math.PI)
        ctx.fill()
    }

    
    //t += t_rate;
  
  
    if(enable_interaction) {
      
        canvas.addEventListener('mousedown', e => {
        get_mouse_pos = true;
        getMousePosition(canvas, e)
        });
          
        canvas.addEventListener('mouseup', e => {
        get_mouse_pos = false;
        });
      
        canvas.addEventListener('mousemove', function(e) {
          if(get_mouse_pos) {
            getMousePosition(canvas, e)
          }
        })
        
        canvas.addEventListener('touchstart', function(e) {
            getTouchPosition(canvas,e);
            event.preventDefault();
        }, false);
          
        canvas.addEventListener('touchend', function(e) {
     
        }, false);
          
        canvas.addEventListener('touchmove', function(e) {
            getTouchPosition(canvas,e);
            event.preventDefault();
        }, false);
    }
        
}


function getMousePosition(canvas, event) {
    x = (event.clientX/canvas.width - 0.5);
    y = 1*(event.clientY/canvas.height - 0.5);
    r = Math.sqrt(x*x+y*y) + 0.001;
    f = .5*r;
    f_base = 1-.75*r**2
    f_amp = 5*(1-r)**4 + .25*r**4;
}

function getTouchPosition(canvas, event) {
    var touch = event.touches[0];
    x = (touch.clientX/canvas.width - 0.5);
    y = 1*(touch.clientY/canvas.height - 0.5);
    r = Math.sqrt(x*x+y*y) + 0.001;
    f = .5*r;
    f_base = 1-.75*r**2
    f_amp = 5*(1-r)**4 + .25*r**4;
}


function startAnimating(fps) {
    
    fpsInterval = 1000/fps;
    then = window.performance.now();
    startTime = then;
    
    animate();
 }
 
 function animate(newtime) {
  
     if (stop_animation) {
         return;
     }
 
     requestAnimationFrame(animate);
 
     now = newtime;
     elapsed = now - then;
 
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
     
        draw();
         
        frame = (frame+1)%total_frames;
        time = rate*frame;
        t = time;

        if(record_animation) {

            if (loop === 1) { 
                let frame_number = frame.toString().padStart(total_frames.toString().length, '0');
                let filename = name+frame_number+'.png'
                
                dataURL = canvas.toDataURL();
                var element = document.createElement('a');
                element.setAttribute('href', dataURL);
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }

            if (frame + 1 === total_frames) {
                loop += 1;
            }

            if (loop === 2) { stop_animation = true }
        }
    }
 }