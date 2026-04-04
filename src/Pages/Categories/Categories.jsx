import React, { useEffect, useMemo, useState } from "react";
import styles from "./Categories.module.css";
import Modal from "../../components/Modal/Modal";

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

const emptyForm = {
  name: "",
  description: "",
  assetsCount: "",
  status: "Active",
};

const emptyErrors = {
  name: "",
  description: "",
  assetsCount: "",
};

const Categories = () => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);

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
    setForm(emptyForm);
    setErrors(emptyErrors);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (category) => {
    setForm({
      name: category.name,
      description: category.description,
      assetsCount: String(category.assetsCount),
      status: category.status,
    });
    setErrors(emptyErrors);
    setEditingId(category.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "This will reset categories to the default list. Continue?"
    );
    if (!confirmReset) return;

    setCategories(initialCategories);
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
      newErrors.name = "Category name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (form.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters.";
    }

    if (!form.assetsCount.trim()) {
      newErrors.assetsCount = "Assets count is required.";
    } else if (Number(form.assetsCount) < 0) {
      newErrors.assetsCount = "Assets count must be 0 or more.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((value) => value === "");
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                description: form.description.trim(),
                assetsCount: Number(form.assetsCount),
                status: form.status,
              }
            : item
        )
      );
    } else {
      const nextIdNumber = categories.length + 1;
      const newCategory = {
        id: `C${String(nextIdNumber).padStart(3, "0")}`,
        name: form.name.trim(),
        description: form.description.trim(),
        assetsCount: Number(form.assetsCount),
        status: form.status,
      };

      setCategories((prev) => [newCategory, ...prev]);
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
          <h2 className="ui-title">Categories</h2>
          <p className="ui-subtitle">Manage asset categories and classifications.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset}>
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal}>
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
          <div className={styles.modalGrid}>
            <div className={styles.formGroup}>
              <label>Category Name</label>
              <input
                className={`ui-input ${errors.name ? styles.inputError : ""}`}
                name="name"
                placeholder="Category name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Assets Count</label>
              <input
                className={`ui-input ${
                  errors.assetsCount ? styles.inputError : ""
                }`}
                name="assetsCount"
                type="number"
                placeholder="0"
                value={form.assetsCount}
                onChange={handleChange}
              />
              {errors.assetsCount && (
                <span className={styles.errorText}>{errors.assetsCount}</span>
              )}
            </div>

            <div className={styles.formGroupFull}>
              <label>Description</label>
              <input
                className={`ui-input ${
                  errors.description ? styles.inputError : ""
                }`}
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className={styles.errorText}>{errors.description}</span>
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
              {editingId ? "Update Category" : "Save Category"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Categories;