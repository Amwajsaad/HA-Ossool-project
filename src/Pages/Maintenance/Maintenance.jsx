import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Maintenance.module.css";
import Modal from "../../components/Modal/Modal";
import { maintenanceSchema } from "./MaintenanceSchema";
import { authFetch } from "../../services/AuthService";
import Swal from "sweetalert2";

const defaultValues = {
  date: "",
  cost: "",
  status: "Pending",
  productId: "",
};

const Maintenance = () => {
  const [products, setProducts] = useState([]);
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
    fetchProducts();
  }, []);

  const swalButtons = {
    confirmButtonColor: "#c62828",
    cancelButtonColor: "#9e9e9e",
  };

  const fetchMaintenance = async () => {
    try {
      const res = await authFetch("/api/Maintenance");
      const data = await res.json();
      setMaintenanceList(data);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while loading maintenance data.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await authFetch("/api/Product");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while loading assets.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const filtered = useMemo(() => {
    return maintenanceList.filter((item) => {
      const q = search.toLowerCase();
      return (
        String(item.productName ?? "").toLowerCase().includes(q) ||
        String(item.storageName ?? "").toLowerCase().includes(q) ||
        String(item.productTypeName ?? "").toLowerCase().includes(q) ||
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
      date: item.date ? item.date.split("T")[0] : "",
      cost: item.cost,
      status: "Pending",
      productId: String(item.productId || ""),
    });
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This maintenance record will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    try {
      await authFetch(`/api/Maintenance/${id}`, {
        method: "DELETE",
      });

      await fetchMaintenance();

      Swal.fire({
        title: "Deleted!",
        text: "Maintenance deleted successfully.",
        icon: "success",
        confirmButtonColor: "#c62828",
      });
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const handleReset = async () => {
    await Swal.fire({
      title: "Notice",
      text: "Reset is disabled because data is now loaded from the server.",
      icon: "info",
      confirmButtonColor: "#c62828",
    });
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        date: data.date,
        cost: Number(data.cost),
        productId: Number(data.productId),
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

      Swal.fire({
        title: "Success!",
        text: editingId
          ? "Maintenance updated successfully."
          : "Maintenance added successfully.",
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
            ➕ Add Maintenance
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
              <th>Storage</th>
              <th>Type</th>
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
                  <td>{item.productName || "-"}</td>
                  <td>{item.storageName || "-"}</td>
                  <td>{item.productTypeName || "-"}</td>
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
                <td colSpan="8" className="ui-empty">
                  No maintenance records found yet.
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
                <label>Asset</label>
                <select
                  className={`ui-input ${errors.productId ? styles.inputError : ""}`}
                  {...register("productId")}
                >
                  <option value="">Select asset</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <span className={styles.errorText}>{errors.productId.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  className={`ui-input ${errors.date ? styles.inputError : ""}`}
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
              <button className="ui-btn-secondary" onClick={closeModal} type="button">
                Cancel
              </button>

              <button className="ui-btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Maintenance;