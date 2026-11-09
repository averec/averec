// "A Torre Que Entortou Antes de Ficar Pronta" (Teste 2, skill cartoon-2d): mundo 3D em three.js dentro do Remotion,
// personagens em cartões 2D, contorno preto no mundo (InkPass), desfoque de lente por plano, tone map neutro e grade.
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, getInputProps, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, EffectPass, RenderPass, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { Mundo } from "./mundo";
import { InkPass, noInkFallback } from "./kit/ink";
import { LensBlur } from "./kit/lensblur";
import { GradeEffect, GRADES, GRADE_STRENGTH, gradeFor } from "./kit/grade";
import { planoEm, TOTAL, FLASH_AT } from "./historia";

export const PISA_FRAMES = TOTAL;
const fwd = new THREE.Vector3(), alvo = new THREE.Vector3();

const Cena: React.FC = () => {
  const q = useCurrentFrame();
  const { camera, scene, gl, size } = useThree();
  const mundo = useMemo(() => new Mundo(), []);
  const fx = useMemo(() => ({
    ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
    lens: new LensBlur({ maxCoC: 24, nearScale: 1.2 }),
    tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
    grade: new GradeEffect(GRADES.day, GRADE_STRENGTH.day),
  }), [camera, scene]);
  useEffect(() => () => fx.ink.dispose(), [fx]);
  const semPost = (getInputProps() as { semPost?: boolean }).semPost;
  // pós-processamento montado à mão (o <EffectComposer> do R3F não desenha no render do Remotion)
  const composer = useMemo(() => {
    const c = new EffectComposer(gl, { frameBufferType: THREE.HalfFloatType, multisampling: 4 });
    c.addPass(new RenderPass(scene, camera));
    c.addPass(fx.ink);
    c.addPass(new EffectPass(camera, fx.lens.pre));
    c.addPass(new EffectPass(camera, fx.lens.main));
    c.addPass(new EffectPass(camera, fx.tone, fx.grade));
    return c;
  }, [gl, scene, camera, fx]);
  useEffect(() => { composer.setSize(size.width, size.height); }, [composer, size]);
  useFrame(() => { if (!semPost) composer.render(); else gl.render(scene, camera); }, 1);
  const cam = camera as THREE.PerspectiveCamera, p = planoEm(q);
  mundo.update(p, q, cam, scene);
  noInkFallback(mundo.root);
  const c = p.cam((q - p.a) / Math.max(1, p.b - p.a));
  cam.getWorldDirection(fwd); alvo.set(...c.look);
  fx.lens.focus = Math.max(0.3, alvo.sub(cam.position).dot(fwd)); fx.lens.cInf = p.dof;
  gradeFor(fx.grade, p.luz === "golden" ? "golden" : "day");
  return (
    <>
      <primitive object={mundo.root} dispose={null} />

    </>
  );
};

export const PisaShort: React.FC<{ audio?: string }> = ({ audio }) => {
  const q = useCurrentFrame();
  const flash = q >= FLASH_AT && q < FLASH_AT + 6 ? [1, 0.85, 0.65, 0.45, 0.25, 0.1][q - FLASH_AT] : 0;
  return (
    <AbsoluteFill style={{ background: "#cfe3f2" }}>
      <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: false, stencil: false, toneMappingExposure: 1.0, preserveDrawingBuffer: true }} camera={{ fov: 40, near: 0.2, far: 1500 }}>
        <Cena />
      </ThreeCanvas>
      {flash > 0 && <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} />}
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
