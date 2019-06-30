import { act, renderHook } from '@testing-library/react-hooks';

import { useAutoControlled } from './useAutoControlled';


describe('useAutoControlled', () => {
  it('should be defined', () => {
    expect(useAutoControlled).toBeDefined();
  });

  it('should not update state when a prop has been provided', () => {
    const hook = renderHook((prop) => useAutoControlled(0, prop), { initialProps: 123 });

    act(() => {
      hook.result.current[2]();
    });

    expect(hook.result.current[0]).toBe(123);

    act(() => {
      hook.result.current[1](456);
    });

    expect(hook.result.current[0]).toBe(123);
  });

  it('should update state when no prop has been provided', () => {
    const hook = renderHook(() => useAutoControlled(0));

    act(() => {
      hook.result.current[2]();
    });

    expect(hook.result.current[0]).toBe(0);

    act(() => {
      hook.result.current[1](123);
    });

    expect(hook.result.current[0]).toBe(123);
  });

  it('should initialize state from a default prop if provided', () => {
    const hook = renderHook((prop) => useAutoControlled(0, undefined, prop), { initialProps: 123 });

    act(() => {
      hook.result.current[2]();
    });

    expect(hook.result.current[0]).toBe(123);

    act(() => {
      hook.result.current[1](456);
    });

    expect(hook.result.current[0]).toBe(456);
  });
});
