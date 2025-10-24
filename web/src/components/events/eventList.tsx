// src/components/EventList.jsx
import React from "react";
import EventCard from "./eventCard";
import { IEvent } from "@/types/event.type";

interface EventListProps {
  events: IEvent[];
}
// Menerima array 'events' sebagai props
function EventList({ events }: EventListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
