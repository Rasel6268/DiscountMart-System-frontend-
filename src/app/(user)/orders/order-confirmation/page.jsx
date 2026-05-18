import OrderConfirmationPage from "@/components/successOrder";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationPage />
    </Suspense>
  );
}