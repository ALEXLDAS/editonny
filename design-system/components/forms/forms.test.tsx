import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ChoiceCard, SegmentedControl, Select, Switch, TextField } from '../index';

describe('TextField', () => {
  it('links the label, help text, and value', () => {
    render(<TextField label="Folder" help="Paste the path" value="/Videos" onChange={() => {}} />);
    const input = screen.getByLabelText('Folder');
    expect(input).toHaveValue('/Videos');
    expect(input).toHaveAccessibleDescription('Paste the path');
  });

  it('renders a textarea when multiline and reports changes', async () => {
    const onChange = vi.fn();
    render(<TextField label="Goal" multiline rows={4} value="" onChange={onChange} />);
    const area = screen.getByLabelText('Goal');
    expect(area.tagName).toBe('TEXTAREA');
    await userEvent.type(area, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('marks errors as invalid and shows the counter', () => {
    render(<TextField label="Title" error="Required" counter={10} value="abc" onChange={() => {}} />);
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('3/10')).toBeInTheDocument();
  });

  it.each([false, true])('updates an uncontrolled counter and forwards changes (multiline=%s)', async multiline => {
    const onChange = vi.fn();
    const { container } = render(<TextField label="Title" multiline={multiline} counter={5} defaultValue="abc" onChange={onChange} />);
    const input = screen.getByLabelText('Title');
    await userEvent.type(input, 'de');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(input).toHaveValue('abcde');
    expect(screen.getByText('5/5')).toHaveAttribute('data-near', 'true');
    expect(container.querySelector('.ds-field__meter')).toHaveStyle({ '--progress': '1' });
    await userEvent.clear(input);
    expect(screen.getByText('0/5')).toHaveAttribute('data-near', 'false');
    expect(container.querySelector('.ds-field__meter')).toHaveStyle({ '--progress': '0' });
  });

  it.each([false, true])('resets an uncontrolled counter with its form (multiline=%s)', async multiline => {
    const { container } = render(<form><TextField label="Title" multiline={multiline} counter={10} defaultValue="abc" /></form>);
    await userEvent.type(screen.getByLabelText('Title'), 'x');
    expect(screen.getByText('4/10')).toBeInTheDocument();
    container.querySelector('form')!.reset();
    expect(await screen.findByText('3/10')).toBeInTheDocument();
  });

  it('keeps a controlled counter tied to the value prop', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<TextField label="Title" counter={10} value="abc" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Title'), 'd');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('3/10')).toBeInTheDocument();
    rerender(<TextField label="Title" counter={10} value="abcde" onChange={onChange} />);
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });
});

describe('Select', () => {
  it('renders string and object options and emits change', () => {
    const onChange = vi.fn();
    render(<Select label="Pace" value="calm" options={['natural', { value: 'calm', label: 'Calm' }]} onChange={onChange} />);
    const select = screen.getByLabelText('Pace');
    expect(select).toHaveValue('calm');
    fireEvent.change(select, { target: { value: 'natural' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('ChoiceCard and Switch', () => {
  it('ChoiceCard accepts a roving tabIndex', () => {
    render(<div role="radiogroup" aria-label="Agent"><ChoiceCard title="Codex" selected tabIndex={0} /><ChoiceCard title="Claude" tabIndex={-1} /></div>);
    expect(screen.getByRole('radio', { name: 'Claude' })).toHaveAttribute('tabindex', '-1');
  });

  it('ChoiceCard is a radio that reports selection', async () => {
    const onSelect = vi.fn();
    render(<div role="radiogroup" aria-label="Format"><ChoiceCard title="9:16" selected={false} onSelect={onSelect} /></div>);
    const radio = screen.getByRole('radio', { name: '9:16' });
    expect(radio).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(radio);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('Switch is a switch that toggles its checked state', async () => {
    const onChange = vi.fn();
    render(<Switch ariaLabel="Captions" onChange={onChange} />);
    const toggle = screen.getByRole('switch', { name: 'Captions' });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('SegmentedControl', () => {
  function Controlled({ onChange }: { onChange: (value: string) => void }) {
    const [value, setValue] = useState('All');
    return <SegmentedControl label="Category" options={['All', 'Edit', 'Audio']} value={value} onChange={next => { setValue(next); onChange(next); }} />;
  }

  it('moves the selection with arrow keys and reports it', async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    expect(screen.getByRole('radiogroup', { name: 'Category' })).toBeInTheDocument();
    const first = screen.getByRole('radio', { name: 'All' });
    expect(first).toHaveAttribute('aria-checked', 'true');
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('Edit');
    expect(screen.getByRole('radio', { name: 'Edit' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Edit' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('Audio');
  });
});
