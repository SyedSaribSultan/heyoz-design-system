// Toast numbers that the spec cannot hold as tokens (counts and times), in one plain module so Toast.jsx (client) and the
// docs page (server) read the same values. Written in components/toast.json `rules` (time, stack, motion).
export const TOAST = { max: 3, duration: 5000, actionDuration: 10000, swipe: 80, types: ['neutral', 'success', 'warning', 'critical', 'info'] };
