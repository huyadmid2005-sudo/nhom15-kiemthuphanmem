import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstanceInventoryService from "../../utils/axiosInstanceInventoryService";
import { toast } from "react-toastify";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const MedicalEquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");

  const [equipmentForm, setEquipmentForm] = useState({
    medicalEquipmentName: "",
    medicalEquipmentType: "",
    manufacturer: "",
    manufactureDate: "",
    expiryDate: "",
    isOccupied: false,
    isActive: true,
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanceInventoryService.get(
        "/medical-equipment/get-all"
      );
      const equipmentWithId = response.data.map((item, index) => ({
        ...item,
        id: item.medicalEquipmentId || index,
      }));
      setEquipment(equipmentWithId);
    } catch (error) {
      console.error("Error fetching medical equipment:", error);
      toast.error("Failed to fetch medical equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchEquipment();
      return;
    }

    try {
      setLoading(true);
      let response;
      switch (searchType) {
        case "name":
          response = await axiosInstanceInventoryService.get(
            `/medical-equipment/search/name/${searchTerm}`
          );
          break;
        case "manufacturer":
          response = await axiosInstanceInventoryService.get(
            `/medical-equipment/search/manufacturer/${searchTerm}`
          );
          break;
        default:
          response = await axiosInstanceInventoryService.get(
            "/medical-equipment/get-all"
          );
      }

      const equipmentWithId = response.data.map((item, index) => ({
        ...item,
        id: item.medicalEquipmentId || index,
      }));
      setEquipment(equipmentWithId);
    } catch (error) {
      console.error("Error searching medical equipment:", error);
      toast.error("Failed to search medical equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditMode(true);
      setSelectedEquipment(item);
      setEquipmentForm({
        medicalEquipmentName: item.medicalEquipmentName || "",
        medicalEquipmentType: item.medicalEquipmentType || "",
        manufacturer: item.manufacturer || "",
        manufactureDate: item.manufactureDate || "",
        expiryDate: item.expiryDate || "",
        isOccupied: item.isOccupied || false,
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
    } else {
      setEditMode(false);
      setSelectedEquipment(null);
      setEquipmentForm({
        medicalEquipmentName: "",
        medicalEquipmentType: "",
        manufacturer: "",
        manufactureDate: "",
        expiryDate: "",
        isOccupied: false,
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedEquipment(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEquipmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        const updateData = {
          ...equipmentForm,
          medicalEquipmentId: selectedEquipment.medicalEquipmentId,
        };
        await axiosInstanceInventoryService.put(
          "/medical-equipment/update",
          updateData
        );
        toast.success("Medical equipment updated successfully!");
      } else {
        await axiosInstanceInventoryService.post(
          "/medical-equipment/create",
          equipmentForm
        );
        toast.success("Medical equipment created successfully!");
      }
      handleCloseDialog();
      fetchEquipment();
    } catch (error) {
      console.error("Error saving medical equipment:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save medical equipment"
      );
    }
  };

  const handleDelete = async (equipmentId) => {
    if (
      window.confirm("Are you sure you want to delete this medical equipment?")
    ) {
      try {
        await axiosInstanceInventoryService.delete(
          `/medical-equipment/delete/${equipmentId}`
        );
        toast.success("Medical equipment deleted successfully!");
        fetchEquipment();
      } catch (error) {
        console.error("Error deleting medical equipment:", error);
        toast.error("Failed to delete medical equipment");
      }
    }
  };

  const columns = [
    { field: "medicalEquipmentId", headerName: "ID", width: 80 },
    { field: "medicalEquipmentName", headerName: "Equipment Name", width: 180 },
    { field: "medicalEquipmentType", headerName: "Type", width: 120 },
    { field: "manufacturer", headerName: "Manufacturer", width: 130 },
    { field: "manufactureDate", headerName: "Manufacture Date", width: 150 },
    { field: "expiryDate", headerName: "Expiry Date", width: 120 },
    {
      field: "isOccupied",
      headerName: "Occupied",
      width: 100,
      renderCell: (params) => (
        <span className={params.value ? "text-red-600" : "text-green-600"}>
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <span className={params.value ? "text-green-600" : "text-red-600"}>
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenDialog(params.row)}
            className="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded"
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            onClick={() => handleDelete(params.row.medicalEquipmentId)}
            className="bg-red-500 hover:bg-red-700 text-white p-1 rounded"
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Medical Equipment Management
            </h1>
            <button
              onClick={() => handleOpenDialog()}
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <AddIcon /> Add Equipment
            </button>
          </div>

          {/* Search Section */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex gap-4 items-end">
              <FormControl className="min-w-32">
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  label="Search By"
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="manufacturer">Manufacturer</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search Term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <SearchIcon /> Search
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchEquipment();
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Clear
              </button>
            </div>
          </div>

          {/* DataGrid */}
          <div
            className="bg-white rounded-lg shadow"
            style={{ height: 600, width: "100%" }}
          >
            <DataGrid
              rows={equipment}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              loading={loading}
              disableSelectionOnClick
            />
          </div>

          {/* Add/Edit Equipment Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {editMode
                ? "Edit Medical Equipment"
                : "Add New Medical Equipment"}
            </DialogTitle>
            <DialogContent>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextField
                  name="medicalEquipmentName"
                  label="Equipment Name"
                  value={equipmentForm.medicalEquipmentName}
                  onChange={handleFormChange}
                  required
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Equipment Type</InputLabel>
                  <Select
                    name="medicalEquipmentType"
                    value={equipmentForm.medicalEquipmentType}
                    onChange={handleFormChange}
                    label="Equipment Type"
                  >
                    <MenuItem value="Laboratory_Equipment">Laboratory</MenuItem>
                    <MenuItem value="Surgical_Equipment">Surgical</MenuItem>
                    <MenuItem value="Diagnostic_Equipment">Diagnostic</MenuItem>
                    <MenuItem value="Therapeutic_Equipment">Therapeutic</MenuItem>
                    <MenuItem value="Life_Support_Equipment">Life Support</MenuItem>
                    <MenuItem value="Medical_Monitoring_Equipment">Medical Monitoring</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  name="manufacturer"
                  label="Manufacturer"
                  value={equipmentForm.manufacturer}
                  onChange={handleFormChange}
                  fullWidth
                />
                <TextField
                  name="manufactureDate"
                  label="Manufacture Date"
                  type="date"
                  value={equipmentForm.manufactureDate}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  name="expiryDate"
                  label="Expiry Date"
                  type="date"
                  value={equipmentForm.expiryDate}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <div className="col-span-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={equipmentForm.isOccupied}
                        onChange={(e) =>
                          setEquipmentForm((prev) => ({
                            ...prev,
                            isOccupied: e.target.checked,
                          }))
                        }
                        name="isOccupied"
                      />
                    }
                    label="Is Occupied"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={equipmentForm.isActive}
                        onChange={(e) =>
                          setEquipmentForm((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        name="isActive"
                      />
                    }
                    label="Is Active"
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editMode ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MedicalEquipmentManagement;
