// https://www.shadertoy.com/view/3s2cRc

// Maticals Font - GLSL font project.
// Research for Maticals http://maticals.senin.world/

// Very simple font.
// Today '0 - 9' and '.' sumbols only.

// Created: 2020-04-16
//
// [+] Add sumbols 0 - 9 and '.'.
// [!] Bug: first element in MaticalFontData structure draw badly. What that?
// [!] Problem: Very hard, some data in MaticalFontData.
//
// Updated: 2020-04-17
// [+] Defines for char = _c + Char = int value
// [+] Create ASCII table 
// [+] Add DrawString();
// [+] Add special sumbols. ASCII 32 - 47.


// [~] Project in process ...

// [@] Need add more sumbols and refactory font data structure.


#define RGBC_GREEN vec4(19. / 255., 229. / 225., 19. / 225., 1.)
#define RGBC_BLUE vec4(47. / 255., 206. / 225., 208. / 225., 1.)
#define RGBC_RED vec4(222. / 255., 52. / 225., 81. / 225., 1.)
#define RGBC_PURPLE vec4(224. / 255., 15. / 225., 222. / 225., 1.)
#define RGBC_YELLOW vec4(148. / 255., 134. / 225., 78. / 225., 1.)
#define RGBC_ORANGE vec4(255. / 255., 165. / 225., 0. / 225., 1.)


// Font Char Defines //
// https://theasciicode.com.ar/ascii-printable-characters/exclamation-mark-ascii-code-33.html

#define _c_sp 32
#define _c_em 33
#define _c_dq 34
#define _c_ns 35
#define _c_ds 36
#define _c_ps 37
#define _c_ap 38
#define _c_sq 39
#define _c_or 40
#define _c_cr 41


#define _c0	48
#define _c1	49
#define _c2	50
#define _c3	51
#define _c4	52
#define _c5	53
#define _c6	54
#define _c7	55
#define _c8	56
#define _c9	57

// Font Data ASCII //

// Sumbol position
// pos -= 32;
// return MaticalFontAscii[pos] + MaticalFontAscii2[pos / 16];

// ASCII position, from 32 to 128
int MaticalFontAscii[] = int[](
0, 2, 5, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 5, 7, 11, 16, 20, 24, 30, 33, 39, 0, 0, 0, 0, 0, 0
);

// ASCII box position
int MaticalFontAscii2[] = int[](
0, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
);

// Font Data Draw //
#define MF_Null	0., 0., 0., 0., 0., 0.

// from.x, from.y, to.x to.y, special, bold 

float MaticalFontData_New[] = float[](
	// sp space ( Space )
    -1., -1., -1., -1., 0., 0.,
    MF_Null,
    // em ! ( Exclamation mark )
	.45, .1, .55, .1, 0., 3.,
    .5, .3, .5, .9, 0., 3.,
    MF_Null,
    // dq " ( Double quotes )
	.3, .1, .3, .2, 0., 3.,
    .6, .1, .6, .2, 0., 3.,
    MF_Null,
    // ns # ( Number sign )
    .2, .1, .5, .9, 0., 0.,
	.5, .1, .8, .9, 0., 0.,
    .1, .3, .9, .3, 0., 0.,
    .1, .6, .9, .6, 0., 0.,    
    MF_Null,
    // ds $ ( Dollar sign )
    .5, .1, .5, .9, 0., 0.,
    .1, .1, .9, .3, 0., 0.,
    .1, .6, .9, .3, 0., 0.,
    .1, .6, .9, .9, 0., 0.,
    MF_Null,
    // ps % ( Percent sign )
    .1, .1, .9, .9, 0., 0.,
    .3, .6, .3, .6, 0., 3.,
    .6, .3, .6, .3, 0., 3.,
    MF_Null,
    // & ( Ampersand )
    .9, .1, .1, .9, 0., 0.,
    .1, .9, .9, .9, 0., 0.,
    .1, .1, .9, .9, 0., 0.,
    .1, .1, .9, .3, 0., 0.,
    MF_Null,
    // sq ' ( Single quote )
    .3, .1, .3, .2, 0., 3.,
    MF_Null,
    // or ( ( Open round )
    .6, .1, .3, .5, 0., 0.,    
    .6, .9, .3, .5, 0., 0.,    
    MF_Null,
    // cr ) ( Close round )
    .6, .1, .3, .5, 0., 0.,
    .6, .9, .3, .5, 0., 0.,
	MF_Null,
    
    
/*
ASCII code 42 = * ( Asterisk )
ASCII code 43 = + ( Plus sign )
ASCII code 44 = , ( Comma )
ASCII code 45 = - ( Hyphen , minus sign )
ASCII code 46 = . ( Dot, full stop )
ASCII code 47 = / ( Slash , forward slash , fraction bar , division slash )    
*/    
    
    // dt Dot
    .3, .1, .7, .1, 0., 0.,
    .2, .2, .8, .2, 0., 0.,
    .3, .3, .7, .3, 0., 0.,
    MF_Null,
    
    // Numbers. ASCII 48.
    // 0
    .1, .1, .9, .1, 0., 0.,
    .1, .9, .9, .9, 0., 0.,
    .1, .1, .1, .9, 0., 0.,
    .9, .1, .9, .9, 0., 0.,      
    MF_Null,
    // 1
    .51, .1, .5, .9, 0., 0.,
    MF_Null,
    // 2
    .1, .1, .9, .1, 0., 0.,
    .1, .1, .9, .9, 0., 0.,
    .1, .9, .9, .9, 0., 0.,
    MF_Null,
	// 3
    .1, .1, .9, .1, 0., 0.,
    .1, .5, .9, .5, 0., 0.,
    .1, .9, .9, .9, 0., 0.,
    .9, .1, .9, .9, 0., 0.,
    MF_Null,
	// 4
    .1, .9, .1, .5, 0., 0.,
    .1, .5, .9, .5, 0., 0.,
	.9, .1, .9, .9, 0., 0.,
	MF_Null,
    // 5
    .1, .1, .9, .1, 0., 0.,
    .9, .1, .1, .9, 0., 0.,
    .1, .9, .9, .9, 0., 0.,
	MF_Null,
    // 6
	.1, .1, .9, .1, 0., 0., 
    .1, .5, .9, .5, 0., 0.,
    .1, .1, .1, .5, 0., 0.,
    .9, .1, .9, .5, 0., 0.,    
    .1, .5, .9, .9, 0., 0.,
    MF_Null,
	// 7
    .1, .1, .9, .9, 0., 0.,
	.1, .9, .9, .9, 0., 0.,
    MF_Null,
    // 8
    .1, .1, .9, .1, 0., 0.,
    .1, .5, .9, .5, 0., 0.,
    .1, .9, .9, .9, 0., 0.,
    .1, .1, .1, .9, 0., 0.,
    .9, .1, .9, .9, 0., 0.,
	MF_Null,
    // 9
    .1, .1, .9, .5, 0., 0.,    
    .1, .5, .9, .5, 0., 0.,
    .1, .9, .9, .9, 0., 0.,
    .1, .5, .1, .9, 0., 0.,
    .9, .5, .9, .9, 0., 0.,
    MF_Null,
    
    
    
    MF_Null
);

int MF_GetFontChrPos(int chr){
	if(chr < 32 || chr > 127)
        return 0;
    
    chr -= 32;

    return (MaticalFontAscii[chr] + MaticalFontAscii2[chr / 16]) * 6;
}


// Draw Float //
struct MaticalFont{
    vec4 rect; // rectangle
	float val; // value
    float len; // value len
    float dec; // decimal size
    float pw; // 10 ^ pw
    float weight; // weight
    vec4 color; // color
    vec4 pcolor; // pixel color
};
    
MaticalFont MF_DrawFloatNew(float val, vec4 rect, vec4 color, float dec){
    MaticalFont ret;
    
    // Set data
    ret.val = val;
    ret.rect = rect;
    ret.color = color;
    ret.dec = dec;
    ret.weight = 1.;
    ret.pcolor = vec4(0., 0., 0., 1.);
    
    // Count len
    ret.len = 1. + dec + (dec > 0. ? 1. : 0.);
    ret.pw = 0.;
    float i = floor(val);
    
    while(i >= 10.){
        i /= 10.;
        
        ret.len ++;
        ret.pw ++;
    }
    
    return ret;
}

MaticalFont MF_DrawStringNew(vec4 rect, vec4 color){
    MaticalFont ret;
    
    // Set data
    ret.val = 0.;
    ret.rect = rect;
    ret.color = color;
    ret.dec = 0.;
    ret.weight = 1.;
    ret.pcolor = vec4(0., 0., 0., 1.);
    
    // String pos
    ret.len = 0.;
    
    return ret;
}

#define MaticalFontFloat MaticalFont

    
// InRect
bool MF_InRect(vec2 coord, vec4 rect, float len){
    return rect.x <= coord.x && rect.y <= coord.y 
        && rect.x + rect.z * len > coord.x && rect.y + rect.w > coord.y;
}

bool MF_InRectStr(vec2 coord, vec4 rect, float len){
    len -= 1.;
    return rect.x <= coord.x && rect.y <= coord.y 
        && rect.x + rect.z * (len + 0.) <= coord.x
        && rect.x + rect.z * (len + 1.) > coord.x && rect.y + rect.w > coord.y;
}


vec2 MF_GetRect(vec2 coord, vec4 rect){
    return vec2((coord.x - rect.x) / rect.z, (coord.y - rect.y) / rect.w);
}

float g_pos = 0.;

// Draw char
vec4 MF_DrawChar(vec2 coord, out MaticalFontFloat font, int chr){
    int pos = MF_GetFontChrPos(chr);
    
    while(1 == 1){
        if(MaticalFontData_New[pos + 0] == 0. && MaticalFontData_New[pos + 1] == 0.)
            break;
        
        vec2 a = vec2(MaticalFontData_New[pos + 0], MaticalFontData_New[pos + 1]),
            b = vec2(MaticalFontData_New[pos + 2], MaticalFontData_New[pos + 3]);
        
        float wg = MaticalFontData_New[pos + 5] == 0. ? 1. : MaticalFontData_New[pos + 5];
        
        vec3 tr = vec3(length(a - coord), length(b - coord), length(a - b));
        
        float bs = sqrt(tr.x * tr.y * (tr.x + tr.y + tr.z) * (tr.x + tr.y - tr.z)) / (tr.x + tr.y);
        if(bs < .02 * font.weight * wg){
            font.pcolor = font.color;
        	return font.color;
        }
    
        pos += 6;
    }
    
	return vec4(0., 0., 0., 1.0);    
}

// Draw float
vec4 MF_DrawFloat(vec2 coord, out MaticalFontFloat font){
    if(!MF_InRect(coord, font.rect, font.len))
        return vec4(0., 0., 0., 1.0);
    
    coord = MF_GetRect(coord, font.rect);
    if(coord.x > 30.)
		return vec4(1., 0., 0., 1.0);
    
    float pw = pow(10., font.pw - floor(coord.x) + 1. );
    int val = _c0 + int(mod(font.val, pw) / (pw / 10.));
    
    // Point
    if(font.dec > 0. && coord.x >= font.len - font.dec - 1.){
        if(coord.x <= font.len - font.dec){
    		coord.x = mod(coord.x, 1.);
        	val = _c_ns;
        } else{
        	coord.x -= font.len - font.dec;
            pw = pow(10., floor(coord.x));
            val = _c0 + int(mod(font.val * pw, 1.) * 10.);
        }
    }
    
    coord.x -= floor(coord.x);
    
    return MF_DrawChar(coord, font, val);
}

// Draw string
vec4 MF_DrawString(vec2 coord, out MaticalFontFloat font, int chr){
    font.len ++;
    
	if(!MF_InRectStr(coord, font.rect, font.len))
		return vec4(0., 0., 0., 1.0);
    
    coord = MF_GetRect(coord, font.rect);    
    coord.x -= floor(coord.x);

    // Draw
    return MF_DrawChar(coord, font, chr);
}

#define MFD_DRAWSTRING(chr) if((fcol = MF_DrawString(coord, font, chr)) != vec4(0., 0., 0., 1.0)) return fcol;

vec4 MF_DrawString(vec2 coord, out MaticalFontFloat font, int chr1, int chr2){
    vec4 fcol; MFD_DRAWSTRING(chr1); MFD_DRAWSTRING(chr2); return fcol;
}

vec4 MF_DrawString(vec2 coord, out MaticalFontFloat font, int chr1, int chr2, int chr3){
    vec4 fcol; MFD_DRAWSTRING(chr1); MFD_DRAWSTRING(chr2); MFD_DRAWSTRING(chr3); return fcol;
}

vec4 MF_DrawString(vec2 coord, out MaticalFontFloat font, int chr1, int chr2, int chr3, int chr4){
    vec4 fcol; MFD_DRAWSTRING(chr1); MFD_DRAWSTRING(chr2); MFD_DRAWSTRING(chr3); MFD_DRAWSTRING(chr4); return fcol;
}

vec4 MF_DrawString(vec2 coord, out MaticalFontFloat font, int chr1, int chr2, int chr3, int chr4, int chr5){
    vec4 fcol; MFD_DRAWSTRING(chr1); MFD_DRAWSTRING(chr2); MFD_DRAWSTRING(chr3); MFD_DRAWSTRING(chr4); MFD_DRAWSTRING(chr5); return fcol;
}

vec4 MF_DrawString(vec2 coord, out MaticalFontFloat font, int chr1, int chr2, int chr3, int chr4, int chr5, int chr6){
    vec4 fcol; MFD_DRAWSTRING(chr1); MFD_DRAWSTRING(chr2); MFD_DRAWSTRING(chr3); MFD_DRAWSTRING(chr4); MFD_DRAWSTRING(chr5);
    MFD_DRAWSTRING(chr6); return fcol;
}

// Draw End
#define MF_DrawEnd if(font.pcolor != vec4(0., 0., 0., 1.0)){ fragColor = font.pcolor; return ; }

// Main
void mainImage( out vec4 fragColor, in vec2 fragCoord){
    
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Font
    MaticalFontFloat font;
    vec4 ret, fcol;
   
    // Configure.
    // MF_DrawFloatNew() set float value, rectangle to draw, color, digits count. Rectangle for first sumbol!
    // MF_DrawStringNew() set rectangle to draw, color. Rectangle for first sumbol!
    
    // Draw
    // MF_DrawFloat() set normalized pixel, font.
    // MF_DrawString() set normalized pixel, font, chars ...
    
    // End
    // MF_DrawEnd; test result and set to fragColor.

    
     // Draw numbers
    font = MF_DrawStringNew(vec4(.0, .8, .1, .2), RGBC_RED);
    fcol = MF_DrawString(uv, font, _c0, _c1, _c2, _c3, _c4);
    fcol = MF_DrawString(uv, font, _c5, _c6, _c7, _c8, _c9);
    MF_DrawEnd;   
    
    // Draw Hello World!
    font = MF_DrawStringNew(vec4(.0, .5, .1, .2), RGBC_RED);
    //fcol = MF_DrawString(uv, font, _H, _e, _l, _l, _o, _sp);
    fcol = MF_DrawString(uv, font, _c5, _c6, _c7, _c8, _c9);
    MF_DrawEnd;
    

    
    // Draw Bold
    font = MF_DrawFloatNew(g_pos, vec4(.01, .2, .05, .1), RGBC_RED, 0.);
    font.weight = 2.;
    ret = MF_DrawFloat(uv, font);
    MF_DrawEnd;
    
    // Draw this year, date, month, day
    font = MF_DrawFloatNew(iDate.x, vec4(.01, .01, .05, .1), RGBC_RED, 0.);
    ret = MF_DrawFloat(uv, font);
   	MF_DrawEnd;
    
    font = MF_DrawFloatNew(iDate.y, vec4(.3, .01, .05, .1), RGBC_RED, 0.);
    ret = MF_DrawFloat(uv, font);
    MF_DrawEnd;
    
    font = MF_DrawFloatNew(iDate.z, vec4(.4, .01, .05, .1), RGBC_RED, 0.);
    ret = MF_DrawFloat(uv, font);   
    MF_DrawEnd;
    
    // Draw time
    font = MF_DrawFloatNew(iTime, vec4(.6, .01, .05, .1), RGBC_RED, 2.);
    ret = MF_DrawFloat(uv, font);
    MF_DrawEnd;

    
    // Output to screen
    fragColor = vec4(col,1.0);
}