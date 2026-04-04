import React, { useEffect, useMemo, useState } from "react";
import styles from "./Departments.module.css";
import Modal from "../../components/Modal/Modal";

const initialDepartments = [
  {
    id: "D001",
    name: "Human Resources",
    manager: "Amwaj",
    employees: 8,
    assets: 15,
    location: "Main Office",
  },
  {
    id: "D002",
    name: "IT",
    manager: "Naser",
    employees: 12,
    assets: 28,
    location: "Branch A",
  },
  {
    id: "D003",
    name: "Finance",
    manager: "Sara",
    employees: 6,
    assets: 10,
    location: "Main Office",
  },
  {
    id: "D004",
    name: "Operations",
    manager: "Fahad",
    employees: 14,
    assets: 22,
    location: "Warehouse",
  },
];

const STORAGE_KEY = "departments_data";

const emptyForm = {
  name: "",
  manager: "",
  employees: "",
  assets: "",
  location: "",
};

const emptyErrors = {
  name: "",
  manager: "",
  employees: "",
  assets: "",
  location: "",
};

const Departments = () => {
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
  }, [departments]);

  const filtered = useMemo(() => {
    return departments.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.manager.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    });
  }, [departments, search]);

  const resetFormState = () => {
    setForm(emptyForm);
    setErrors(emptyErrors);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (department) => {
    setForm({
      name: department.name,
      manager: department.manager,
      employees: String(department.employees),
      assets: String(department.assets),
      location: department.location,
    });
    setErrors(emptyErrors);
    setEditingId(department.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (!confirmDelete) return;

    setDepartments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "This will reset departments to the default list. Continue?"
    );
    if (!confirmReset) return;

    setDepartments(initialDepartments);
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
      newErrors.name = "Department name is required.";
    }

    if (!form.manager.trim()) {
      newErrors.manager = "Manager name is required.";
    }

    if (!form.employees.trim()) {
      newErrors.employees = "Employees count is required.";
    } else if (Number(form.employees) < 0) {
      newErrors.employees = "Employees count must be 0 or more.";
    }

    if (!form.assets.trim()) {
      newErrors.assets = "Assets count is required.";
    } else if (Number(form.assets) < 0) {
      newErrors.assets = "Assets count must be 0 or more.";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((value) => value === "");
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                manager: form.manager.trim(),
                employees: Number(form.employees),
                assets: Number(form.assets),
                location: form.location.trim(),
              }
            : item
        )
      );
    } else {
      const nextIdNumber = departments.length + 1;
      const newDepartment = {
        id: `D${String(nextIdNumber).padStart(3, "0")}`,
        name: form.name.trim(),
        manager: form.manager.trim(),
        employees: Number(form.employees),
        assets: Number(form.assets),
        location: form.location.trim(),
      };

      setDepartments((prev) => [newDepartment, ...prev]);
    }

    closeModal();
  };

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Departments</h2>
          <p className="ui-subtitle">Manage company departments and managers.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset}>
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal}>
            ➕ Add Department
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={`ui-input ${styles.searchInput}`}
          placeholder="Search department..."
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
              <th>Manager</th>
              <th>Employees</th>
              <th>Assets</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.manager}</td>
                  <td>{item.employees}</td>
                  <td>{item.assets}</td>
                  <td>{item.location}</td>
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
                  No departments found — start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Department" : "Add Department"}
          onClose={closeModal}
        >
          <div className={styles.modalGrid}>
            <div className={styles.formGroup}>
              <label>Department Name</label>
              <input
                className={`ui-input ${errors.name ? styles.inputError : ""}`}
                name="name"
                placeholder="Department name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Manager</label>
              <input
                className={`ui-input ${errors.manager ? styles.inputError : ""}`}
                name="manager"
                placeholder="Manager name"
                value={form.manager}
                onChange={handleChange}
              />
              {errors.manager && (
                <span className={styles.errorText}>{errors.manager}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Employees Count</label>
              <input
                className={`ui-input ${
                  errors.employees ? styles.inputError : ""
                }`}
                name="employees"
                type="number"
                placeholder="0"
                value={form.employees}
                onChange={handleChange}
              />
              {errors.employees && (
                <span className={styles.errorText}>{errors.employees}</span>
              )}
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

            <div className={styles.formGroupFull}>
              <label>Location</label>
              <input
                className={`ui-input ${errors.location ? styles.inputError : ""}`}
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
              />
              {errors.location && (
                <span className={styles.errorText}>{errors.location}</span>
              )}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button className="ui-btn-secondary" onClick={closeModal} type="button">
              Cancel
            </button>

            <button className="ui-btn-primary" onClick={handleSave} type="button">
              {editingId ? "Update Department" : "Save Department"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Departments;