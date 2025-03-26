/**
 * Common React Query configuration options
 * This file centralizes query configuration to ensure consistent caching behavior
 * across the application and prevent excessive requests.
 */

/**
 * Default query configuration
 * @param {Object} overrides - Override specific configuration options
 * @returns {Object} Query configuration
 */
export const defaultQueryConfig = (overrides = {}) => ({
  // Default settings
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchInterval: false,
  refetchIntervalInBackground: false,
  suspense: false,
  keepPreviousData: true,
  retry: 1,
  ...overrides,
});

/**
 * Session data query configuration (shorter stale time)
 * @param {Object} overrides - Override specific configuration options
 * @returns {Object} Query configuration
 */
export const sessionQueryConfig = (overrides = {}) =>
  defaultQueryConfig({
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...overrides,
  });

/**
 * Configuration for mutation callbacks
 * @param {Object} queryClient - React Query client instance
 * @param {Array|String} queryKey - Key to invalidate on success
 * @param {Object} overrides - Additional callback overrides
 * @returns {Object} Mutation callbacks
 */
export const defaultMutationOptions = (
  queryClient,
  queryKey,
  overrides = {}
) => ({
  onSuccess: () => {
    if (Array.isArray(queryKey)) {
      queryKey.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: key,
          exact: typeof key !== "string",
        });
      });
    } else {
      queryClient.invalidateQueries({
        queryKey,
        exact: typeof queryKey !== "string",
      });
    }

    if (overrides.onSuccess) {
      overrides.onSuccess();
    }
  },
  ...overrides,
});
