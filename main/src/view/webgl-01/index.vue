<script setup lang="ts">
import { ref, watch } from 'vue';

import fragmentShaderSource from './glsl/fragment-shader.glsl';
import vertexShaderSource from './glsl/vertex-shader.glsl';

const canvasRef = ref<HTMLCanvasElement>();

const gl = ref<WebGLRenderingContext>();

watch(
  () => canvasRef.value,
  (canvas) => {
    if (!canvas) {
      return;
    }
    const webGLContext: WebGLRenderingContext | null = canvas.getContext('webgl');
    if (webGLContext) {
      gl.value = webGLContext;
    }
  }
);

watch(
  () => gl.value,
  (gl) => {
    if (!gl || !canvasRef.value) {
      return;
    }

    /** 创建顶点着色器 */
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    /** 创建片元着色器 */
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) {
      return;
    }
    /** 创建着色器程序 */
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      return;
    }
    /**
     * 从着色器程序中找到`a_position`属性值的位置
     * 变量名无效或在顶点着色器中未定义，则`gl.getAttribLocation`返回`-1`
     */
    const positionAttributeLocation: GLint = gl.getAttribLocation(program, 'a_position');
    /**
     * 属性`a_position`从缓冲区中读取
     * 创建一个缓冲区，用于存储顶点数据
     */
    const positionBuffer: WebGLBuffer | null = gl.createBuffer();
    if (!positionBuffer) {
      return;
    }
    /**
     * 将缓冲区绑定到`gl.ARRAY_BUFFER`，这是一个WebGL上下文全局共享的常量，
     * 表示将顶点数据存储在顶点数组缓冲区。
     *
     * 出了`gl.ARRAY_BUFFER`还有：
     * - `gl.ELEMENT_BUFFER`：用于存储索引数据，以便绘制元素
     * - `gl.COPY_READ_BUFFER`：用于在WebGL上下文和WebBuffer之间传输数据
     * - `gl.COPY_WRITE_BUFFER`：用于在WebGL上下文和WebBuffer之间传输数据
     * - `gl.COPY_PACK_BUFFER`：用于读取像素数据
     * - `gl.COPY_UNPACK_BUFFER`： 用于将像素数据传输到WebGL上下文
     *
     * 伪代码：
     *
     * var ARRAY_BUFFER; // 全局定义
     *
     * ARRAY_BUFFER = positionBuffer; // gl.bindBuffer 赋值
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      // 点1
      0, 0,
      // 点2
      0, 0.5,
      // 点3
      0.5, 0,
    ];
    /**
     * 将 positions 数据存入`gl.ARRAY_BUFFER`中
     * `gl.STATIC_DRAW`：提示实现缓冲区对象将用于频繁的静态绘制，适用于模型顶点数据、纹理坐标数据等不需要每帧更新的数据
     * `gl.STREAM_DRAW`：提示实现缓冲区对象将用于频繁的写入和使用，适用于每帧都需要更新，但内容不变
     * `gl.DYNAMIC_DRAW`：提示实现缓冲区对象将用于频繁的写入和使用，但是数据会比较频繁的更改，适用于每帧都需要更新，且内容变化
     *
     * 伪代码：
     *
     * ARRAY_BUFFER.set(new Float32Array(positions), gl.STATIC_DRAW)
     */
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    resizeCanvasToDisplaySize(canvasRef.value);
    /** 设置视口，将视口左上角与画布左上角重合，视口覆盖整个画布 */
    /** gl.viewport 应该在每一帧都被调用一次 */
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    /** 设置清空颜色为黑色，透明度为0 */
    gl.clearColor(0, 0, 0, 0);
    /** 将画布填充为 COLOR_BUFFER_BIT 内容，即将整个画布填充为清空颜色，上面的颜色 */
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, 0);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }
);

/**
 * 创建着色器
 *
 * @param gl: WebGLRenderingContext
 * @param type: GLenum 着色器类型：顶点着色器`gl.VERTEX_SHADER` 和 片元着色器`gl.FRAGMENT_SHADER`
 * @param source: GLSL代码
 */
function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | undefined {
  /**
   * 创建着色器对象
   *
   * 着色器对象用于编写和运行GLSL着色器代码，包括：顶点着色器(vertex shader)和片元着色器(fragment shader)
   */
  const shader: WebGLShader | null = gl.createShader(type);
  if (!shader) {
    return;
  }
  /** 设置着色器内容，即GLSL代码 */
  gl.shaderSource(shader, source);
  /** 编译着色器 */
  gl.compileShader(shader);
  /** 获取着色器变异状态 */
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(`('=') ${gl.getShaderInfoLog(shader)}`);
  /** 清除编译失败着色器 */
  gl.deleteShader(shader);
}

/**
 * 创建着色程序
 *
 * @param gl: WebGLRenderingContext
 * @param vertexShader: WebGLShader 顶点着色器，可以由`createShader(...)`创建
 * @param fragmentShader: WebGLShader 片元着色器，可以由`createShader(...)`创建
 */
function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | undefined {
  /**
   * 创建WebGLProgram
   *
   * WebGLProgram封装了一个顶点着色器(vertex shader)和一个片元着色器(fragment shader)，用于在WebGL中组合和管理着色器
   *
   * 在WebGL中创建WebGLProgram在内存不足、GPU资源不足等条件下可能为`null`
   */
  const program: WebGLProgram | null = gl.createProgram();
  if (!program) {
    return;
  }
  /** 设置顶点着色器 */
  gl.attachShader(program, vertexShader);
  /** 设置片元着色器 */
  gl.attachShader(program, fragmentShader);
  /** 连接顶点着色器和片元着色器，生成最终的着色器程序 */
  gl.linkProgram(program);
  /** 获取着色器程序连接状态 */
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.error(`('=') ${gl.getProgramInfoLog(program)}`);
  gl.deleteProgram(program);
}

/** 调整画布 */
function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
  const displayWidth: number = canvas.clientWidth;
  const displayHeight: number = canvas.clientHeight;
  const needResize: boolean = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}
</script>

<template>
  <div>
    <h1>Webgl-01</h1>
    <div>
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped>
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
