import { createPackage, deletePackage, getAllPackages, updatePackage } from "@/lib/actions/package.action";
import { useState, useEffect, useCallback } from "react";

export function usePackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: any = await getAllPackages();
      setPackages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleCreate = useCallback(
    async (payload: any) => {
      await createPackage(payload);
      await fetchPackages();
    },
    [fetchPackages]
  );

  const handleUpdate = useCallback(
    async (id: string, payload: any) => {
      await updatePackage(id, payload);
      await fetchPackages();
    },
    [fetchPackages]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deletePackage(id);
      await fetchPackages();
    },
    [fetchPackages]
  );

  return {
    packages,
    isLoading,
    error,
    refreshPackages: fetchPackages,
    createPackage: handleCreate,
    updatePackage: handleUpdate,
    deletePackage: handleDelete,
  };
}