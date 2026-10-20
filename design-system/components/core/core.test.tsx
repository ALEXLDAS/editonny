import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Badge, Button, Eyebrow, Icon, IconButton, Kbd, Wordmark, iconNames } from '../index';

describe('Icon', () => {
  it('renders the bundled svg hidden from assistive tech by default', () => {
    const { container } = render(<Icon name="copy" size={20} />);
    const svg = container.querySelector('svg.ds-icon');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.innerHTML).toContain('<rect');
    expect(svg).toHaveStyle({ '--icon-size': '20px' });
  });

  it('becomes an image with an accessible name when labeled', () => {
    render(<Icon name="copy" label="Copy" />);
    expect(screen.getByRole('img', { name: 'Copy' })).toBeInTheDocument();
  });

  it('falls back to a CSS mask for names outside the bundled set', () => {
    const { container } = render(<Icon name="custom" base="/icons/" />);
    const mask = container.querySelector('.ds-icon--mask') as HTMLElement;
    expect(mask.style.maskImage).toBe('url("/icons/custom.svg")');
  });
});

describe('Button', () => {
  it('renders a type=button element with variant and size data', () => {
    render(<Button variant="volt" size="lg" icon="copy" iconRight="arrow-up-right">Copy</Button>);
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'volt');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button.querySelectorAll('svg')).toHaveLength(2);
  });

  it('renders a link when href is set', () => {
    render(<Button href="/create">Create</Button>);
    const link = screen.getByRole('link', { name: 'Create' });
    expect(link).toHaveAttribute('href', '/create');
    expect(link).toHaveClass('ds-button');
  });

  it('marks loading as busy and disabled', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it.each(['disabled', 'loading'] as const)('prevents %s links from navigating or invoking click handlers', async state => {
    const onClick = vi.fn();
    render(<><Button href="#destination" {...{ [state]: true }} onClick={onClick}>Save</Button><Button>Next</Button></>);
    const link = screen.getByRole('link', { name: 'Save' });
    await userEvent.click(link);
    link.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    if (state === 'loading') expect(link).toHaveAttribute('aria-busy', 'true');
    link.blur();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it.each(['disabled', 'loading'] as const)('bypasses router links while %s and restores them when enabled', async state => {
    const onClick = vi.fn(event => event.preventDefault());
    const RouterLink = vi.fn((props: ComponentProps<'a'>) => <a {...props} data-router="true" />);
    const { rerender } = render(<Button as={RouterLink} href="#destination" {...{ [state]: true }} onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('link', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(RouterLink).not.toHaveBeenCalled();
    rerender(<Button as={RouterLink} href="#destination" onClick={onClick}>Save</Button>);
    const link = screen.getByRole('link', { name: 'Save' });
    expect(link).toHaveAttribute('href', '#destination');
    expect(link).toHaveAttribute('data-router', 'true');
    expect(link).not.toHaveAttribute('aria-disabled');
    await userEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('small core components', () => {
  it('IconButton exposes its label and pressed state', () => {
    render(<IconButton icon="sun" label="Light theme" active={false} />);
    expect(screen.getByRole('button', { name: 'Light theme' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('Wordmark exposes the accessible name "editonny"', () => {
    render(<Wordmark size={24} />);
    expect(screen.getByRole('img', { name: 'editonny' })).toBeInTheDocument();
  });

  it('Badge, Eyebrow, and Kbd render their content', () => {
    render(<><Badge tone="accent" live>NEW</Badge><Eyebrow index="01">Kicker</Eyebrow><Kbd>I</Kbd></>);
    expect(screen.getByText('NEW')).toHaveAttribute('data-tone', 'accent');
    expect(screen.getByText('01')).toHaveClass('ds-eyebrow__index');
    expect(screen.getByText('I').tagName).toBe('KBD');
  });

  it('iconNames includes the theme and menu icons', () => {
    expect(iconNames()).toEqual(expect.arrayContaining(['sun', 'moon', 'menu', 'copy']));
  });
});
