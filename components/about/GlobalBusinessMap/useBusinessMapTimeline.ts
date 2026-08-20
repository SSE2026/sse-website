'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  ALL_NODES,
  ALL_ROUTES,
  DOMESTIC_ROUTES,
  INTERNATIONAL_ROUTES,
  interpolateKeyframes,
  CAMERA_KEYFRAMES,
  buildRouteCoords,
} from './mapData';

interface TimelineState {
  progress: number; // 0-1
  camera: {
    center: [number, number];
    zoom: number;
  };
  visibleNodes: string[];
  visibleRoutes: string[];
}

interface UseBusinessMapTimelineOptions {
  totalDuration?: number; // 总时长，默认 20s
  onUpdate?: (state: TimelineState) => void;
  paused?: boolean;
}

export function useBusinessMapTimeline(options: UseBusinessMapTimelineOptions = {}) {
  const { totalDuration = 20, onUpdate, paused = false } = options;

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const stateRef = useRef<TimelineState>({
    progress: 0,
    camera: CAMERA_KEYFRAMES[0],
    visibleNodes: ['shenzhen'], // 初始只有深圳
    visibleRoutes: [],
  });

  // 计算可见节点
  const getVisibleNodes = useCallback((progress: number) => {
    return ALL_NODES
      .filter(node => {
        if (node.appearAt === undefined) return false;
        return progress >= node.appearAt;
      })
      .map(n => n.id);
  }, []);

  // 计算可见飞线
  const getVisibleRoutes = useCallback((progress: number) => {
    return ALL_ROUTES
      .filter(route => {
        if (route.appearAt === undefined) return false;
        return progress >= route.appearAt;
      })
      .map(r => r.id);
  }, []);

  // 初始化 Timeline
  const initTimeline = useCallback(() => {
    // 清除旧 timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // 创建主 Timeline - 只播放一遍
    const tl = gsap.timeline({
      repeat: 0, // 只播放一遍
      yoyo: false,
      paused: paused,
    });

    // 添加进度动画
    tl.to(stateRef.current, {
      progress: 1,
      duration: totalDuration,
      ease: 'none',
      onUpdate: function() {
        const progress = stateRef.current.progress;

        // 更新 Camera
        const camera = interpolateKeyframes(progress, CAMERA_KEYFRAMES);

        // 更新可见节点
        const visibleNodes = getVisibleNodes(progress);

        // 更新可见飞线
        const visibleRoutes = getVisibleRoutes(progress);

        // 更新状态
        stateRef.current.camera = camera;
        stateRef.current.visibleNodes = visibleNodes;
        stateRef.current.visibleRoutes = visibleRoutes;

        // 回调
        onUpdate?.(stateRef.current);
      },
      onComplete: function() {
        console.log('Animation complete - staying at global view');
        // 动画完成后，锁定在最后状态（全球辐射完整画面）
        // 但 ECharts 的 rippleEffect 和 effect 会持续动画
      },
    });

    timelineRef.current = tl;

    return tl;
  }, [totalDuration, onUpdate, paused, getVisibleNodes, getVisibleRoutes]);

  // 播放
  const play = useCallback(() => {
    timelineRef.current?.play();
  }, []);

  // 暂停
  const pause = useCallback(() => {
    timelineRef.current?.pause();
  }, []);

  // 重置
  const reset = useCallback(() => {
    timelineRef.current?.restart();
  }, []);

  // 跳转到指定进度
  const seek = useCallback((progress: number) => {
    if (timelineRef.current) {
      const time = progress * totalDuration;
      timelineRef.current.seek(time);
    }
  }, [totalDuration]);

  // 销毁
  const dispose = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  // 初始化
  useEffect(() => {
    initTimeline();
    return () => dispose();
  }, [initTimeline, dispose]);

  // 处理暂停状态
  useEffect(() => {
    if (paused) {
      pause();
    } else {
      play();
    }
  }, [paused, play, pause]);

  return {
    state: stateRef.current,
    timeline: timelineRef.current,
    play,
    pause,
    reset,
    seek,
    dispose,
  };
}

// 生成 ECharts 配置
export function generateEChartsOption(state: TimelineState, locale: 'zh' | 'en' = 'zh') {
  const { camera, visibleNodes, visibleRoutes } = state;

  // 过滤节点
  const nodeData = ALL_NODES
    .filter(n => visibleNodes.includes(n.id))
    .map(n => {
      // 根据节点ID设置不同的标签位置，避免重叠
      let labelOffset: [number, number] = [10, 0];
      let labelPosition: string = 'right';

      switch (n.id) {
        case 'shenzhen':
          labelPosition = 'right';
          labelOffset = [15, 0];
          break;
        case 'guangzhou':
          labelPosition = 'bottom';
          labelOffset = [0, 15];
          break;
        case 'shanghai':
          labelPosition = 'top';
          labelOffset = [0, -15];
          break;
        case 'hangzhou':
          labelPosition = 'bottom';
          labelOffset = [0, 15];
          break;
        case 'shaoxing':
          labelPosition = 'right';
          labelOffset = [15, 0];
          break;
        case 'beijing':
          labelPosition = 'top';
          labelOffset = [0, -15];
          break;
      }

      // 根据语言选择标签名称
      const labelName = locale === 'en' && n.nameEn ? n.nameEn : n.name;

      // 根据节点类型设置样式
      let labelColor = n.color;
      let nodeOpacity = 1;

      if (n.domestic && n.type === 'business') {
        labelColor = '#8F9BAF'; // 灰蓝色 - 业务中心
      }

      // 非激活节点降低透明度 (appearAt 较早的节点)
      const timeSinceAppear = state.progress - (n.appearAt || 0);
      if (timeSinceAppear > 0.15) {
        nodeOpacity = 0.55; // 非激活状态
      }

      return {
        name: labelName,
        value: [...n.coordinates, n.size],
        itemStyle: {
          color: n.color,
          opacity: nodeOpacity,
        },
        label: {
          show: n.showLabel && n.domestic,
          position: labelPosition,
          offset: labelOffset,
          formatter: n.showLabel && n.domestic ? '{b}' : '',
          color: labelColor,
          fontSize: 11,
          fontWeight: 500,
          backgroundColor: 'rgba(5, 7, 11, 0.85)',
          padding: [4, 8],
          borderRadius: 4,
          opacity: nodeOpacity,
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 3,
        },
      };
    });

  // 过滤飞线
  const lineData = ALL_ROUTES
    .filter(r => visibleRoutes.includes(r.id))
    .map(r => {
      const coords = buildRouteCoords(r);
      if (!coords) return null;

      return {
        coords,
        lineStyle: {
          color: r.color,
          width: 1.5,
          curveness: r.curveness || 0.2,
          opacity: 0.6,
        },
      };
    })
    .filter(Boolean);

  return {
    animation: false, // 由 GSAP 控制
    backgroundColor: 'transparent', // 使用容器背景
    geo: {
      map: 'world',
      center: camera.center,
      zoom: camera.zoom,
      roam: false,
      silent: true,
      itemStyle: {
        areaColor: '#0F1520', // 深蓝色背景
        borderColor: '#2A3A5A', // 更明显的边界线
        borderWidth: 1, // 加粗边界线
      },
      emphasis: {
        disabled: true,
      },
      // 添加地图区域分隔线
      select: {
        disabled: true,
      },
    },
    series: [
      // 节点层
      {
        name: 'nodes',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        z: 3,
        symbolSize: (val: number[]) => val[2] || 8,
        data: nodeData,
      },
      // 飞线层
      {
        name: 'flylines',
        type: 'lines',
        coordinateSystem: 'geo',
        z: 2,
        effect: {
          show: true,
          period: 4,
          trailLength: 0.15,
          symbolSize: 4,
          color: '#ffffff',
        },
        lineStyle: {
          width: 1.5,
          opacity: 0.6,
          curveness: 0.2,
        },
        data: lineData,
      },
    ],
  };
}
