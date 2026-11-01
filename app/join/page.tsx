'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Handshake, MapPin } from 'lucide-react'

const types = [
  ['worker', 'Worker', 'I want to find work and grow my skills.'],
  ['customer_employer', 'Customer / employer', 'I want to find reliable local workers.'],
  ['training_provider', 'Training provider', 'I want to connect my programmes with local communities.'],
  ['business_organisation', 'Business / organisation', 'I want to connect with local talent.'],
]
const roleContent: Record<string, { title: string; intro: string; feature: string }> = {
  worker: { title: 'Find work that moves you forward.', intro: 'Create a worker profile, discover local opportunities, get practical task guidance and grow your skills.', feature: 'Worker waitlist' },
  customer_employer: { title: 'Find trusted help, close to home.', intro: 'Tell us what you need and connect with local people whose skills match the job.', feature: 'Customer and employer waitlist' },
  training_provider: { title: 'Put your training where opportunity is.', intro: 'Connect your programmes with people building practical skills for real local demand.', feature: 'Training provider waitlist' },
  business_organisation: { title: 'Build stronger local teams.', intro: 'Connect your organisation with local talent, services and skills-development pathways.', feature: 'Business and organisation waitlist' },
}

function JoinPageContent() {
  const searchParams = useSearchParams()
  const [type, setType] = useState(searchParams.get('type') || 'worker'); const [sent, setSent] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  useEffect(() => { const requested = searchParams.get('type'); if (requested && roleContent[requested]) setType(requested) }, [searchParams])
  const currentRole = roleContent[type] || roleContent.worker
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const data = Object.fromEntries(new FormData(event.currentTarget)); data.user_type = type; const response = await fetch('/api/waitlist', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }); const result = await response.json(); setBusy(false); if (!response.ok) { setError(result.error); return } setSent(true) }
  return <main className="join-page"><header className="site-header"><Link href="/" className="brand"><span className="brand-mark"><Handshake aria-hidden="true" /></span><span>yenza</span></Link><Link href="/" className="back-link"><ArrowLeft size={16}/> Back home</Link></header><div className="join-shell"><div className="join-intro"><div className="eyebrow"><span className="eyebrow-dot"/>Built for what comes next · {currentRole.feature}</div><h1>{currentRole.title}</h1><p>{currentRole.intro}</p><div className="role-promise"><MapPin size={17}/> Built for Newcastle, then every local community.</div></div>{sent ? <section className="success-card"><div className="success-icon"><Check size={28}/></div><h2>You&apos;re on the Yenza waitlist!</h2><p>Thank you for your interest in Yenza. We&apos;ll keep you updated as we prepare to launch and bring more local work and skills-development opportunities to your community.</p><Link href="/" className="button">Back to Yenza <ArrowRight size={17}/></Link></section> : <form className="waitlist-form" onSubmit={submit}><fieldset><legend>What brings you to Yenza?</legend><div className="type-grid">{types.map(([value, title, copy]) => <button type="button" key={value} className={`type-choice ${type === value ? 'selected' : ''}`} onClick={() => setType(value)}><span className="choice-check">{type === value && <Check size={14}/>}</span><strong>{title}</strong><small>{copy}</small></button>)}</div></fieldset><div className="form-grid"><label>Full name<input name="full_name" required placeholder="Your name"/></label><label>Email address<input name="email" type="email" required placeholder="you@example.com"/></label><label>Mobile number <span>(optional)</span><input name="mobile_number" placeholder="+27"/></label><label>Town or location<input name="location" required placeholder="Newcastle, KZN"/></label></div>{type === 'worker' && <label>Skills or services of interest<textarea name="skills_services" placeholder="e.g. painting, gardening, plumbing"/></label>}{type === 'training_provider' && <label>Training programmes offered<textarea name="training_programmes" placeholder="Tell us about your programmes"/></label>}{type !== 'worker' && <label>Organisation name<input name="organisation_name" placeholder="Organisation name"/></label>}<label>Message <span>(optional)</span><textarea name="message" placeholder="Anything you would like us to know?"/></label><label className="consent"><input type="checkbox" name="marketing_consent" value="true"/> <span>I agree to receive launch updates and occasional news from Yenza.</span></label><p className="privacy">By submitting, you agree that Yenza may use your details to manage this waitlist in line with POPIA. We will never sell your information.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button submit-button" disabled={busy}>{busy ? 'Saving your place…' : 'Join the waitlist'} <ArrowRight size={17}/></button></form>}</div></main>
}

export default function JoinPage() {
  return <Suspense fallback={<main className="join-page"><div className="join-shell"><p>Loading your waitlist…</p></div></main>}><JoinPageContent /></Suspense>
}
