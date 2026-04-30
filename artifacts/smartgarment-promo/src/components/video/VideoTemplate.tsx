import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS: Record<string, number> = {
  hook: 5000,
  dashboard: 8000,
  floor: 8000,
  quality: 8000,
  efficiency: 8000,
  outro: 7000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hook: Scene1,
  dashboard: Scene2,
  floor: Scene3,
  quality: Scene4,
  efficiency: Scene5,
  outro: Scene6,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-dark)', fontFamily: 'var(--font-mono)' }}
    >
      {/* Background Video (persistent) */}
      <video
        src={`${import.meta.env.BASE_URL}videos/factory-floor.mp4`}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen"
      />

      {/* Grid Texture Overlay (persistent) */}
      <img
        src={`${import.meta.env.BASE_URL}images/tech-grid.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
        alt=""
      />

      {/* Drifting ambient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'var(--color-primary)', opacity: 0.15 }}
        animate={{
          x: ['0%', '10%', '-5%', '0%'],
          y: ['0%', '-10%', '10%', '0%'],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'var(--color-secondary)', opacity: 0.15 }}
        animate={{
          x: ['0%', '-15%', '10%', '0%'],
          y: ['0%', '15%', '-5%', '0%'],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <motion.div
          className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-gradient-to-b from-transparent via-[#3b5bdb] to-transparent"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-0 bottom-0 right-[30%] w-[1px] bg-gradient-to-b from-transparent via-[#60a5fa] to-transparent"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
        <motion.div
          className="absolute left-0 right-0 top-[40%] h-[1px] bg-gradient-to-r from-transparent via-[#3b5bdb] to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
