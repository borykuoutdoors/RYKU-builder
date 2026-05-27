'use client'

interface Props {
  isLoading: boolean
  className?: string
}

export default function LoadingBar({ isLoading, className = '' }: Props) {
  if (!isLoading) return null

  return (
    <div className={`loading-bar${className ? ` ${className}` : ''}`}>
      <div className="loading-bar-fill" />
    </div>
  )
}
