import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CutView } from '../templates/preview/CutView';

describe('preview marks', () => {
  it.each([0, 6])('keeps marks within the clip when starting %s frames before its end', async frames => {
    const { container } = render(<CutView image="coffee.jpg" onApprove={vi.fn()} toast={vi.fn()} />);
    const timeline = screen.getByRole('slider', { name: 'Edit timeline' });
    for (let i = 0; i < 8; i++) fireEvent.keyDown(timeline, { key: 'PageUp' });
    for (let i = 0; i < frames; i++) fireEvent.click(screen.getByRole('button', { name: 'Back 1 frame' }));
    await userEvent.click(screen.getByRole('button', { name: /^Mark start/ }));
    await userEvent.click(screen.getByRole('button', { name: /^Mark end/ }));
    const range = container.querySelector('.tpl-marks__range');
    expect(range).toHaveTextContent('00:44.50 – 00:45.00');
    await userEvent.click(screen.getByRole('button', { name: 'Add mark' }));
    expect(screen.getByText('00:44.50 – 00:45.00')).toBeInTheDocument();
  });

  it('keeps a positive minimum mark after seeking backward', async () => {
    render(<CutView image="coffee.jpg" onApprove={vi.fn()} toast={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /^Mark start/ }));
    const timeline = screen.getByRole('slider', { name: 'Edit timeline' });
    fireEvent.keyDown(timeline, { key: 'PageDown' });
    fireEvent.keyDown(timeline, { key: 'PageDown' });
    await userEvent.click(screen.getByRole('button', { name: /^Mark end/ }));
    expect(screen.getByText('00:09.20 – 00:09.70')).toBeInTheDocument();
  });
});

