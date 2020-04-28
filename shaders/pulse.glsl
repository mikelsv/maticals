// https://www.shadertoy.com/view/WdBcRG

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