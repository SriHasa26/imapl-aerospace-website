interface Props {
  children: string
}

export default function LegalReviewBanner({ children }: Props) {
  return (
    <aside className="border border-cyan/30 bg-navy-mid p-5 sm:p-6 mb-10" role="note">
      <div className="font-mono text-xs text-cyan uppercase tracking-widest mb-2">Legal review required</div>
      <p className="text-steel text-sm leading-relaxed">{children}</p>
    </aside>
  )
}
