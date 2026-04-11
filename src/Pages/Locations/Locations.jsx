import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Locations.module.css";
import Modal from "../../components/Modal/Modal";
import { locationsSchema } from "./LocationsSchema";
import Swal from "sweetalert2";

const initialLocations = [
  {
    id: "L001",
    name: "Main Office",
    city: "Taif",
    assets: 35,
    departments: 4,
    status: "Active",
  },
  {
    id: "L002",
    name: "Branch A",
    city: "Jeddah",
    assets: 22,
    departments: 3,
    status: "Inactive",
  },
  {
    id: "L003",
    name: "Warehouse",
    city: "Riyadh",
    assets: 18,
    departments: 2,
    status: "Active",
  },
  {
    id: "L004",
    name: "Service Center",
    city: "Makkah",
    assets: 11,
    departments: 1,
    status: "Active",
  },
];

const STORAGE_KEY = "locations_data";

const defaultValues = {
  name: "",
  city: "",
  assets: "",
  departments: "",
  status: "Active",
};

const Locations = () => {
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialLocations;
  });

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(locationsSchema),
    mode: "all",
    defaultValues,
  });

  const swalButtons = {
    confirmButtonColor: "#c62828",
    cancelButtonColor: "#9e9e9e",
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  }, [locations]);

  const filtered = useMemo(() => {
    return locations.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
      );
    });
  }, [locations, search]);

  const resetFormState = () => {
    reset(defaultValues);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (location) => {
    reset({
      name: location.name,
      city: location.city,
      assets: String(location.assets),
      departments: String(location.departments),
      status: location.status,
    });
    setEditingId(location.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This location will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    setLocations((prev) => prev.filter((item) => item.id !== id));

    Swal.fire({
      title: "Deleted!",
      text: "Location deleted successfully.",
      icon: "success",
      confirmButtonColor: "#c62828",
    });
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Reset Locations?",
      text: "This will restore the default locations list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    setLocations(initialLocations);
    localStorage.removeItem(STORAGE_KEY);

    Swal.fire({
      title: "Reset Done!",
      text: "Locations restored successfully.",
      icon: "success",
      confirmButtonColor: "#c62828",
    });
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        setLocations((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: data.name.trim(),
                  city: data.city.trim(),
                  assets: Number(data.assets),
                  departments: Number(data.departments),
                  status: data.status,
                }
              : item
          )
        );
      } else {
        const nextIdNumber = locations.length + 1;

        const newLocation = {
          id: `L${String(nextIdNumber).padStart(3, "0")}`,
          name: data.name.trim(),
          city: data.city.trim(),
          assets: Number(data.assets),
          departments: Number(data.departments),
          status: data.status,
        };

        setLocations((prev) => [newLocation, ...prev]);
      }

      closeModal();

      Swal.fire({
        title: "Success!",
        text: editingId
          ? "Location updated successfully."
          : "Location added successfully.",
        icon: "success",
        confirmButtonColor: "#c62828",
      });
    } catch (error) {
      console.error("Save error:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while saving.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const getStatusClass = (status) => {
    return status === "Active" ? "ui-success" : "ui-danger";
  };

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Locations</h2>
          <p className="ui-subtitle">Manage company branches and locations.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset} type="button">
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal} type="button">
            ➕ Add Location
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={`ui-input ${styles.searchInput}`}
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ui-table-card">
        <table className="ui-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>Assets</th>
              <th>Departments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.city}</td>
                  <td>{item.assets}</td>
                  <td>{item.departments}</td>
                  <td>
                    <span className={`ui-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className="ui-btn-icon"
                        onClick={() => openEditModal(item)}
                        type="button"
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        className="ui-btn-icon"
                        onClick={() => handleDelete(item.id)}
                        type="button"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="ui-empty">
                  No locations found — start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Location" : "Add Location"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.modalGrid}>
              <div className={styles.formGroup}>
                <label>Location Name</label>
                <input
                  className={`ui-input ${errors.name ? styles.inputError : ""}`}
                  placeholder="Location name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>City</label>
                <input
                  className={`ui-input ${errors.city ? styles.inputError : ""}`}
                  placeholder="City"
                  {...register("city")}
                />
                {errors.city && (
                  <span className={styles.errorText}>{errors.city.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Assets Count</label>
                <input
                  className={`ui-input ${errors.assets ? styles.inputError : ""}`}
                  type="number"
                  placeholder="0"
                  {...register("assets")}
                />
                {errors.assets && (
                  <span className={styles.errorText}>{errors.assets.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Departments Count</label>
                <input
                  className={`ui-input ${errors.departments ? styles.inputError : ""}`}
                  type="number"
                  placeholder="0"
                  {...register("departments")}
                />
                {errors.departments && (
                  <span className={styles.errorText}>
                    {errors.departments.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroupFull}>
                <label>Status</label>
                <select className="ui-input" {...register("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className="ui-btn-secondary"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>

              <button
                className="ui-btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Update Location"
                  : "Save Location"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Locations;