"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const BookingDetails = () => {
  const [bookingSummary, setBookingSummary] = useState<BookingSummary>();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  // useCallback used for memoization of the following function
  const fetchBookingDetails = useCallback(async () => {
    try {
      const id = searchParams.get("id");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/status/${id}`
      );
      //   console.log("response.data", response.data.booking);
      setBookingSummary(response.data.booking);
    } catch (error) {
      console.error("Error :", error);
    }
  }, [searchParams]);

  const cancelBooking = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/delete-booking/${bookingSummary?._id}`
      );
      toast.success(
        `Restaurant Booking on ${bookingSummary?.date} and time ${bookingSummary?.time} is cancelled`
      );
      router.push("/");
    } catch (error) {
      console.error("Error while cancelling booking", error);
    }
  };
  return (
    bookingSummary && (
      <div>
        <div className="bg-white h-screen flex flex-col items-center justify-center text-gray-950">
          <div className="bg-gray-100 rounded-lg p-8">
            <h1 className="text-3xl font-bold">Booking Confirmation</h1>
            <p className="text-lg mt-4">
              Thank you for booking a table at our restaurant. Your booking
              details are as follows:
            </p>
            <ul className="list-disc pl-8 mt-4">
              <li>
                <span className="font-bold">Date: </span>
                {bookingSummary.date}
              </li>
              <li>
                <span className="font-bold">Time: </span>
                {bookingSummary.time}
              </li>
              <li>
                <span className="font-bold">Name: </span>
                {bookingSummary.name}
              </li>
              <li>
                <span className="font-bold">Number of Guests: </span>
                {bookingSummary.guests}
              </li>
            </ul>
          </div>
          <button
            className="bg-red-600 px-4 py-2 text-lg mt-4 rounded-md hover:bg-red-500 hover:scale-95"
            onClick={cancelBooking}
          >
            Cancel Booking
          </button>
        </div>
      </div>
    )
  );
};

export default BookingDetails;
