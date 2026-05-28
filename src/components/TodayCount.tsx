type Props = {
  count: number | null
}

export function TodayCount({ count }: Props) {
  if (count === null) return null
  const label =
    count === 0
      ? 'First check-in today.'
      : count === 1
        ? '1 check-in today.'
        : `${count} check-ins today.`
  return <p className="today-count">{label}</p>
}
