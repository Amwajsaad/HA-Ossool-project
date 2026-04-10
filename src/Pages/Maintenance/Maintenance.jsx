import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Maintenance.module.css";
import Modal from "../../components/Modal/Modal";
import { maintenanceSchema } from "./MaintenanceSchema";
import axios from "axios";

const defaultValues = {
  asset: "",
  date: "",
  cost: "",
  status: "Pending",
};

const API_URL = "https://ha-ossooll-back-production.up.railway.app/api/maintenance";

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

  // ✅ جلب البيانات من السيرفر
  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await axios.get(API_URL);
      setMaintenanceList(res.data);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    }
  };

  const filtered = useMemo(() => {
    return maintenanceList.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.asset?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q)
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
      asset: item.asset,
      date: item.date,
      cost: item.cost,
      status: item.status,
    });
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  // ✅ حذف من السيرفر
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMaintenance();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleReset = () => {
    alert("Reset disabled لأن البيانات الآن من السيرفر ✅");
  };

  // ✅ إضافة + تعديل
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      fetchMaintenance();
      closeModal();
    } catch (error) {
      console.error("Save error:", error);
    }
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

              <button className="ui-btn-primary" type="submit">
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
