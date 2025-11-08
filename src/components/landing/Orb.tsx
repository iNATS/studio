
'use client';

import React, { useEffect, useRef } from 'react';
import {
  Renderer,
  Camera,
  Transform,
  Program,
  Mesh,
  Sphere,
  Color,
  Vec2,
  Vec3,
} from 'ogl';

const vertex = `
  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = `
  precision highp float;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uRotate;

  float aastep(float threshold, float value) {
    float afwidth = fwidth(value) * 0.5;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
  }

  void main() {
    vec3 normal = vNormal;
    float fresnel = 1.0 - dot(normal, vec3(0, 0, 1));
    float h = uHover * 0.5 * (1.0 + sin(uTime * 2.0));
    float ring = aastep(0.4, 1.0 - fresnel) * aastep(0.5, 1.0 - fresnel);
    vec3 color = uColor + vec3(h) + vec3(ring * 0.3);
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface OrbProps {
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  hue?: number;
  forceHoverState?: boolean;
}

const Orb: React.FC<OrbProps> = ({
  hoverIntensity = 0.5,
  rotateOnHover = true,
  hue = 0,
  forceHoverState = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    const gl = renderer.gl;
    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, 5);

    const scene = new Transform();
    const geometry = new Sphere(gl, { radius: 1, widthSegments: 64, heightSegments: 64 });
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color().setHSL(hue, 0.8, 0.6) },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uHover: { value: 0 },
        uRotate: { value: rotateOnHover ? 1 : 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    const handleResize = () => {
      renderer.setSize(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    window.addEventListener('resize', handleResize, false);
    handleResize();

    const mouse = new Vec2(0.5, 0.5);
    let hover = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.set(e.clientX / gl.canvas.width, 1 - e.clientY / gl.canvas.height);
    };

    if (!forceHoverState) {
        window.addEventListener('mousemove', handleMouseMove, false);
    }
    

    const animate = (t: number) => {
      requestAnimationFrame(animate);
      
      program.uniforms.uTime.value = t * 0.001;

      if (forceHoverState) {
        hover = Math.min(1.0, hover + 0.05);
      } else {
        const dist = mouse.distance(new Vec2(0.5, 0.5));
        const targetHover = dist < 0.2 ? 1 : 0;
        hover += (targetHover - hover) * 0.1;
      }
      program.uniforms.uHover.value = hover * hoverIntensity;

      if(rotateOnHover) {
          mesh.rotation.y = (mouse.x - 0.5) * 0.5;
          mesh.rotation.x = -(mouse.y - 0.5) * 0.5;
      }

      renderer.render({ scene, camera });
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (!forceHoverState) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default Orb;
