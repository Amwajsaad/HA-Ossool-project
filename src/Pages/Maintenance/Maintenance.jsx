import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Maintenance.module.css";
import Modal from "../../components/Modal/Modal";
import { maintenanceSchema } from "./MaintenanceSchema";
import { authFetch } from "../../services/AuthService";

const defaultValues = {
  asset: "",
  date: "",
  cost: "",
  status: "Pending",
};

const API_URL = "http://localhost:5100/api/Maintenance";

const Maintenance = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);
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
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
    const res = await authFetch("/api/Maintenance");
const data = await res.json();
setMaintenanceList(data);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    }
  };

  const filtered = useMemo(() => {
    return maintenanceList.filter((item) => {
      const q = search.toLowerCase();
      return (
        String(item.storage?.name ?? "").toLowerCase().includes(q)||
        String(item.id ?? "").toLowerCase().includes(q) ||
        String(item.cost ?? "").toLowerCase().includes(q)
      );
    });
  }, [maintenanceList, search]);

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
      asset: item.storage?.name || "",
      date: item.date ? item.date.split("T")[0] : "",
      cost: item.cost,
      status: "Pending",
    });
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
     await authFetch(`/api/Maintenance/${id}`, {
  method: "DELETE",
});
      await fetchMaintenance();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleReset = () => {
    alert("Reset disabled لأن البيانات الآن من السيرفر ✅");
  };

const onSubmit = async (data) => {
  try {
    const payload = {
      date: data.date,
      cost: Number(data.cost),
      storageId: 1
    };

    if (editingId) {
     await authFetch(`/api/Maintenance/${editingId}`, {
  method: "PUT",
  body: JSON.stringify(payload),
});
    } else {
      await authFetch("/api/Maintenance", {
  method: "POST",
  body: JSON.stringify(payload),
});
    }

    await fetchMaintenance();
    closeModal();
  } catch (error) {
    console.error("Save error:", error.response?.data || error);
  }
};

  const getStatusClass = () => {
    return "ui-warning";
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
                  <td>{item.storage?.name || "Main Storage"}</td>
                  <td>{item.date ? item.date.split("T")[0] : ""}</td>
                  <td>${item.cost}</td>
                  <td>
                    <span className={`ui-badge ${getStatusClass()}`}>
                      Pending
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className="ui-btn-icon"
                        onClick={() => openEditModal(item)}
                        type="button"
                      >
                        ✏️
                      </button>

                      <button
                        className="ui-btn-icon"
                        onClick={() => handleDelete(item.id)}
                        type="button"
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
                  No maintenance found
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
                  {...register("asset")}
                />
                {errors.asset && (
                  <span className={styles.errorText}>{errors.asset.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Date</label>
                <input type="date" className="ui-input" {...register("date")} />
              </div>

              <div className={styles.formGroup}>
                <label>Cost</label>
                <input className="ui-input" {...register("cost")} />
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
              <button className="ui-btn-secondary" onClick={closeModal} type="button">
                Cancel
              </button>

              <button className="ui-btn-primary" type="submit" disabled={isSubmitting}>
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Maintenance;