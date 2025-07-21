import { useEffect, useRef, useCallback } from 'react';
import { InteractionManager, Platform } from 'react-native';

interface PerformanceMetrics {
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

export const usePerformance = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    interactionTime: 0,
  });

  const measureRenderTime = useCallback(() => {
    const renderTime = Date.now() - startTime.current;
    metricsRef.current.renderTime = renderTime;
    
    if (__DEV__ && renderTime > 100) {
      console.warn(`${componentName} render time: ${renderTime}ms (slow)`);
    }
  }, [componentName]);

  const measureInteractionTime = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      const interactionTime = Date.now() - startTime.current;
      metricsRef.current.interactionTime = interactionTime;
      
      if (__DEV__ && interactionTime > 500) {
        console.warn(`${componentName} interaction time: ${interactionTime}ms (slow)`);
      }
    });
  }, [componentName]);

  useEffect(() => {
    measureRenderTime();
    measureInteractionTime();
  }, [measureRenderTime, measureInteractionTime]);

  const getMetrics = useCallback(() => metricsRef.current, []);

  return { getMetrics };
};

export const useMemoryMonitor = () => {
  const checkMemory = useCallback(() => {
    if (Platform.OS === 'android' && global.performance?.memory) {
      const memory = global.performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
      
      if (__DEV__) {
        console.log(`Memory usage: ${usedMB}MB / ${totalMB}MB`);
      }
      
      if (usedMB > 100) {
        console.warn('High memory usage detected');
      }
      
      return { used: usedMB, total: totalMB };
    }
    return null;
  }, []);

  useEffect(() => {
    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkMemory]);

  return { checkMemory };
};