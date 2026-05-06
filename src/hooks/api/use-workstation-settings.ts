import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  workstationSettingsService,
  type UpdateWorkstationSettingsPayload,
} from "@/services/api/workstation-settings";

const KEY = ["workstation-settings"] as const;

export function useWorkstationSettings() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => workstationSettingsService.get(),
    staleTime: 60 * 1000,
  });
}

export function useUpdateWorkstationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateWorkstationSettingsPayload) =>
      workstationSettingsService.update(payload),
    onSuccess: (settings) => {
      qc.setQueryData(KEY, settings);
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
