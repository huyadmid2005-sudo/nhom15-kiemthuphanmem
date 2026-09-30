import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstanceInventoryService from "../../utils/axiosInstanceInventoryService";
import { toast } from "react-toastify";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Chip,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import MedicationIcon from "@mui/icons-material/Medication";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const ExpiryAlerts = () => {
  const [medicineAlerts, setMedicineAlerts] = useState([]);
  const [equipmentAlerts, setEquipmentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchExpiryAlerts();
  }, []);

  const fetchExpiryAlerts = async () => {
    try {
      setLoading(true);

      // Fetch medicine expiry alerts
      const medicineResponse = await axiosInstanceInventoryService.get(
        "/medicine/alert-expiry"
      );
      const medicinesWithId = medicineResponse.data.map((medicine, index) => ({
        ...medicine,
        id: medicine.medicineId || index,
        type: "medicine",
      }));
      setMedicineAlerts(medicinesWithId);

      // Fetch medical equipment expiry alerts
      const equipmentResponse = await axiosInstanceInventoryService.get(
        "/medical-equipment/alert-expiry"
      );
      const equipmentWithId = equipmentResponse.data.map(
        (equipment, index) => ({
          ...equipment,
          id: equipment.medicalEquipmentId || index,
          type: "equipment",
        })
      );
      setEquipmentAlerts(equipmentWithId);
    } catch (error) {
      console.error("Error fetching expiry alerts:", error);
      toast.error("Failed to fetch expiry alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

    if (daysUntilExpiry < 0) {
      return { label: "Expired", color: "error", severity: "high" };
    } else if (daysUntilExpiry <= 7) {
      return { label: "Expires in 7 days", color: "error", severity: "high" };
    } else if (daysUntilExpiry <= 30) {
      return {
        label: "Expires in 30 days",
        color: "warning",
        severity: "medium",
      };
    } else if (daysUntilExpiry <= 90) {
      return { label: "Expires in 90 days", color: "info", severity: "low" };
    }
    return { label: "Normal", color: "success", severity: "normal" };
  };

  const medicineColumns = [
    { field: "medicineId", headerName: "ID", width: 80 },
    { field: "medicineName", headerName: "Medicine Name", width: 180 },
    { field: "genericName", headerName: "Generic Name", width: 150 },
    { field: "batchNo", headerName: "Batch No", width: 120 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "expiryDate", headerName: "Expiry Date", width: 120 },
    {
      field: "daysUntilExpiry",
      headerName: "Days Until Expiry",
      width: 150,
      renderCell: (params) => {
        const days = getDaysUntilExpiry(params.row.expiryDate);
        return (
          <span
            className={
              days < 0
                ? "text-red-600 font-bold"
                : days <= 30
                ? "text-orange-600 font-bold"
                : "text-gray-600"
            }
          >
            {days < 0 ? `Expired ${Math.abs(days)} days ago` : `${days} days`}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const status = getExpiryStatus(params.row.expiryDate);
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            icon={<WarningIcon />}
          />
        );
      },
    },
  ];

  const equipmentColumns = [
    { field: "medicalEquipmentId", headerName: "ID", width: 80 },
    { field: "medicalEquipmentName", headerName: "Equipment Name", width: 180 },
    { field: "medicalEquipmentType", headerName: "Type", width: 120 },
    { field: "manufacturer", headerName: "Manufacturer", width: 150 },
    { field: "expiryDate", headerName: "Expiry Date", width: 150 },
    {
      field: "daysUntilExpiry",
      headerName: "Days Until Expiry",
      width: 150,
      renderCell: (params) => {
        const days = getDaysUntilExpiry(params.row.expiryDate);
        return (
          <span
            className={
              days < 0
                ? "text-red-600 font-bold"
                : days <= 30
                ? "text-orange-600 font-bold"
                : "text-gray-600"
            }
          >
            {days < 0 ? `Expired ${Math.abs(days)} days ago` : `${days} days`}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const status = getExpiryStatus(params.row.expiryDate);
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            icon={<WarningIcon />}
          />
        );
      },
    },
  ];

  const getAlertCounts = () => {
    const medicineExpired = medicineAlerts.filter(
      (m) => getDaysUntilExpiry(m.expiryDate) < 0
    ).length;
    const medicineExpiringSoon = medicineAlerts.filter((m) => {
      const days = getDaysUntilExpiry(m.expiryDate);
      return days >= 0 && days <= 30;
    }).length;

    const equipmentExpired = equipmentAlerts.filter(
      (e) => getDaysUntilExpiry(e.expiryDate) < 0
    ).length;
    const equipmentExpiringSoon = equipmentAlerts.filter((e) => {
      const days = getDaysUntilExpiry(e.expiryDate);
      return days >= 0 && days <= 30;
    }).length;

    return {
      medicineExpired,
      medicineExpiringSoon,
      equipmentExpired,
      equipmentExpiringSoon,
    };
  };

  const alertCounts = getAlertCounts();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Expiry Alerts</h1>
            <button
              onClick={fetchExpiryAlerts}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Refresh Alerts
            </button>
          </div>

          {/* Alert Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-red-50 border-l-4 border-red-500">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="text-red-700">
                      {alertCounts.medicineExpired}
                    </Typography>
                    <Typography variant="body2" className="text-red-600">
                      Expired Medicines
                    </Typography>
                  </div>
                  <MedicationIcon className="text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-l-4 border-orange-500">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="text-orange-700">
                      {alertCounts.medicineExpiringSoon}
                    </Typography>
                    <Typography variant="body2" className="text-orange-600">
                      Medicines Expiring Soon
                    </Typography>
                  </div>
                  <MedicationIcon className="text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-l-4 border-red-500">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="text-red-700">
                      {alertCounts.equipmentExpired}
                    </Typography>
                    <Typography variant="body2" className="text-red-600">
                      Expired Equipment
                    </Typography>
                  </div>
                  <MedicalServicesIcon className="text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-l-4 border-orange-500">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="text-orange-700">
                      {alertCounts.equipmentExpiringSoon}
                    </Typography>
                    <Typography variant="body2" className="text-orange-600">
                      Equipment Expiring Soon
                    </Typography>
                  </div>
                  <MedicalServicesIcon className="text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Medicine and Equipment Alerts */}
          <Box className="bg-white rounded-lg shadow">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              className="border-b"
            >
              <Tab
                label={`Medicine Alerts (${medicineAlerts.length})`}
                icon={<MedicationIcon />}
                iconPosition="start"
              />
              <Tab
                label={`Equipment Alerts (${equipmentAlerts.length})`}
                icon={<MedicalServicesIcon />}
                iconPosition="start"
              />
            </Tabs>

            {/* Medicine Alerts Tab */}
            {tabValue === 0 && (
              <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={medicineAlerts}
                  columns={medicineColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  loading={loading}
                  disableSelectionOnClick
                  getRowClassName={(params) => {
                    const days = getDaysUntilExpiry(params.row.expiryDate);
                    if (days < 0) return "bg-red-50";
                    if (days <= 7) return "bg-red-50";
                    if (days <= 30) return "bg-orange-50";
                    return "";
                  }}
                />
              </div>
            )}

            {/* Equipment Alerts Tab */}
            {tabValue === 1 && (
              <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={equipmentAlerts}
                  columns={equipmentColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  loading={loading}
                  disableSelectionOnClick
                  getRowClassName={(params) => {
                    const days = getDaysUntilExpiry(params.row.expiryDate);
                    if (days < 0) return "bg-red-50";
                    if (days <= 7) return "bg-red-50";
                    if (days <= 30) return "bg-orange-50";
                    return "";
                  }}
                />
              </div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ExpiryAlerts;
