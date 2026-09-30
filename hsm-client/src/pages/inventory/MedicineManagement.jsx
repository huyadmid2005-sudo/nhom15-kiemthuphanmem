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

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");

  const [medicineForm, setMedicineForm] = useState({
    medicineName: "",
    genericName: "",
    manufacturer: "",
    medicineType: "",
    manufactureDate: "",
    expiryDate: "",
    isOccupied: false,
    isActive: true,
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanceInventoryService.get(
        "/medicine/get-all"
      );
      const medicinesWithId = response.data.map((medicine, index) => ({
        ...medicine,
        id: medicine.medicineId || index,
      }));
      setMedicines(medicinesWithId);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchMedicines();
      return;
    }

    try {
      setLoading(true);
      let response;
      switch (searchType) {
        case "name":
          response = await axiosInstanceInventoryService.get(
            `/medicine/search/name/${searchTerm}`
          );
          break;
        case "manufacturer":
          response = await axiosInstanceInventoryService.get(
            `/medicine/search/manufacturer/${searchTerm}`
          );
          break;
        case "genericName":
          response = await axiosInstanceInventoryService.get(
            `/medicine/search/generic-name/${searchTerm}`
          );
          break;
        default:
          response = await axiosInstanceInventoryService.get(
            "/medicine/get-all"
          );
      }

      const medicinesWithId = response.data.map((medicine, index) => ({
        ...medicine,
        id: medicine.medicineId || index,
      }));
      setMedicines(medicinesWithId);
    } catch (error) {
      console.error("Error searching medicines:", error);
      toast.error("Failed to search medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (medicine = null) => {
    if (medicine) {
      setEditMode(true);
      setSelectedMedicine(medicine);
      setMedicineForm({
        medicineName: medicine.medicineName || "",
        genericName: medicine.genericName || "",
        manufacturer: medicine.manufacturer || "",
        medicineType: medicine.medicineType || "",
        manufactureDate: medicine.manufactureDate || "",
        expiryDate: medicine.expiryDate || "",
        isOccupied: medicine.isOccupied || false,
        isActive: medicine.isActive !== undefined ? medicine.isActive : true,
      });
    } else {
      setEditMode(false);
      setSelectedMedicine(null);
      setMedicineForm({
        medicineName: "",
        genericName: "",
        manufacturer: "",
        medicineType: "",
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
    setSelectedMedicine(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMedicineForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        const updateData = {
          ...medicineForm,
          medicineId: selectedMedicine.medicineId,
        };
        await axiosInstanceInventoryService.put("/medicine/update", updateData);
        toast.success("Medicine updated successfully!");
      } else {
        await axiosInstanceInventoryService.post(
          "/medicine/create",
          medicineForm
        );
        toast.success("Medicine created successfully!");
      }
      handleCloseDialog();
      fetchMedicines();
    } catch (error) {
      console.error("Error saving medicine:", error);
      toast.error(error?.response?.data?.message || "Failed to save medicine");
    }
  };

  const handleDelete = async (medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axiosInstanceInventoryService.delete(
          `/medicine/delete/${medicineId}`
        );
        toast.success("Medicine deleted successfully!");
        fetchMedicines();
      } catch (error) {
        console.error("Error deleting medicine:", error);
        toast.error("Failed to delete medicine");
      }
    }
  };

  const columns = [
    { field: "medicineId", headerName: "ID", width: 80 },
    { field: "medicineName", headerName: "Medicine Name", width: 150 },
    { field: "genericName", headerName: "Generic Name", width: 150 },
    { field: "manufacturer", headerName: "Manufacturer", width: 130 },
    { field: "medicineType", headerName: "Type", width: 100 },
    { field: "manufactureDate", headerName: "Manufacture Date", width: 120 },
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
            onClick={() => handleDelete(params.row.medicineId)}
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
              Medicine Management
            </h1>
            <button
              onClick={() => handleOpenDialog()}
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <AddIcon /> Add Medicine
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
                  <MenuItem value="genericName">Generic Name</MenuItem>
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
                  fetchMedicines();
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
              rows={medicines}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              loading={loading}
              disableSelectionOnClick
            />
          </div>

          {/* Add/Edit Medicine Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {editMode ? "Edit Medicine" : "Add New Medicine"}
            </DialogTitle>
            <DialogContent>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextField
                  name="medicineName"
                  label="Medicine Name"
                  value={medicineForm.medicineName}
                  onChange={handleFormChange}
                  required
                  fullWidth
                />
                <TextField
                  name="genericName"
                  label="Generic Name"
                  value={medicineForm.genericName}
                  onChange={handleFormChange}
                  fullWidth
                />
                <TextField
                  name="manufacturer"
                  label="Manufacturer"
                  value={medicineForm.manufacturer}
                  onChange={handleFormChange}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Medicine Type</InputLabel>
                  <Select
                    name="medicineType"
                    value={medicineForm.medicineType}
                    onChange={handleFormChange}
                    label="Medicine Type"
                  >
                    <MenuItem value="Tablet">Tablet</MenuItem>
                    <MenuItem value="Capsule">Capsule</MenuItem>
                    <MenuItem value="Syrup">Syrup</MenuItem>
                    <MenuItem value="Injection">Injection</MenuItem>
                    <MenuItem value="Ointment">Ointment</MenuItem>
                    <MenuItem value="Drop">Drop</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  name="manufactureDate"
                  label="Manufacture Date"
                  type="date"
                  value={medicineForm.manufactureDate}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  name="expiryDate"
                  label="Expiry Date"
                  type="date"
                  value={medicineForm.expiryDate}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <div className="col-span-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={medicineForm.isOccupied}
                        onChange={(e) =>
                          setMedicineForm((prev) => ({
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
                        checked={medicineForm.isActive}
                        onChange={(e) =>
                          setMedicineForm((prev) => ({
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

export default MedicineManagement;
