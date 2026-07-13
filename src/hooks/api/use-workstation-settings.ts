import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  workstationSettingsService,
  type UpdateWorkstationSettingsPayload,
  type WorkstationSettings,
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
      // Merge into the cache so a partial PATCH echo doesn't drop other fields.
      qc.setQueryData<WorkstationSettings>(KEY, (old) =>
        old ? { ...old, ...settings } : settings,
      );
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
