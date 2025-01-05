import BookingDetails from "@/components/BookingDetails";
import { Suspense } from "react";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingDetails />
    </Suspense>
  );
}
