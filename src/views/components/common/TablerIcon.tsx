interface TablerIconProps {
  name: string
  className?: string
}

export function TablerIcon({ name, className = '' }: TablerIconProps) {
  return <i className={`ti ${name} ${className}`.trim()} aria-hidden="true" />
}
