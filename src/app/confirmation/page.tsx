import BookingDetails from "@/components/BookingDetails";

export default function ConfirmationPage({
  bookingSummary,
}: {
  bookingSummary: BookingSummary;
}) {
  return (
    <>
      <BookingDetails />
    </>
  );
}
