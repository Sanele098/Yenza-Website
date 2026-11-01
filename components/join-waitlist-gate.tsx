'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, BriefcaseBusiness, Building2, GraduationCap, Users, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const roles = [
  { id: 'worker', label: 'Worker', description: 'Find local work and grow your skills.', icon: Users },
  { id: 'customer_employer', label: 'Customer / Employer', description: 'Find trusted local workers for your needs.', icon: BriefcaseBusiness },
  { id: 'training_provider', label: 'Training Provider', description: 'Connect your programmes to local communities.', icon: GraduationCap },
  { id: 'business_organisation', label: 'Business / Organisation', description: 'Connect with local talent and opportunity.', icon: Building2 },
]

export function JoinWaitlistGate() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href="/join"]')
      if (!link) return
      event.preventDefault()
      setOpen(true)
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  if (!open) return null
  return <div className="join-modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
    <section className="join-modal" role="dialog" aria-modal="true" aria-labelledby="join-modal-title" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" type="button" aria-label="Close" onClick={() => setOpen(false)}><X size={18} /></button>
      <div className="eyebrow"><span className="eyebrow-dot" />Join the Yenza network</div>
      <h2 id="join-modal-title">What brings you to Yenza?</h2>
      <p>Choose the path that fits you best. We&apos;ll take you to a dedicated waitlist for your role.</p>
      <div className="role-options">
        {roles.map(({ id, label, description, icon: Icon }) => <button className="role-option" key={id} type="button" onClick={() => router.push(`/join?type=${id}`)}>
          <span className="role-icon"><Icon size={20} /></span><span><strong>{label}</strong><small>{description}</small></span><ArrowRight size={17} />
        </button>)}
      </div>
    </section>
  </div>
}
