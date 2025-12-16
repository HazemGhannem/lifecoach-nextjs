import ResetPasswordView from "@/components/resetPassword/resetPassword";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
        </div>
      }
    >
      <ResetPasswordView />
    </Suspense>
  );
};

export default page;
