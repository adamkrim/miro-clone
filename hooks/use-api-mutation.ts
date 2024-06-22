import { useState } from "react";
import { useMutation } from "convex/react";
import { FunctionReference, OptionalRestArgs } from "convex/server";

type MutationFunctionReference = FunctionReference<"mutation">;

export const useApiMutation = <T extends MutationFunctionReference>(
  mutationFn: T
) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFn);

  const mutate = (...payload: OptionalRestArgs<T>) => {
    setPending(true);
    return apiMutation(...payload)
      .finally(() => setPending(false))
      .then((res) => res)
      .catch((err) => {
        throw err;
      });
  };

  return { mutate, pending };
};
