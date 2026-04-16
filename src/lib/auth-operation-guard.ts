/**
 * Authentication Operation Guard
 * Ensures only one authentication operation (signin/logout) can execute at a time
 * Prevents race conditions from rapid user interactions
 */

/**
 * Global flag to track if an auth operation is in progress
 */
let authOperationInProgress = false;
let pendingOperations: Array<{
  name: string;
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

/**
 * Execute an authentication operation with a lock
 * Ensures only one auth operation runs at a time
 *
 * @param operationName - Name of the operation for logging
 * @param operation - Async function to execute
 * @param options - Configuration options
 * @returns Result of the operation
 *
 * @example
 * // Only one signin will execute; others queue
 * await withAuthOperationLock('signin', async () => {
 *   return await performSignin(credentials);
 * });
 */
export const withAuthOperationLock = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  options?: {
    enableLogging?: boolean;
  },
): Promise<T> => {
  const { enableLogging = false } = options || {};

  if (enableLogging) {
    console.log(`[authOperationGuard] Requesting lock for: ${operationName}`);
  }

  return new Promise<T>((resolve, reject) => {
    // If no operation is in progress, execute immediately
    if (!authOperationInProgress) {
      authOperationInProgress = true;

      if (enableLogging) {
        console.log(`[authOperationGuard] Lock acquired for: ${operationName}`);
      }

      // Execute the operation
      operation()
        .then((result) => {
          if (enableLogging) {
            console.log(`[authOperationGuard] Operation completed: ${operationName}`);
          }

          // Mark operation as complete
          authOperationInProgress = false;

          // Process any pending operations
          processNextOperation();

          // Resolve this operation
          resolve(result);
        })
        .catch((error) => {
          console.error(`[authOperationGuard] Operation failed: ${operationName}`, error);

          // Mark operation as complete
          authOperationInProgress = false;

          // Process any pending operations
          processNextOperation();

          // Reject this operation
          reject(error);
        });
    } else {
      // Operation is in progress, queue this one
      if (enableLogging) {
        console.log(
          `[authOperationGuard] Operation queued (${pendingOperations.length + 1} pending): ${operationName}`,
        );
      }

      pendingOperations.push({
        name: operationName,
        operation,
        resolve,
        reject,
      });
    }
  });
};

/**
 * Process the next queued operation, if any
 */
function processNextOperation(): void {
  if (pendingOperations.length > 0 && !authOperationInProgress) {
    const { name, operation, resolve, reject } = pendingOperations.shift()!;

    console.log(`[authOperationGuard] Processing queued operation: ${name}`);

    authOperationInProgress = true;

    operation()
      .then((result) => {
        console.log(`[authOperationGuard] Queued operation completed: ${name}`);
        authOperationInProgress = false;
        processNextOperation();
        resolve(result);
      })
      .catch((error) => {
        console.error(`[authOperationGuard] Queued operation failed: ${name}`, error);
        authOperationInProgress = false;
        processNextOperation();
        reject(error);
      });
  }
}

/**
 * Check if an auth operation is currently in progress
 */
export const isAuthOperationInProgress = (): boolean => {
  return authOperationInProgress;
};

/**
 * Get the number of pending auth operations (excluding the current one)
 */
export const getPendingAuthOperationsCount = (): number => {
  return pendingOperations.length;
};

/**
 * Force reset the operation guard (emergency cleanup)
 * Use only if auth operations are stuck
 */
export const resetAuthOperationGuard = (): void => {
  console.warn('[authOperationGuard] Force resetting operation guard');
  authOperationInProgress = false;
  pendingOperations = [];
};
