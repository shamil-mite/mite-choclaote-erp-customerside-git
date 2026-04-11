'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/storefront-api';

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      const response = await submitContactForm(form);
      setMessage(response.detail || 'Your enquiry has been sent successfully.');
      setForm({ name: '', email: '', mobile: '', subject: '', message: '' });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b]">Contact form</div>
        <h2 className="mt-3 font-heading text-4xl text-[#4a3a36]">Send us your enquiry</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-[18px] border border-[#e2cfcb] bg-white px-4 py-3 text-[#4a3a36] outline-none focus:border-[#c9a9a6]"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
        <input
          className="rounded-[18px] border border-[#e2cfcb] bg-white px-4 py-3 text-[#4a3a36] outline-none focus:border-[#c9a9a6]"
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />
        <input
          className="rounded-[18px] border border-[#e2cfcb] bg-white px-4 py-3 text-[#4a3a36] outline-none focus:border-[#c9a9a6]"
          placeholder="Mobile number"
          value={form.mobile}
          onChange={(e) => onChange('mobile', e.target.value)}
        />
        <input
          className="rounded-[18px] border border-[#e2cfcb] bg-white px-4 py-3 text-[#4a3a36] outline-none focus:border-[#c9a9a6]"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => onChange('subject', e.target.value)}
        />
      </div>
      <textarea
        className="min-h-[220px] w-full rounded-[22px] border border-[#e2cfcb] bg-white px-4 py-4 text-[#4a3a36] outline-none focus:border-[#c9a9a6]"
        placeholder="Write your message"
        value={form.message}
        onChange={(e) => onChange('message', e.target.value)}
        required
      />
      {message ? <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      {error ? <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-[#8b6f6b] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_rgba(139,111,107,0.25)] transition hover:bg-[#6f5754] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? 'Sending...' : 'Send enquiry'}
      </button>
    </form>
  );
}
