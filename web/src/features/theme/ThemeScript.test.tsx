import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeScript } from './ThemeScript';

afterEach(() => { vi.restoreAllMocks(); });

describe('ThemeScript', () => {
  it('renders on the client without React warnings', () => {
    // Next serves notFound() pages as an error shell, so the browser renders the root layout and this script itself.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ThemeScript />);
    expect(error).not.toHaveBeenCalled();
  });
});
