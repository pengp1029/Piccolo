#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);
    highp float _x           = float(lut_tex_size.x);

    highp vec4 color         = subpassLoad(in_color).rgba;

    highp float lut_block_num = _x / _COLORS;
    highp float block_index = floor(color.z * lut_block_num);
    highp float v = color.y;
    highp float u = block_index * _COLORS + color.x * _COLORS;
    highp vec2 uv = vec2(u / _x, v);

    // highp float color_block_index = floor(color.z * (_COLORS - 1.0) * _COLORS); // [0, lut_tex_size.y - 1] * lut_tex_size.y
    // highp float color_horizontal_offset = floor(color.x * (_COLORS - 1.0));
    // highp float color_vertical = floor(color.y * (_COLORS - 1.0));

    // highp vec2 uv = vec2((color_block_index + color_horizontal_offset) / _x,  color_vertical / _COLORS) + center_offset;
    
    out_color = texture(color_grading_lut_texture_sampler, uv);

    // out_color = color;
}
