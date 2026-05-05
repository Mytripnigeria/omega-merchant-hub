import { useQuery } from '@tanstack/react-query';
import { activityLogService, type ActivityLogFilters } from '@/services/api/activity-log';

export function useActivityLog(filters: ActivityLogFilters = {}) {
  return useQuery({
    queryKey: ['activity-log', filters],
    queryFn: () => activityLogService.list(filters),
    staleTime: 10 * 1000,
  });
}
