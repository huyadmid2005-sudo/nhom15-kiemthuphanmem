import React, { useState, useEffect } from "react";
import axiosInstanceRoomService from "../../utils/axiosInstanceRoomService";
import Sidebar from "../../components/sidebar/Sidebar";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    roomNo: "",
    isAvailable: true,
  });

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanceRoomService.get("/all");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // Create new room
  const createRoom = async () => {
    try {
      if (!newRoom.roomNo.trim()) {
        alert("Room number is required");
        return;
      }

      await axiosInstanceRoomService.post("/create", newRoom);
      alert("Room created successfully!");
      setShowCreateModal(false);
      setNewRoom({ roomNo: "", isAvailable: true });
      fetchRooms();
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  // Update room
  const updateRoom = async () => {
    try {
      if (!editingRoom.roomNo.trim()) {
        alert("Room number is required");
        return;
      }

      await axiosInstanceRoomService.put(
        `/update/${editingRoom.roomId}`,
        editingRoom
      );
      alert("Room updated successfully!");
      setShowEditModal(false);
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room. Please try again.");
    }
  };

  // Delete room
  const deleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosInstanceRoomService.delete(`/delete/${roomId}`);
        alert("Room deleted successfully!");
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room. Please try again.");
      }
    }
  };

  // Open edit modal
  const openEditModal = (room) => {
    setEditingRoom({ ...room });
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="text-center">Loading rooms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Room Management
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Create New Room
            </button>
          </div>

          {/* Rooms Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Room ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Room Number
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No rooms found. Create your first room!
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr key={room.roomId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {room.roomId}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {room.roomNo}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            room.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.isAvailable ? "Available" : "Occupied"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(room)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRoom(room.roomId)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Room</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={newRoom.roomNo}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, roomNo: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter room number (e.g., 101, A-201)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newRoom.isAvailable}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        isAvailable: e.target.value === "true",
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Available</option>
                    <option value="false">Occupied</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewRoom({ roomNo: "", isAvailable: true });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createRoom}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Room Modal */}
        {showEditModal && editingRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Room</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={editingRoom.roomNo}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, roomNo: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter room number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingRoom.isAvailable}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        isAvailable: e.target.value === "true",
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Available</option>
                    <option value="false">Occupied</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingRoom(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateRoom}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;
