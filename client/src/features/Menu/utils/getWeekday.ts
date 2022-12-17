export function getWeekday() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
    new Date()
  );
}
