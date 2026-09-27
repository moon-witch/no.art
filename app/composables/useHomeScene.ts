export function useHomeScene() {
  return useState('home-navigation-ready', () => false)
}

export function useHomeIntroPlayed() {
  return useState('home-intro-played', () => false)
}
