import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Categories.module.css";
import Modal from "../../components/Modal/Modal";
import { categoriesSchema } from "./CategoriesSchema";
import Swal from "sweetalert2";

const initialCategories = [
  {
    id: "C001",
    name: "Electronics",
    description: "Devices like laptops and printers",
    assetsCount: 24,
    status: "Active",
  },
  {
    id: "C002",
    name: "Furniture",
    description: "Office desks and chairs",
    assetsCount: 18,
    status: "Inactive",
  },
  {
    id: "C003",
    name: "Maintenance Tools",
    description: "Tools used for technical operations",
    assetsCount: 9,
    status: "Active",
  },
  {
    id: "C004",
    name: "Security Equipment",
    description: "Cameras and monitoring devices",
    assetsCount: 12,
    status: "Active",
  },
];

const STORAGE_KEY = "categories_data";

const defaultValues = {
  name: "",
  description: "",
  assetsCount: "",
  status: "Active",
};

const Categories = () => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCategories;
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
    resolver: zodResolver(categoriesSchema),
    mode: "all",
    defaultValues,
  });

  const swalButtons = {
    confirmButtonColor: "#c62828",
    cancelButtonColor: "#9e9e9e",
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const filtered = useMemo(() => {
    return categories.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  const resetFormState = () => {
    reset(defaultValues);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (category) => {
    reset({
      name: category.name,
      description: category.description,
      assetsCount: String(category.assetsCount),
      status: category.status,
    });
    setEditingId(category.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    setCategories((prev) => prev.filter((item) => item.id !== id));

    Swal.fire({
      title: "Deleted!",
      text: "Category deleted successfully.",
      icon: "success",
      confirmButtonColor: "#c62828",
    });
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Reset Categories?",
      text: "This will restore the default categories list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    setCategories(initialCategories);
    localStorage.removeItem(STORAGE_KEY);

    Swal.fire({
      title: "Reset Done!",
      text: "Categories restored successfully.",
      icon: "success",
      confirmButtonColor: "#c62828",
    });
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        setCategories((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: data.name.trim(),
                  description: data.description.trim(),
                  assetsCount: Number(data.assetsCount),
                  status: data.status,
                }
              : item
          )
        );
      } else {
        const nextIdNumber = categories.length + 1;

        const newCategory = {
          id: `C${String(nextIdNumber).padStart(3, "0")}`,
          name: data.name.trim(),
          description: data.description.trim(),
          assetsCount: Number(data.assetsCount),
          status: data.status,
        };

        setCategories((prev) => [newCategory, ...prev]);
      }

      closeModal();

      Swal.fire({
        title: "Success!",
        text: editingId
          ? "Category updated successfully."
          : "Category added successfully.",
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
          <h2 className="ui-title">Categories</h2>
          <p className="ui-subtitle">Manage asset categories and classifications.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset} type="button">
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal} type="button">
            ➕ Add Category
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={`ui-input ${styles.searchInput}`}
          placeholder="Search category..."
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
              <th>Description</th>
              <th>Assets</th>
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
                  <td>{item.description}</td>
                  <td>{item.assetsCount}</td>
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
                  No categories found — start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Category" : "Add Category"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.modalGrid}>
              <div className={styles.formGroup}>
                <label>Category Name</label>
                <input
                  className={`ui-input ${errors.name ? styles.inputError : ""}`}
                  placeholder="Category name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Assets Count</label>
                <input
                  className={`ui-input ${errors.assetsCount ? styles.inputError : ""}`}
                  type="number"
                  placeholder="0"
                  {...register("assetsCount")}
                />
                {errors.assetsCount && (
                  <span className={styles.errorText}>
                    {errors.assetsCount.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroupFull}>
                <label>Description</label>
                <input
                  className={`ui-input ${errors.description ? styles.inputError : ""}`}
                  placeholder="Description"
                  {...register("description")}
                />
                {errors.description && (
                  <span className={styles.errorText}>
                    {errors.description.message}
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
                  ? "Update Category"
                  : "Save Category"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Categories;