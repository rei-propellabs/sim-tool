import { FullLoadingSpinner } from "components/FullLoadingSpinner/FullLoadingSpinner";
import { type PropsWithChildren } from "react";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const isLoading = false

  if (isLoading) {
    return <FullLoadingSpinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;