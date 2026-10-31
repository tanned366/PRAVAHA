// Date Utilities for Catalyst AICTE System
// Based on current reference date: 2026-10-30T21:10:49+05:30

export const REFERENCE_DATE = new Date('2026-10-30T21:10:49+05:30');

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(dueDateString?: string): number {
  if (!dueDateString) return 0;
  const due = new Date(dueDateString);
  const diffMs = due.getTime() - REFERENCE_DATE.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isDeadlineOverdue(dueDateString?: string): boolean {
  if (!dueDateString) return false;
  return new Date(dueDateString).getTime() < REFERENCE_DATE.getTime();
}

export function formatDeadlineStatus(dueDateString?: string): {
  text: string;
  isOverdue: boolean;
  isDueSoon: boolean;
  colorClass: string;
} {
  if (!dueDateString) {
    return { text: 'No Deadline', isOverdue: false, isDueSoon: false, colorClass: 'text-slate-500' };
  }
  const days = getDaysRemaining(dueDateString);
  if (days < 0) {
    return {
      text: `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} overdue`,
      isOverdue: true,
      isDueSoon: false,
      colorClass: 'text-rose-600 font-semibold'
    };
  } else if (days === 0) {
    return {
      text: 'Due Today',
      isOverdue: false,
      isDueSoon: true,
      colorClass: 'text-amber-600 font-semibold'
    };
  } else if (days <= 3) {
    return {
      text: `Due in ${days} day${days > 1 ? 's' : ''}`,
      isOverdue: false,
      isDueSoon: true,
      colorClass: 'text-amber-600 font-medium'
    };
  } else {
    return {
      text: `Due in ${days} days`,
      isOverdue: false,
      isDueSoon: false,
      colorClass: 'text-emerald-700'
    };
  }
}
