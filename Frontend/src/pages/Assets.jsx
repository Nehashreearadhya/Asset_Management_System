import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Assets.css";

function Assets() {

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterType, setFilterType] = useState("All");

    const [formData, setFormData] = useState({
        assetName: "",
        assetCode: "",
        assetType: "",
        serialNumber: "",
        brand: "",
        model: "",
        purchaseDate: "",
        purchasePrice: "",
        warrantyExpiry: "",
        location: ""
    });


    // ==========================================
    // GET ASSETS
    // ==========================================

    useEffect(() => {
        getAssets();
    }, []);


    const getAssets = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/asset/getAsset"
            );

            setAssets(
                response.data.assets || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load assets"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setFormData({
            assetName: "",
            assetCode: "",
            assetType: "",
            serialNumber: "",
            brand: "",
            model: "",
            purchaseDate: "",
            purchasePrice: "",
            warrantyExpiry: "",
            location: ""
        });

        setEditingAsset(null);

    };


    // ==========================================
    // CREATE / UPDATE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !formData.assetName.trim() ||
            !formData.assetCode.trim() ||
            !formData.assetType ||
            !formData.serialNumber.trim() ||
            !formData.brand.trim() ||
            !formData.model.trim() ||
            !formData.purchaseDate ||
            formData.purchasePrice === "" ||
            !formData.location.trim()
        ) {

            setError(
                "Please fill all required asset details"
            );

            return;
        }


        try {

            const assetData = {

                assetName:
                    formData.assetName.trim(),

                assetCode:
                    formData.assetCode.trim(),

                assetType:
                    formData.assetType,

                serialNumber:
                    formData.serialNumber.trim(),

                brand:
                    formData.brand.trim(),

                model:
                    formData.model.trim(),

                purchaseDate:
                    formData.purchaseDate,

                purchasePrice:
                    Number(formData.purchasePrice),

                location:
                    formData.location.trim()

            };


            if (formData.warrantyExpiry) {

                assetData.warrantyExpiry =
                    formData.warrantyExpiry;

            }


            if (editingAsset) {

                await api.put(
                    `/asset/updateAsset/${editingAsset._id}`,
                    assetData
                );

                setSuccess(
                    "Asset updated successfully"
                );

            } else {

                await api.post(
                    "/asset/create",
                    assetData
                );

                setSuccess(
                    "Asset created successfully"
                );

            }


            setShowForm(false);

            resetForm();

            await getAssets();


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save asset"
            );

        }

    };


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (asset) => {

        setEditingAsset(asset);

        setFormData({

            assetName:
                asset.assetName || "",

            assetCode:
                asset.assetCode || "",

            assetType:
                asset.assetType || "",

            serialNumber:
                asset.serialNumber || "",

            brand:
                asset.brand || "",

            model:
                asset.model || "",

            purchaseDate:
                asset.purchaseDate
                    ? asset.purchaseDate.substring(0, 10)
                    : "",

            purchasePrice:
                asset.purchasePrice ?? "",

            warrantyExpiry:
                asset.warrantyExpiry
                    ? asset.warrantyExpiry.substring(0, 10)
                    : "",

            location:
                asset.location || ""

        });

        setError("");
        setSuccess("");

        setShowForm(true);

    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this asset?"
            );

        if (!confirmDelete) return;


        try {

            setError("");

            await api.delete(
                `/asset/deleteAsset/${id}`
            );

            setSuccess(
                "Asset deleted successfully"
            );

            await getAssets();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete asset"
            );

        }

    };


    // ==========================================
    // FILTER
    // ==========================================

    const filteredAssets = assets.filter(
        (asset) => {

            const searchText =
                search.toLowerCase();

            const matchesSearch =
                asset.assetName
                    ?.toLowerCase()
                    .includes(searchText) ||

                asset.assetCode
                    ?.toLowerCase()
                    .includes(searchText) ||

                asset.serialNumber
                    ?.toLowerCase()
                    .includes(searchText) ||

                asset.brand
                    ?.toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                filterStatus === "All" ||
                asset.status === filterStatus;


            const matchesType =
                filterType === "All" ||
                asset.assetType === filterType;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            );

        }
    );


    // ==========================================
    // COUNTS
    // ==========================================

    const totalAssets = assets.length;

    const availableAssets =
        assets.filter(
            asset => asset.status === "Available"
        ).length;

    const assignedAssets =
        assets.filter(
            asset => asset.status === "Assigned"
        ).length;

    const repairAssets =
        assets.filter(
            asset => asset.status === "Under Repair"
        ).length;


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="assets-loading">

                <div className="loader"></div>

                <p>
                    Loading assets...
                </p>

            </div>
        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="assets-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="assets-header">

                <div>

                    <span className="page-label">
                        ASSET MANAGEMENT
                    </span>

                    <h1>
                        Assets
                    </h1>

                    <p>
                        Manage and monitor all company assets
                    </p>

                </div>


                <button
                    className="add-asset-btn"
                    onClick={() => {

                        resetForm();

                        setError("");

                        setShowForm(true);

                    }}
                >
                    <span>+</span>
                    Add Asset
                </button>

            </div>


            {/* ==================================
                ALERTS
            ================================== */}

            {success && (

                <div className="alert success-alert">
                    ✓ {success}
                </div>

            )}


            {error && (

                <div className="alert error-alert">
                    ⚠ {error}
                </div>

            )}


            {/* ==================================
                SUMMARY CARDS
            ================================== */}

            <div className="asset-summary">

                <div className="summary-card">

                    <div className="summary-icon">
                        ◈
                    </div>

                    <div>

                        <span>
                            Total Assets
                        </span>

                        <strong>
                            {totalAssets}
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon available-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Available
                        </span>

                        <strong>
                            {availableAssets}
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon assigned-icon">
                        ↗
                    </div>

                    <div>

                        <span>
                            Assigned
                        </span>

                        <strong>
                            {assignedAssets}
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon repair-icon">
                        ⚙
                    </div>

                    <div>

                        <span>
                            Under Repair
                        </span>

                        <strong>
                            {repairAssets}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================
                FILTER BAR
            ================================== */}

            <div className="asset-toolbar">

                <div className="search-box">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={search}
                        onChange={
                            e =>
                                setSearch(
                                    e.target.value
                                )
                        }
                    />

                </div>


                <select
                    value={filterStatus}
                    onChange={
                        e =>
                            setFilterStatus(
                                e.target.value
                            )
                    }
                >

                    <option value="All">
                        All Status
                    </option>

                    <option value="Available">
                        Available
                    </option>

                    <option value="Assigned">
                        Assigned
                    </option>

                    <option value="Under Repair">
                        Under Repair
                    </option>

                    <option value="Lost">
                        Lost
                    </option>

                    <option value="Retired">
                        Retired
                    </option>

                    <option value="Disposed">
                        Disposed
                    </option>

                </select>


                <select
                    value={filterType}
                    onChange={
                        e =>
                            setFilterType(
                                e.target.value
                            )
                    }
                >

                    <option value="All">
                        All Types
                    </option>

                    <option value="Laptop">
                        Laptop
                    </option>

                    <option value="Desktop">
                        Desktop
                    </option>

                    <option value="Monitor">
                        Monitor
                    </option>

                    <option value="Mobile">
                        Mobile
                    </option>

                    <option value="Printer">
                        Printer
                    </option>

                    <option value="Keyboard">
                        Keyboard
                    </option>

                    <option value="Mouse">
                        Mouse
                    </option>

                    <option value="Furniture">
                        Furniture
                    </option>

                    <option value="Other">
                        Other
                    </option>

                </select>

            </div>


            {/* ==================================
                TABLE
            ================================== */}

            <div className="assets-table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            All Assets
                        </h2>

                        <span>
                            {filteredAssets.length} assets
                        </span>

                    </div>

                </div>


                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ASSET
                                </th>

                                <th>
                                    TYPE
                                </th>

                                <th>
                                    SERIAL NUMBER
                                </th>

                                <th>
                                    BRAND / MODEL
                                </th>

                                <th>
                                    LOCATION
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredAssets.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="no-assets"
                                    >

                                        <div>
                                            ◇
                                        </div>

                                        <strong>
                                            No assets found
                                        </strong>

                                        <p>
                                            Try changing your search or filters.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredAssets.map(
                                    asset => (

                                        <tr
                                            key={
                                                asset._id
                                            }
                                        >

                                            {/* ASSET */}

                                            <td>

                                                <div className="asset-info">

                                                    <div className="asset-avatar">
                                                        {asset.assetType
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                asset.assetName
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                asset.assetCode
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* TYPE */}

                                            <td>

                                                <span className="type-badge">

                                                    {
                                                        asset.assetType
                                                    }

                                                </span>

                                            </td>


                                            {/* SERIAL */}

                                            <td>

                                                <span className="serial-number">

                                                    {
                                                        asset.serialNumber
                                                    }

                                                </span>

                                            </td>


                                            {/* BRAND MODEL */}

                                            <td>

                                                <div className="brand-model">

                                                    <strong>
                                                        {
                                                            asset.brand
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            asset.model
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* LOCATION */}

                                            <td>

                                                <span className="location-text">

                                                    ◉{" "}

                                                    {
                                                        asset.location
                                                    }

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `status-badge ${asset.status
                                                            ?.toLowerCase()
                                                            .replace(/\s+/g, "-")}`
                                                    }
                                                >

                                                    <span className="status-dot">
                                                    </span>

                                                    {
                                                        asset.status
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                asset
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                asset._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================
                ADD / EDIT MODAL
            ================================== */}

            {showForm && (

                <div
                    className="modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            setShowForm(false);
                        }

                    }}
                >

                    <div className="asset-modal">


                        <div className="modal-header">

                            <div>

                                <span>
                                    ASSET DETAILS
                                </span>

                                <h2>

                                    {editingAsset
                                        ? "Edit Asset"
                                        : "Add New Asset"}

                                </h2>

                            </div>


                            <button
                                className="close-modal"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="form-grid">


                                {/* NAME */}

                                <div className="input-group">

                                    <label>
                                        Asset Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="assetName"
                                        placeholder="Dell Latitude 5420"
                                        value={
                                            formData.assetName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* CODE */}

                                <div className="input-group">

                                    <label>
                                        Asset Code *
                                    </label>

                                    <input
                                        type="text"
                                        name="assetCode"
                                        placeholder="AST-LAP-002"
                                        value={
                                            formData.assetCode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* TYPE */}

                                <div className="input-group">

                                    <label>
                                        Asset Type *
                                    </label>

                                    <select
                                        name="assetType"
                                        value={
                                            formData.assetType
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select type
                                        </option>

                                        <option value="Laptop">
                                            Laptop
                                        </option>

                                        <option value="Desktop">
                                            Desktop
                                        </option>

                                        <option value="Monitor">
                                            Monitor
                                        </option>

                                        <option value="Mobile">
                                            Mobile
                                        </option>

                                        <option value="Printer">
                                            Printer
                                        </option>

                                        <option value="Keyboard">
                                            Keyboard
                                        </option>

                                        <option value="Mouse">
                                            Mouse
                                        </option>

                                        <option value="Furniture">
                                            Furniture
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                {/* SERIAL */}

                                <div className="input-group">

                                    <label>
                                        Serial Number *
                                    </label>

                                    <input
                                        type="text"
                                        name="serialNumber"
                                        placeholder="DL5420-12346"
                                        value={
                                            formData.serialNumber
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* BRAND */}

                                <div className="input-group">

                                    <label>
                                        Brand *
                                    </label>

                                    <input
                                        type="text"
                                        name="brand"
                                        placeholder="Dell"
                                        value={
                                            formData.brand
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* MODEL */}

                                <div className="input-group">

                                    <label>
                                        Model *
                                    </label>

                                    <input
                                        type="text"
                                        name="model"
                                        placeholder="Latitude 5420"
                                        value={
                                            formData.model
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* PURCHASE DATE */}

                                <div className="input-group">

                                    <label>
                                        Purchase Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="purchaseDate"
                                        value={
                                            formData.purchaseDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* PRICE */}

                                <div className="input-group">

                                    <label>
                                        Purchase Price *
                                    </label>

                                    <input
                                        type="number"
                                        name="purchasePrice"
                                        placeholder="75000"
                                        min="0"
                                        step="0.01"
                                        value={
                                            formData.purchasePrice
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* WARRANTY */}

                                <div className="input-group">

                                    <label>
                                        Warranty Expiry
                                    </label>

                                    <input
                                        type="date"
                                        name="warrantyExpiry"
                                        value={
                                            formData.warrantyExpiry
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                {/* LOCATION */}

                                <div className="input-group">

                                    <label>
                                        Location *
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="IT Department"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-btn"
                                >

                                    {editingAsset
                                        ? "Update Asset"
                                        : "Create Asset"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Assets;