import React, { useEffect, useMemo, useState } from "react";
import styles from "./Locations.module.css";
import Modal from "../../components/Modal/Modal";

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

const emptyForm = {
  name: "",
  city: "",
  assets: "",
  departments: "",
  status: "Active",
};

const emptyErrors = {
  name: "",
  city: "",
  assets: "",
  departments: "",
};

const Locations = () => {
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialLocations;
  });

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);

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
    setForm(emptyForm);
    setErrors(emptyErrors);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (location) => {
    setForm({
      name: location.name,
      city: location.city,
      assets: String(location.assets),
      departments: String(location.departments),
      status: location.status,
    });
    setErrors(emptyErrors);
    setEditingId(location.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this location?"
    );
    if (!confirmDelete) return;

    setLocations((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "This will reset locations to the default list. Continue?"
    );
    if (!confirmReset) return;

    setLocations(initialLocations);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = { ...emptyErrors };

    if (!form.name.trim()) {
      newErrors.name = "Location name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Location name must be at least 2 characters.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!form.assets.trim()) {
      newErrors.assets = "Assets count is required.";
    } else if (Number(form.assets) < 0) {
      newErrors.assets = "Assets count must be 0 or more.";
    }

    if (!form.departments.trim()) {
      newErrors.departments = "Departments count is required.";
    } else if (Number(form.departments) < 0) {
      newErrors.departments = "Departments count must be 0 or more.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((value) => value === "");
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setLocations((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                city: form.city.trim(),
                assets: Number(form.assets),
                departments: Number(form.departments),
                status: form.status,
              }
            : item
        )
      );
    } else {
      const nextIdNumber = locations.length + 1;
      const newLocation = {
        id: `L${String(nextIdNumber).padStart(3, "0")}`,
        name: form.name.trim(),
        city: form.city.trim(),
        assets: Number(form.assets),
        departments: Number(form.departments),
        status: form.status,
      };

      setLocations((prev) => [newLocation, ...prev]);
    }

    closeModal();
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
          <button className="ui-btn-secondary" onClick={handleReset}>
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal}>
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
          <div className={styles.modalGrid}>
            <div className={styles.formGroup}>
              <label>Location Name</label>
              <input
                className={`ui-input ${errors.name ? styles.inputError : ""}`}
                name="name"
                placeholder="Location name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>City</label>
              <input
                className={`ui-input ${errors.city ? styles.inputError : ""}`}
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
              {errors.city && <span className={styles.errorText}>{errors.city}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Assets Count</label>
              <input
                className={`ui-input ${errors.assets ? styles.inputError : ""}`}
                name="assets"
                type="number"
                placeholder="0"
                value={form.assets}
                onChange={handleChange}
              />
              {errors.assets && (
                <span className={styles.errorText}>{errors.assets}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Departments Count</label>
              <input
                className={`ui-input ${
                  errors.departments ? styles.inputError : ""
                }`}
                name="departments"
                type="number"
                placeholder="0"
                value={form.departments}
                onChange={handleChange}
              />
              {errors.departments && (
                <span className={styles.errorText}>{errors.departments}</span>
              )}
            </div>

            <div className={styles.formGroupFull}>
              <label>Status</label>
              <select
                className="ui-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button className="ui-btn-secondary" onClick={closeModal} type="button">
              Cancel
            </button>

            <button className="ui-btn-primary" onClick={handleSave} type="button">
              {editingId ? "Update Location" : "Save Location"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Locations;