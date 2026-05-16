import { describe, it, expect, beforeEach } from 'vitest';
import { useReaderStore } from '../reader-store';

describe('readerStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    useReaderStore.setState({
      fontSize: 18,
      lineHeight: 1.6,
      contentWidth: 'medium',
      theme: 'light',
      readingProgress: 0,
    });
  });

  it('should initialize with default values', () => {
    const state = useReaderStore.getState();
    expect(state.fontSize).toBe(18);
    expect(state.theme).toBe('light');
    expect(state.contentWidth).toBe('medium');
  });

  it('should update font size', () => {
    useReaderStore.getState().setFontSize(24);
    expect(useReaderStore.getState().fontSize).toBe(24);
  });

  it('should update theme', () => {
    useReaderStore.getState().setTheme('dark');
    expect(useReaderStore.getState().theme).toBe('dark');
  });

  it('should update reading progress', () => {
    useReaderStore.getState().setReadingProgress(45.5);
    expect(useReaderStore.getState().readingProgress).toBe(45.5);
  });
});
