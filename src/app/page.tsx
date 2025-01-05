"use client";
import axios from "axios";
// import { useRouter, redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Home() {
  const { register, handleSubmit, watch, reset, getValues } = useForm();
  const [availableSlots, setAvailableSlots] = useState([
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ]);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary>();

  const router = useRouter();

  const fetchAvailability = async (data: any) => {
    // console.log("data", data);
    const { time, date } = data;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/get-availability`,
        { date, time }
      );
      setAvailableSlots(response.data.slots);
      // console.log("response ", response);
      if (time && response.data.slots.includes(time)) {
        toast.success(`The selected time slot (${time}) is available.`);
      } else if (time) {
        toast.error(`The selected time slot (${time}) is already booked.`);
      }
    } catch (error: any) {
      console.error("Error fetchAvailability availabilty: ", error.message);
    }
  };
  const submitBooking = async (data: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/create-booking`,
        data
      );
      setBookingSummary(response.data);
      setAvailableSlots(
        availableSlots.filter((ti) => ti != response.data.time)
      );
      reset();
      router.push(`/confirmation?id=${response.data._id}`);
    } catch (error: any) {
      console.error("Error fetching availabilty: ", error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl w-full space-y-8">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Restaurant Table Booking
        </h1>
        <form
          className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit(submitBooking)}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="date" className="sr-only">
                Date
              </label>
              <input
                type="date"
                id="date"
                {...register("date", { required: true })}
                onChange={(e) => {
                  fetchAvailability({ date: e.target.value });
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Date"
              />
            </div>
            <div>
              <label
                className="rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                htmlFor="date"
              >
                Time Selection
              </label>
              <select
                id="date"
                className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                {...register("time")}
              >
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label htmlFor="time" className="sr-only">
                Time
              </label>
              <input
                type="time"
                id="time"
                {...register("time", { required: true })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Time"
              />
            </div> */}
            <div>
              <label htmlFor="guests" className="sr-only">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                {...register("guests", { required: true, min: 1 })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Guests"
              />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: true })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Name"
              />
            </div>
            <div>
              <label htmlFor="contact" className="sr-only">
                Contact
              </label>
              <input
                type="tel"
                id="contact"
                {...register("contact", { required: true })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contact"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSubmit(fetchAvailability)}
              className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
            >
              Check Availability
            </button>
            <button
              type="submit"
              className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-2"
            >
              Book Now
            </button>
          </div>
        </form>
        {availableSlots.length > 0 && (
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">
              Available Slots
            </h3>
            <ul className="mt-2 space-y-2">
              {availableSlots.map((slot, index) => (
                <li key={index} className="text-gray-700">
                  {slot}
                </li>
              ))}
            </ul>
          </div>
        )}
        {bookingSummary && (
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">
              Booking Summary
            </h3>
            <p className="text-gray-700">
              Reservation confirmed for {bookingSummary.name}
            </p>
            <p className="text-gray-700">Date: {bookingSummary.date}</p>
            <p className="text-gray-700">Time: {bookingSummary.time}</p>
            <p className="text-gray-700">Guests: {bookingSummary.guests}</p>
          </div>
        )}
      </div>
    </div>
  );
}
