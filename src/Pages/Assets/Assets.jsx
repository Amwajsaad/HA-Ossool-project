import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Assets.module.css";
import Modal from "../../components/Modal/Modal";
import { assetsSchema } from "./AssetsSchema";
import { authFetch } from "../../services/AuthService";
import Swal from "sweetalert2";

const defaultValues = {
  name: "",
  storageId: "",
  productTypeId: "",
};

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [storages, setStorages] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(assetsSchema),
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    fetchAssets();
    fetchStorages();
    fetchProductTypes();
  }, []);

  const swalButtons = {
    confirmButtonColor: "#c62828",
    cancelButtonColor: "#9e9e9e",
  };

  const fetchAssets = async () => {
    try {
      const res = await authFetch("/api/Product");
      const data = await res.json();
      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while loading assets.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const fetchStorages = async () => {
    try {
      const res = await authFetch("/api/Storage");
      const data = await res.json();
      setStorages(data);
    } catch (error) {
      console.error("Error fetching storages:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while loading storages.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const fetchProductTypes = async () => {
    try {
      const res = await authFetch("/api/ProductType");
      const data = await res.json();
      setProductTypes(data);
    } catch (error) {
      console.error("Error fetching product types:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while loading product types.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const filtered = useMemo(() => {
    return assets.filter((item) => {
      const q = search.toLowerCase();
      return (
        String(item.name ?? "").toLowerCase().includes(q) ||
        String(item.storage?.name ?? "").toLowerCase().includes(q) ||
        String(item.productType?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [assets, search]);

  const openAdd = () => {
    reset(defaultValues);
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    reset({
      name: item.name || "",
      storageId: String(item.storageId || ""),
      productTypeId: String(item.productTypeId || ""),
    });
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset(defaultValues);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This asset will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    try {
      await authFetch(`/api/Product/${id}`, {
        method: "DELETE",
      });

      await fetchAssets();

      Swal.fire({
        title: "Deleted!",
        text: "Asset deleted successfully.",
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

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        storageId: Number(data.storageId),
        productTypeId: Number(data.productTypeId),
      };

      if (editingId) {
        await authFetch(`/api/Product/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch("/api/Product", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await fetchAssets();
      closeModal();

      Swal.fire({
        title: "Success!",
        text: editingId
          ? "Asset updated successfully."
          : "Asset added successfully.",
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

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Assets</h2>
          <p className="ui-subtitle">Manage company assets</p>
        </div>

        <button className="ui-btn-primary" onClick={openAdd} type="button">
          ➕ Add Asset
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          className="ui-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ui-table-card">
        <table className="ui-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Storage</th>
              <th>Product Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.storage?.name || "-"}</td>
                  <td>{item.productType?.name || "-"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className="ui-btn-icon"
                        onClick={() => openEdit(item)}
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
                <td colSpan="4" className="ui-empty">
                  No assets found yet. Start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Asset" : "Add Asset"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.modalGrid}>
              <div className={styles.formGroup}>
                <label>Asset Name</label>
                <input
                  className={`ui-input ${errors.name ? styles.inputError : ""}`}
                  placeholder="Asset name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className={styles.errorText}>{errors.name.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Storage</label>
                <select
                  className={`ui-input ${errors.storageId ? styles.inputError : ""}`}
                  {...register("storageId")}
                >
                  <option value="">Select storage</option>
                  {storages.map((storage) => (
                    <option key={storage.id} value={storage.id}>
                      {storage.name}
                    </option>
                  ))}
                </select>
                {errors.storageId && (
                  <p className={styles.errorText}>{errors.storageId.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Product Type</label>
                <select
                  className={`ui-input ${errors.productTypeId ? styles.inputError : ""}`}
                  {...register("productTypeId")}
                >
                  <option value="">Select product type</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.productTypeId && (
                  <p className={styles.errorText}>{errors.productTypeId.message}</p>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className="ui-btn-secondary" onClick={closeModal} type="button">
                Cancel
              </button>

              <button className="ui-btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingId ? "Update Asset" : "Save Asset"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Assets;