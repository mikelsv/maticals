// Maticals GLSL Player
// Mikhail Senin - 2020
// http://senin.world

// Analogue Shadertoys.com

// Maticals Player
var MsPlayer = {
    // Data
    canvas: undefined,
    webgl : undefined,
    shaderProgram: undefined,

    Init(){
        var canvas = this.canvas = document.getElementById('msplayer');
        var webgl = this.webgl = canvas.getContext('webgl2');

        // Resize 1:2;
        if(canvas.width != canvas.clientWidth && canvas.height != canvas.clientHeight){
            if(canvas.clientWidth / canvas.clientHeight > .5 ){
                canvas.width = canvas.clientWidth;// / .5;
                canvas.height = canvas.clientWidth * .5;
                //console.log(">", canvas.width, canvas.height, canvas.clientWidth, canvas.clientHeight);
            } else {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientWidth * .5;
            }
        }

        window.addEventListener("resize", function(){
            MsPlayer.OnResize();
        });

        webgl.viewport(0, 0, canvas.width, canvas.height);
        webgl.clearColor(0.0, 0.0, 0.0, 1.);
        webgl.disable(webgl.DEPTH_TEST);

        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

        // Events
        this.canvas.addEventListener("click", this.onMouseClick, false);
        this.canvas.addEventListener("mousedown", this.onMouseDown, false);
        this.canvas.addEventListener("mouseup", this.onMouseUp, false);
        this.canvas.addEventListener("mousemove", this.onMouseMove, false);
        this.canvas.addEventListener("mousewheel", this.onMouseWheel, false);
        this.canvas.addEventListener("wheel", this.onMouseWheel, false);

        // Init Draw
        this.InitDraw();

        // Pulse
        this.Pulse();           
    },

    // On
    OnResize(){
        console.log("Resize!");
    },

    // Mouse actions
    mouse: {
        down: false,
        move: false,
        sel: undefined,
        x: 0,
        y: 0
    },

    onMouseClick(e){
        if(MsPlayer.shaderProgram){
            MsPlayer.SetBufferUniform(MsPlayer.webgl, MsPlayer.shaderProgram, "iMouse",
                [e.offsetX, MsPlayer.canvas.height - e.offsetY, 0, 0]
            );
        }

        e.stopPropagation();
    },

    onMouseDown(e){
        MsPlayer.mouse.down = true;
        MsPlayer.mouse.move = false;
        MsPlayer.mouse.x = e.offsetX;
        MsPlayer.mouse.y = e.offsetY;
        e.stopPropagation();
    },

    onMouseMove(e){
        e.stopPropagation();

        if(MsPlayer.mouse.down){
            if(MsPlayer.shaderProgram){
                MsPlayer.SetBufferUniform(MsPlayer.webgl, MsPlayer.shaderProgram, "iMouse",
                    [e.offsetX, MsPlayer.canvas.height - e.offsetY, 1, 1]
                );
            }
        }

        if(MsPlayer.mouse.down){
            MsPlayer.scale_ry += (e.offsetX - MsPlayer.mouse.x) / 2;
            MsPlayer.scale_rx -= (e.offsetY - MsPlayer.mouse.y) / 2;

            MsPlayer.mouse.x = e.offsetX;
            MsPlayer.mouse.y = e.offsetY;
        }
    },

    onMouseUp(e){
        MsPlayer.mouse.down = false;
        e.stopPropagation();
    },

    onMouseWheel(e){
        e.stopPropagation();

        var delta = e.deltaY || e.detail || e.wheelDelta;
        if(delta < 0)
            MsPlayer.scale = MsPlayer.scale * 1.2;

        if(delta > 0)
            MsPlayer.scale = MsPlayer.scale / 1.2;
    },

    // Draw
    Draw(ms){
        var gl = this.webgl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.0, 0.0, 0.0, 1.);

        var default_box = [0,0,1, 0,1,0,0, 0,0,1,0, 0,0,0,1];

        if(!this.shaderProgram)
            return ;
        
        var now = new Date();
        this.SetBufferUniform(gl, this.shaderProgram, "aTime", [(this.pulse.now - this.pulse.start) / 1000.]);
        this.SetBufferUniform(gl, this.shaderProgram, "aDate", [now.getFullYear(), now.getMonth(), now.getDate(), now.getSeconds()]);

        //gl.uniform1fv(gl.getUniformLocation(this.shaderProgram, "iTime"), [(this.pulse.now - this.pulse.start) / 1000.]);
        //gl.uniform2fv(gl.getUniformLocation(this.shaderProgram, "aResolution"), [this.canvas.width, this.canvas.height]);


        //gl.uniform1fv(gl.getUniformLocation(this.shaderProgram, "aTime"), [(this.pulse.now - this.pulse.start) / 1000.]);

        //this.bufferAttribute(gl, shaderProgram, "vertexPosition", [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);

        
        //console.log([(this.pulse.now - this.pulse.start) / 1000.]);
        //gl.uniform4fv(gl.getUniformLocation(this.shaderProgram, "position"), position);


        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    OnPulse(ms){
        this.Draw(ms);
    },

    // Code
    code : `
void mainImage(out vec4 fragColor, in vec2 fragCoord){
    fragColor = vec4(mod(iTime, 1.), 0., 0., 1.);
}`,

    SetCode(c){
        this.code = c;
    },

    values : {},

    SetValue(type, key, val){
        this.values[key] = {};
        this.values[key].type = type;
        this.values[key].val = val;
    },

    UpdateValue(key, val){
        if(this.shaderProgram){
            this.SetBufferUniform(this.webgl, this.shaderProgram, key, val);
        }
    },

    // Init Draw
    InitDraw(){
        var in_str_f = '';

        for(var i in this.values){
            in_str_f += 'uniform ' + this.values[i].type + ' ' + i + ';\r\n';
        }

        var vertCode = `#version 300 es
        precision mediump float;

        // Input
        in vec3 vertexPosition;
        uniform vec2 aResolution;
        uniform float aTime;
        uniform vec4 aDate;

        // Output
        out vec2 position;
        out vec2 iResolution;
        out float iTime;
        out vec4 iDate;
        //out vec2 iMouse;
        
        void main(){
            gl_Position = vec4(vertexPosition, 1.0);

            position = (vertexPosition.xy + 1.0) * 0.5;
            iResolution = aResolution;
            iTime = aTime;
            iDate = aDate;
        }
        `;

        var fragCode = `#version 300 es
        //#extension GL_ARB_shader_storage_block_object: enable
        precision mediump float;
        
        // Values
        in vec2 position;
        in vec2 iResolution;
        in float iTime;
        in vec4 iDate;
        uniform vec4 iMouse;

        // User
        ` + in_str_f + `
        //uniform vec2 rnr[];
        //buffer blockType;
        //in vec4 Color1[];       

        // Textures
        uniform sampler2D iChannel0;
        uniform sampler2D iChannel1;
        uniform sampler2D iChannel2;
        uniform sampler2D iChannel3;        

        // Result color
        out vec4 fragColor;

        void mainImage(out vec4 fragColor, in vec2 fragCoord);

        void main(){
            mainImage(fragColor, position * iResolution);
        }
        
        ` + this.code;

        this.shaderProgram = this.CreateShaderProgram(vertCode, fragCode);

        // Set data
        if(this.shaderProgram){
            //this.SetBufferAttribute(gl, shaderProgram, "vertexPosition", [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);
            this.SetBufferAttribute(this.webgl, this.shaderProgram, "vertexPosition", [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);
            this.SetBufferUniform(this.webgl, this.shaderProgram, "aResolution", [this.canvas.width, this.canvas.height]);
            this.SetBufferUniform(this.webgl, this.shaderProgram, "iMouse", [0, 0, 0, 0]);
        
        
            //gl.uniform2fv(gl.getUniformLocation(shaderProgram, "aResolution"), [this.canvas.width, this.canvas.height]);
        
            //gl.uniform2fv(gl.getUniformLocation(shaderProgram, "aResolution"), [this.canvas.width, this.canvas.height]);

            //console.log(vertCode, fragCode);

            for(var i in this.values){
                this.SetBufferUniform(this.webgl, this.shaderProgram, i + '', this.values[i].val);
           }
        }

        return ;
    },

    CreateShaderProgram(vertCode, fragCode){
        var gl = this.webgl;

        // Create a vertex shader object
        var vertShader = gl.createShader(gl.VERTEX_SHADER);

        // Attach vertex shader source code
        gl.shaderSource(vertShader, vertCode);

        // Compile the vertex shader
        gl.compileShader(vertShader);

        var err = this.GetShaderError(gl, vertShader);

        if(err){
            this.OnShaderError("VERTEX", vertCode, err);
            return ;
        }

        // Create fragment shader object
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

        // Attach fragment shader source code
        gl.shaderSource(fragShader, fragCode);

        // Compile the fragmentt shader
        gl.compileShader(fragShader);

        var err = this.GetShaderError(gl, fragShader);

        if(err){
            this.OnShaderError("FRAGMENT", fragCode, err);
            return ;
        }

        // Create a shader program object to store
        // the combined shader program
        var shaderProgram = gl.createProgram();

        // Attach a vertex shader
        gl.attachShader(shaderProgram, vertShader); 

        // Attach a fragment shader
        gl.attachShader(shaderProgram, fragShader);

        // Link both programs
        gl.linkProgram(shaderProgram);

        // Use the combined shader program object
        gl.useProgram(shaderProgram);

        return shaderProgram;
    },

    SetTexture(src, channel){
        if(this.shaderProgram === undefined)
            return;

        this.LoadTexture(this.webgl, "iChannel" + channel, src, channel);
    },

    textures : {},
    
    LoadTexture(gl, to, src, pos){
        MsPlayer.textures[pos] = {};

        var loader = new Image();
        loader.crossOrigin = "anonymous";
        loader.src = src; //"https://dl.dropboxusercontent.com/s/88u2uo8dxdmgzxo/world2.jpg?dl=0";
        loader.onload = function() {
            var w = MsPlayer.canvas.width;
            var h = MsPlayer.canvas.height;
    
            var gl = MsPlayer.webgl;

            var texture = gl.createTexture();            
    
            gl.activeTexture(gl.TEXTURE0 + pos);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loader);

            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);      
            
            //console.log("GLSL", to, pos);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
            gl.uniform1i(gl.getUniformLocation(MsPlayer.shaderProgram, to), pos);   
            
            MsPlayer.textures[pos].texture = texture;
            //MsPlayer.textures[pos].image = loader;
        }
    },
    
    GetShaderError(gl, shader){
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!compiled) {
            return gl.getShaderInfoLog(shader);
        } else
            return null;
    },

    OnShaderError(type, code, err){
        var line;
        var acode = code.split("\n");

        console.log("Shader '" + type + "' error!");

        while(err){
            [line, err] = MsvCore.PartLineA(err, "\n");

            // ERROR: 0:34: 'sa' : undeclared identifier
            var [t, line] = MsvCore.PartLineA(line, ":");
            var [w, line] = MsvCore.PartLineA(line, ":");
            var [h, line] = MsvCore.PartLineA(line, ":");

            w = Number(w);
            h = Number(h);

            var cline = acode.slice(h - 3, h + 3).join("\n");

            console.log("[" + t + ' ' + w + ':' + h + "]", line, "from:\n", cline);
        }
    },

    SetBufferAttribute(gl, program, attrib, data, size){
        var buffer, location;
        if(size == null) {
          size = 2;
        }
        location = gl.getAttribLocation(program, attrib);
        if(location == null)
            console.log("SetBufferAttribute is fail for", attrib, location);

        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(location);
        return gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    },

    SetBufferUniform(gl, program, attrib, value){
        var location = gl.getUniformLocation(program, attrib);
        if(location == null)
            console.log("SetBufferUniform is fail for", attrib, location);

        if (typeof value === "number") {
            value = [value];
        }

        switch (value.length) {
            case 1:
              gl.uniform1fv(location, value);
              break;
            case 2:
              gl.uniform2fv(location, value);
              break;
            case 3:
              gl.uniform3fv(location, value);
              break;
            case 4:
              gl.uniform4fv(location, value);
          }
        

        return location;
    },  

    // Full Screen
    RequestFullScreen(){
        var el = this.canvas, res = null;

        if (el.requestFullscreen) {
            res = el.requestFullscreen();
        } else if (el.webkeltRequestFullscreen) {
            res = el.webkeltRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            res = el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            res = el.msRequestFullscreen();
        }
    },

    // Pulse
    pulse: {
        now: Date.now(),
        start: Date.now()
    },

    Pulse(){
        var now = Date.now(), ms = now - MsPlayer.pulse.now;

        MsPlayer.pulse.now = now;

        //if(MsPlayer.movie.play)
        //    MsPlayer.PlayNextFrame(ms);
        MsPlayer.OnPulse(ms);
        
        setTimeout(MsPlayer.Pulse, 30);
    },

};

var MsvCore = {

    GetNumber2(val){
        if(typeof val == "number")
            return [val, val];

        var num = val.split(',');

        if(num.length == 0)
            return [0, 0, 0];

        if(num.length >= 2)
            return [Number(num[0]), Number(num[1])];

        return [Number(num[0]), Number(num[0])];
    },

    GetNumber3(val){
        if(typeof val == "number")
            return [val, val, val];

        //if(typeof val == "string")

        var num = val.split(',');

        if(num.length == 0)
            return [0, 0, 0];
        
        if(num.length >= 3)
            return [Number(num[0]), Number(num[1]), Number(num[2])];

        return [Number(num[0]), Number(num[0]), Number(num[0])];
    },

    PartLine(line, to, el){
        var index = line.indexOf(el);
        if(index < 0){
            to = '';
            return line;
        }

        to = line.substr(index + 1);
        return line.substr(0, index);
    },

    PartLineA(line, el){
        var index = line.indexOf(el);
        if(index < 0)
            return [line, ''];

        return [
            line.substr(0, index),
            line.substr(index + 1)
        ];
    },

    ColorHexToRgb(val){
        // rgb(255, 0, 0)
        // rgba(100, 100, 100, 0.5)
        var res = [];
        
        if(val.slice(0, 4) == "rgb(" ){
            res = val.substr(4, val.length - 5).split(',');
            res[3] = 1;
        }
        else if(val.slice(0, 4) == "rgba" )
            res = val.substr(5, val.length - 6).split(',');
        else
            res = [255, 255, 255, 1];

        return [
            Number(res[0]),
            Number(res[1]),
            Number(res[2]),
            Number(res[3])
        ];
    },

    strcmp(a, b){
        return (a<b?-1:(a>b?1:0));  
    }
}

var MsError = {
    OnError(msg, data){
        console.log("Matricals Error! ", msg, "Data: ", data);
    }
}


var code = `
// Pulse - Generate 1d pulse from formula.
// Research for Maticals http://maticals.senin.world/

// You can see how work any functions on 1d dimensional.
// Green - sin & sin box
// Blue - cos & cos box
// Orange - angle
// Red - any user function

// Next project: Pulse 2D - generate pulse in 2d: https://www.shadertoy.com/view/3dSczy
// Next project: Pulse 3D - generate pulse in 3d.

// Created: 2020-04-13
//
// Update: 2020-04-14.
// [!] Refactoring code.
// [+] box_sin & box_cos - sin and cos for box.
// [+] Angle function.

const float PULSE_TIME = 2.000; // Pulse one time = PI / 2
const float PULSE_TIMES = 10. * PULSE_TIME; // Pulse all times
const float PULSE_STEP = PULSE_TIMES / PULSE_TIME; // Pulse step

#define RGBC_GREEN vec4(19. / 255., 229. / 225., 19. / 225., 1.)
#define RGBC_BLUE vec4(47. / 255., 206. / 225., 208. / 225., 1.)
#define RGBC_RED vec4(222. / 255., 52. / 225., 81. / 225., 1.)
#define RGBC_PURPLE vec4(224. / 255., 15. / 225., 222. / 225., 1.)
#define RGBC_YELLOW vec4(148. / 255., 134. / 225., 78. / 225., 1.)
#define RGBC_ORANGE vec4(255. / 255., 165. / 225., 0. / 225., 1.)
#define PI 3.141592653589793

float box_sin(float angle);
float box_cos(float angle);
float ms_angle(float angle);

// Extensions.  <-------------- Comment / uncomment this defines for hide function -----
#define PULSE_FUNC_SIN		0		// Sin
//#define PULSE_FUNC_COS		1		// Cos
//#define PULSE_FUNC_BSIN		2		// Box Sin
#define PULSE_FUNC_BCOS		3		// Box Cos
#define PULSE_FUNC_ANGLE	4		// Angle
#define PULSE_FUNC_ANY		99		// Any for test

float pulseFuncSin(float val){
    return sin(val);
}

float pulseFuncCos(float val){
    return cos(val);
}

float pulseFuncBoxSin(float val){
    return box_sin(val);
}

float pulseFuncBoxCos(float val){
    return box_cos(val);
}

float pulseFuncAngle(float val){
    return ms_angle(val);
}

float pulseFuncAny(float val){ // <------- Use for test
    //return cos(val) * sin(val);
    //return cos(val) * cos(val) - .5;    
    //return cos(val) * ms_angle(val);
    return sin(val) * ms_angle(val) - .5;
    return sin(val) * sin(val) - .5; 
}


// Maticals core functions
float box_sin(float angle){
	if(angle < 0.)
    	angle = -1. * ( - PI * 2. - angle);
    angle = mod(angle, PI * 2.);
    
	if(angle <= PI * 0.75)
		return min(angle / (PI * 0.25), 1.);
 
	if(angle <= PI * 1.75)
		return max(-1., 1. - (angle - PI * 0.75) / (PI * 0.25));
    
    if(angle <= PI * 2.)
		return -1. + (angle - PI * 1.75) / (PI * 0.25);

	return 0.;
}

float box_cos(float angle){
    if(angle < 0.)
        angle = -1. * ( - PI * 2. - angle);
    angle = mod(angle, PI * 2.);

    if(angle <= PI * 0.25)
        return 1.;
    if(angle <= PI * 0.75)
        return 1. - (angle - PI * 0.25) / (PI * 0.25);
    if(angle <= PI * 1.25)
        return -1.;
    if(angle <= PI * 1.75)
        return -1. + (angle - (PI * 1.25)) / (PI * 0.25);
    if(angle <= PI * 2.)
        return 1.;

    return 0.;
}

float ms_angle(float angle){
    if(angle < 0.)
        angle = -1. * ( - PI * 2. - angle);
    angle = mod(angle, PI * 2.);

    if(angle <= PI * 0.5)
		return angle / (PI * 0.5);
    
	if(angle <= PI * 1.5)
		return 1. - (angle - PI * 0.5) / (PI * 0.5);
    
    if(angle <= PI * 2.)
		return -1. + (angle - PI * 1.5) / (PI * 0.5);

    return 0.;
}

// Call extension
#define PULSE_FUNC_CALL(call)	\
y = call(x * PI * PULSE_STEP);	\
py = call(coord.x * PI * PULSE_STEP);

// Not work :'(
#define PULSE_FUNC_CALL_D(def, call) \
#ifdef def	\
	case def: PULSE_FUNC_CALL(call); break; \
#endif



// Draw: pulse extension
vec4 pulseDrawExt(vec2 coord, vec2 pixel, float time, int type, vec4 color){
    float x = time / PULSE_TIMES, y;// = PULSE_FUNC(x * PI * PULSE_STEP);
    float px = coord.x, py; // = PULSE_FUNC(coord.x * PI * PULSE_STEP);
    
    switch(type){
#ifdef PULSE_FUNC_SIN
        case PULSE_FUNC_SIN: PULSE_FUNC_CALL(pulseFuncSin); break;
#endif
        
#ifdef PULSE_FUNC_COS       
        case PULSE_FUNC_COS: PULSE_FUNC_CALL(pulseFuncCos); break;
#endif
        
#ifdef PULSE_FUNC_BSIN
        case PULSE_FUNC_BSIN: PULSE_FUNC_CALL(pulseFuncBoxSin); break;
#endif
        
#ifdef PULSE_FUNC_BCOS       
        case PULSE_FUNC_BCOS: PULSE_FUNC_CALL(pulseFuncBoxCos); break;
#endif
        
#ifdef PULSE_FUNC_ANGLE
        case PULSE_FUNC_ANGLE: PULSE_FUNC_CALL(pulseFuncAngle); break;
#endif
        
#ifdef PULSE_FUNC_ANY
        case PULSE_FUNC_ANY: PULSE_FUNC_CALL(pulseFuncAny); break;      
#endif        
		// <-------------------- Add you function
    }
    
    // Point shadow
    //float px = coord.x, py = PULSE_FUNC(coord.x * PI * PULSE_STEP);
    if(abs(py - coord.y * 2. + 1.) < pixel.y * 5.)
        return color;
    
    // Point as circle
    if(sqrt(pow(abs(y - coord.y * 2. + 1.) / pixel.y * 1., 2.)
       + pow(abs(x - coord.x) / pixel.x * 2., 2.)) < 20.
      )
        return color;    
    
    return vec4(0, 0, 0, 1.0);    
    
    // Point as cube // deleted
    //float x = time / PULSE_TIMES, y = PULSE_FUNC(x * PI * PULSE_STEP);
    if(abs(y - coord.y * 2. + 1.) < pixel.y * 20.
       &&
       abs(x - coord.x) < pixel.x * 10.
      )
        return color;
}

// Draw interface: coord, pixel size, time
vec4 pulseDraw(vec2 coord, vec2 pixel, float time){
    time = mod(time, PULSE_TIMES);
    
    // Interface monitor: all yellow lines
    if((mod(coord.x, 1. / PULSE_STEP / 5.) <= pixel.x
       || mod(coord.x, 1. / PULSE_STEP) <= pixel.x * 2.
       || mod(coord.x, .5) <= pixel.x * 8.)
      &&
       (mod(coord.y, 1. / PULSE_STEP / 5.) <= pixel.y
       || mod(coord.y, 1. / PULSE_STEP) <= pixel.y * 2.
       || mod(coord.y, .5) <= pixel.y * 8.
      )      
	) return vec4(1, 1, 0, 1.0);
    
    // Draw pulse
    vec4 r = vec4(0, 0, 0, 1.0);
 
#ifdef PULSE_FUNC_SIN
    if(r == vec4(0, 0, 0, 1.0)) r = pulseDrawExt(coord, pixel, time, PULSE_FUNC_SIN, RGBC_GREEN);
#endif

#ifdef PULSE_FUNC_COS
    if(r == vec4(0, 0, 0, 1.0)) r = pulseDrawExt(coord, pixel, time, PULSE_FUNC_COS, RGBC_BLUE);
#endif
  
#ifdef PULSE_FUNC_BSIN
    if(r == vec4(0, 0, 0, 1.0)) r = pulseDrawExt(coord, pixel, time, PULSE_FUNC_BSIN, RGBC_GREEN);
#endif

#ifdef PULSE_FUNC_BCOS
    if(r == vec4(0, 0, 0, 1.0)) r = pulseDrawExt(coord, pixel, time, PULSE_FUNC_BCOS, RGBC_BLUE);
#endif
    
#ifdef PULSE_FUNC_ANGLE
    if(r == vec4(0, 0, 0, 1.0)) r = pulseDrawExt(coord, pixel, time, PULSE_FUNC_ANGLE, RGBC_ORANGE);
#endif
    
#ifdef PULSE_FUNC_ANY
    if(r == vec4(0, 0, 0, 1.0)) r = pulseDrawExt(coord, pixel, time, PULSE_FUNC_ANY, RGBC_RED);
#endif

   return r;
}

// Main
void mainImage( out vec4 fragColor, in vec2 fragCoord){
    
    vec2 coord = fragCoord/iResolution.xy;
    
    if(coord.y < .5){
        fragColor = vec4(0, 0, 0, 1.0);
        fragColor = pulseDraw(vec2(coord.x, coord.y * 2.),
        	vec2(1. / iResolution.x, 1. / iResolution.y * 2.), iTime);
        return ;
    }
    
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}
`;


var MsPlayerCodeFail = `
// Error! Code not loading.

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    fragColor = vec4(mod(iTime, 1.), 0., 0., 1.);
}`;