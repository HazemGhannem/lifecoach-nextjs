import { useState } from "react";
import { BookingType, BookingStatus } from "@/types";
import StatusBadge from "./status-badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingsTableProps {
  bookings: any[];
  onStatusChange: (id: string, status: BookingStatus) => void;
  type: "packages" | "bookings" | "freeBookings" | "timeslots";
}

const ITEMS_PER_PAGE = 20;

export default function BookingsTable({
  bookings,
  onStatusChange,
  type,
}: BookingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = bookings.filter((booking) => {
    if (type === "freeBookings") {
      // Show only FREE bookings
      return booking.package?.name.toLowerCase() === "free";
    } else if (type === "bookings") {
      // Show only PAID bookings (NOT free)
      return booking.package?.name.toLowerCase() !== "free";
    }
    // For other types, show all
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Réservations ({filteredBookings.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Date & Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Forfait
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.email}
                    </div>
                    {booking.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {booking.date && booking.date.length > 0 ? (
                        booking.date.map((dateObj: any, dateIdx: number) => (
                          <div key={`${booking._id}-date-${dateIdx}`}>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(dateObj.date).toLocaleDateString(
                                "fr-FR"
                              )}
                            </div>
                            {dateObj.times && dateObj.times.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {dateObj.times.map(
                                  (timeObj: any, timeIdx: number) => (
                                    <span
                                      key={`${booking._id}-time-${dateIdx}-${timeIdx}`}
                                      className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded"
                                    >
                                      {timeObj.time}
                                    </span>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Aucun créneau
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          -
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {booking.package?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        onStatusChange(
                          booking._id,
                          e.target.value as BookingStatus
                        )
                      }
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="PENDING">En attente</option>
                      <option value="CONFIRMED">Confirmé</option>
                      <option value="COMPLETED">Terminé</option>
                      <option value="CANCELLED">Annulé</option>
                      <option value="NO_SHOW">Absent</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucune réservation trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} sur {totalPages} • Affichage {startIndex + 1} à{" "}
            {Math.min(endIndex, filteredBookings.length)} sur{" "}
            {filteredBookings.length}
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Show first page, last page, current page, and neighbors
                  const isVisible =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1;

                  if (
                    !isVisible &&
                    pageNum !== 2 &&
                    pageNum !== totalPages - 1
                  ) {
                    return null;
                  }

                  // Show ellipsis
                  if (pageNum === 2 && currentPage > 3 && totalPages > 4) {
                    return (
                      <span
                        key="ellipsis-start"
                        className="px-2 py-1 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  if (
                    pageNum === totalPages - 1 &&
                    currentPage < totalPages - 2 &&
                    totalPages > 4
                  ) {
                    return (
                      <span
                        key="ellipsis-end"
                        className="px-2 py-1 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        currentPage === pageNum
                          ? "bg-purple-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
