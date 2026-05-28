type Category = { name: string; icon: string }

const BY_ACTIVITY: Record<string, Category> = {
  'Eye exercises': { name: 'Bright Eyes', icon: '👀' },
  'Look out a window': { name: 'Sky Watcher', icon: '🪟' },
  'Neck stretches': { name: 'Physio', icon: '🧘' },
  'Short walk': { name: 'David Goggins', icon: '🚶' },
  'Grab a coffee': { name: 'Caffeinated', icon: '☕' },
  'Call a friend': { name: 'Social Butterfly', icon: '📞' },
  Meditation: { name: 'Zen Master', icon: '🌙' },
  'Power nap': { name: 'The Recharger', icon: '😴' },
}

export function categoryFor(activityName: string): Category {
  return BY_ACTIVITY[activityName] ?? { name: activityName, icon: '✨' }
}
