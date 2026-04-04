import React, { useEffect, useMemo, useState } from "react";
import styles from "./Maintenance.module.css";
import Modal from "../../components/Modal/Modal";

const initialMaintenance = [
  {
    id: "M001",
    asset: "AC Unit",
    date: "12/02/2026",
    cost: "$250",
    status: "Completed",
  },
  {
    id: "M002",
    asset: "Printer",
    date: "10/02/2026",
    cost: "$180",
    status: "Pending",
  },
  {
    id: "M003",
    asset: "Projector",
    date: "08/02/2026",
    cost: "$120",
    status: "In Progress",
  },
  {
    id: "M004",
    asset: "Camera",
    date: "05/02/2026",
    cost: "$90",
    status: "Completed",
  },
];

const STORAGE_KEY = "maintenance_data";

const emptyForm = {
  asset: "",
  date: "",
  cost: "",
  status: "Pending",
};

const emptyErrors = {
  asset: "",
  date: "",
  cost: "",
};

const Maintenance = () => {
  const [maintenanceList, setMaintenanceList] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialMaintenance;
  });

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(maintenanceList));
  }, [maintenanceList]);

  const filtered = useMemo(() => {
    return maintenanceList.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.asset.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
      );
    });
  }, [maintenanceList, search]);

  const resetFormState = () => {
    setForm(emptyForm);
    setErrors(emptyErrors);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (item) => {
    setForm({
      asset: item.asset,
      date: item.date,
      cost: item.cost,
      status: item.status,
    });
    setErrors(emptyErrors);
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this maintenance record?"
    );
    if (!confirmDelete) return;

    setMaintenanceList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "This will reset maintenance data to the default list. Continue?"
    );
    if (!confirmReset) return;

    setMaintenanceList(initialMaintenance);
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

    if (!form.asset.trim()) {
      newErrors.asset = "Asset name is required.";
    }

    if (!form.date.trim()) {
      newErrors.date = "Date is required.";
    } else if (
      !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
        form.date.trim()
      )
    ) {
      newErrors.date = "Use date format DD/MM/YYYY.";
    }

    if (!form.cost.trim()) {
      newErrors.cost = "Cost is required.";
    } else if (!/^\$?\d+(\.\d+)?$/.test(form.cost.trim())) {
      newErrors.cost = "Enter a valid cost like 120 or $120.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((value) => value === "");
  };

  const normalizeCost = (value) => {
    const trimmed = value.trim();
    return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setMaintenanceList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                asset: form.asset.trim(),
                date: form.date.trim(),
                cost: normalizeCost(form.cost),
                status: form.status,
              }
            : item
        )
      );
    } else {
      const nextIdNumber = maintenanceList.length + 1;
      const newItem = {
        id: `M${String(nextIdNumber).padStart(3, "0")}`,
        asset: form.asset.trim(),
        date: form.date.trim(),
        cost: normalizeCost(form.cost),
        status: form.status,
      };

      setMaintenanceList((prev) => [newItem, ...prev]);
    }

    closeModal();
  };

  const getStatusClass = (status) => {
    if (status === "Completed") return "ui-success";
    if (status === "Pending") return "ui-warning";
    return "ui-danger";
  };

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Maintenance</h2>
          <p className="ui-subtitle">Manage and track maintenance operations.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset}>
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal}>
            ➕ Add
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={`ui-input ${styles.searchInput}`}
          placeholder="Search maintenance..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ui-table-card">
        <table className="ui-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset</th>
              <th>Date</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.asset}</td>
                  <td>{item.date}</td>
                  <td>{item.cost}</td>
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
                <td colSpan="6" className="ui-empty">
                  No maintenance found — start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Maintenance" : "Add Maintenance"}
          onClose={closeModal}
        >
          <div className={styles.modalGrid}>
            <div className={styles.formGroup}>
              <label>Asset Name</label>
              <input
                className={`ui-input ${errors.asset ? styles.inputError : ""}`}
                name="asset"
                placeholder="Asset name"
                value={form.asset}
                onChange={handleChange}
              />
              {errors.asset && (
                <span className={styles.errorText}>{errors.asset}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Date</label>
              <input
                className={`ui-input ${errors.date ? styles.inputError : ""}`}
                name="date"
                placeholder="DD/MM/YYYY"
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && (
                <span className={styles.errorText}>{errors.date}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Cost</label>
              <input
                className={`ui-input ${errors.cost ? styles.inputError : ""}`}
                name="cost"
                placeholder="$120"
                value={form.cost}
                onChange={handleChange}
              />
              {errors.cost && (
                <span className={styles.errorText}>{errors.cost}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Status</label>
              <select
                className="ui-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button className="ui-btn-secondary" onClick={closeModal} type="button">
              Cancel
            </button>

            <button className="ui-btn-primary" onClick={handleSave} type="button">
              {editingId ? "Update Maintenance" : "Save Maintenance"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Maintenance;