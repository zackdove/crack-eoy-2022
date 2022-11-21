export default function getDistortionShaderDefinition() {
  return {

    uniforms: {
      'tDiffuse': { value: null },
      'distortion': { value: null }, // radial distortion coeff 0
      'principalPoint': { value: null }, // principal point
      'focalLength': { value: null },  // focal length
      'skew': { value: 0 }, // skew coeff
    },
    vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,

    fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform vec2 distortion;
        uniform vec2 principalPoint; 
        uniform vec2 focalLength; 
        uniform float skew;
        varying vec2 vUv;
        void main() {
          // vUv.st is in range 0..1
          // Xn is position in range -1..1
          vec2 Xn = 2. * ( vUv.st - .5 ); // -1..1
          vec3 Xd = vec3(( 1. + distortion * dot( Xn, Xn ) ) * Xn, 1.); // distorted 
          mat3 KK = mat3(
            vec3(focalLength.x, 0., 0.),
            vec3(skew * focalLength.x, focalLength.y, 0.),
            vec3(principalPoint.x, principalPoint.y, 1.)
          );
          vec2 Xp = ( KK * Xd ).xy * .5 + .5; // projected; into 0..1 
          if ( Xp.x >= 0. && Xp.x <= 1. && Xp.y >= 0. && Xp.y <= 1. ) {
            gl_FragColor = texture2D( tDiffuse, Xp );
          }
        }
      `

  };
}