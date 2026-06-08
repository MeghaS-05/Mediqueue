export const PRIORITY = { EMERGENCY: 'emergency', URGENT: 'urgent', NORMAL: 'normal' };

export function calcPriorityScore(entry) {
  const base = entry.tokenNumber || 0;
  const waitBonus = Math.floor((entry.waitMinutes || 0) / 10) * -5;
  const priorityBoost = { emergency: -1000, urgent: -300, normal: 0 }[entry.priority] ?? 0;
  return base + waitBonus + priorityBoost;
}

export function sortByPriority(queue) {
  return [...queue].sort((a, b) => calcPriorityScore(a) - calcPriorityScore(b));
}

export function estimateWait(avgConsultMins, patientsAhead, minsSinceLastCall = 0) {
  return Math.max(0, avgConsultMins * patientsAhead - minsSinceLastCall);
}

export function waitColor(minutes) {
  if (minutes <= 10) return 'var(--success)';
  if (minutes <= 20) return 'var(--warning)';
  return 'var(--danger)';
}