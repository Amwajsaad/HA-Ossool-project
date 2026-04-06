import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Maintenance.module.css";
import Modal from "../../components/Modal/Modal";
import { maintenanceSchema } from "./MaintenanceSchema";

const initialMaintenance = [
  {
    id: "M001",
    asset: "AC Unit",
    date: "2026-02-12",
    cost: "$250",
    status: "Completed",
  },
  {
    id: "M002",
    asset: "Printer",
    date: "2026-02-10",
    cost: "$180",
    status: "Pending",
  },
  {
    id: "M003",
    asset: "Projector",
    date: "2026-02-08",
    cost: "$120",
    status: "In Progress",
  },
  {
    id: "M004",
    asset: "Camera",
    date: "2026-02-05",
    cost: "$90",
    status: "Completed",
  },
];

const STORAGE_KEY = "maintenance_data";

const defaultValues = {
  asset: "",
  date: "",
  cost: "",
  status: "Pending",
};

const Maintenance = () => {
  const [maintenanceList, setMaintenanceList] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialMaintenance;
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
    resolver: zodResolver(maintenanceSchema),
    mode: "all",
    defaultValues,
  });

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

  const normalizeCost = (value) => {
    const trimmed = value.trim();
    return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
  };

  const resetFormState = () => {
    reset(defaultValues);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (item) => {
    reset({
      asset: item.asset,
      date: item.date,
      cost: item.cost.replace("$", ""),
      status: item.status,
    });
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

  const onSubmit = async (data) => {
    console.log("Maintenance Data:", data);

    if (editingId) {
      setMaintenanceList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                asset: data.asset.trim(),
                date: data.date,
                cost: normalizeCost(data.cost),
                status: data.status,
              }
            : item
        )
      );
    } else {
      const nextIdNumber = maintenanceList.length + 1;

      const newItem = {
        id: `M${String(nextIdNumber).padStart(3, "0")}`,
        asset: data.asset.trim(),
        date: data.date,
        cost: normalizeCost(data.cost),
        status: data.status,
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
          <button className="ui-btn-secondary" onClick={handleReset} type="button">
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal} type="button">
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.modalGrid}>
              <div className={styles.formGroup}>
                <label>Asset Name</label>
                <input
                  className={`ui-input ${errors.asset ? styles.inputError : ""}`}
                  placeholder="Asset name"
                  {...register("asset")}
                />
                {errors.asset && (
                  <span className={styles.errorText}>{errors.asset.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  className={`ui-input ${errors.date ? styles.inputError : ""}`}
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <span className={styles.errorText}>{errors.date.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Cost</label>
                <input
                  className={`ui-input ${errors.cost ? styles.inputError : ""}`}
                  placeholder="$120"
                  {...register("cost")}
                />
                {errors.cost && (
                  <span className={styles.errorText}>{errors.cost.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Status</label>
                <select className="ui-input" {...register("status")}>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
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
                {editingId ? "Update Maintenance" : "Save Maintenance"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Maintenance;