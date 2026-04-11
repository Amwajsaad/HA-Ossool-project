import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Departments.module.css";
import Modal from "../../components/Modal/Modal";
import { departmentsSchema } from "./DepartmentsSchema";
import Swal from "sweetalert2";

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

const defaultValues = {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(departmentsSchema),
    mode: "all",
    defaultValues,
  });

  const swalButtons = {
    confirmButtonColor: "#c62828",
    cancelButtonColor: "#9e9e9e",
  };

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
    reset(defaultValues);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (department) => {
    reset({
      name: department.name,
      manager: department.manager,
      employees: String(department.employees),
      assets: String(department.assets),
      location: department.location,
    });
    setEditingId(department.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This department will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    setDepartments((prev) => prev.filter((item) => item.id !== id));

    Swal.fire({
      title: "Deleted!",
      text: "Department deleted successfully.",
      icon: "success",
      confirmButtonColor: "#c62828",
    });
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Reset Departments?",
      text: "This will restore the default departments list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    setDepartments(initialDepartments);
    localStorage.removeItem(STORAGE_KEY);

    Swal.fire({
      title: "Reset Done!",
      text: "Departments restored successfully.",
      icon: "success",
      confirmButtonColor: "#c62828",
    });
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        setDepartments((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: data.name.trim(),
                  manager: data.manager.trim(),
                  employees: Number(data.employees),
                  assets: Number(data.assets),
                  location: data.location.trim(),
                }
              : item
          )
        );
      } else {
        const nextIdNumber = departments.length + 1;

        const newDepartment = {
          id: `D${String(nextIdNumber).padStart(3, "0")}`,
          name: data.name.trim(),
          manager: data.manager.trim(),
          employees: Number(data.employees),
          assets: Number(data.assets),
          location: data.location.trim(),
        };

        setDepartments((prev) => [newDepartment, ...prev]);
      }

      closeModal();

      Swal.fire({
        title: "Success!",
        text: editingId
          ? "Department updated successfully."
          : "Department added successfully.",
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
          <h2 className="ui-title">Departments</h2>
          <p className="ui-subtitle">Manage company departments and managers.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset} type="button">
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal} type="button">
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.modalGrid}>
              <div className={styles.formGroup}>
                <label>Department Name</label>
                <input
                  className={`ui-input ${errors.name ? styles.inputError : ""}`}
                  placeholder="Department name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Manager</label>
                <input
                  className={`ui-input ${errors.manager ? styles.inputError : ""}`}
                  placeholder="Manager name"
                  {...register("manager")}
                />
                {errors.manager && (
                  <span className={styles.errorText}>{errors.manager.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Employees Count</label>
                <input
                  className={`ui-input ${errors.employees ? styles.inputError : ""}`}
                  type="number"
                  placeholder="0"
                  {...register("employees")}
                />
                {errors.employees && (
                  <span className={styles.errorText}>{errors.employees.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Assets Count</label>
                <input
                  className={`ui-input ${errors.assets ? styles.inputError : ""}`}
                  type="number"
                  placeholder="0"
                  {...register("assets")}
                />
                {errors.assets && (
                  <span className={styles.errorText}>{errors.assets.message}</span>
                )}
              </div>

              <div className={styles.formGroupFull}>
                <label>Location</label>
                <input
                  className={`ui-input ${errors.location ? styles.inputError : ""}`}
                  placeholder="Location"
                  {...register("location")}
                />
                {errors.location && (
                  <span className={styles.errorText}>{errors.location.message}</span>
                )}
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
                  ? "Update Department"
                  : "Save Department"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Departments;