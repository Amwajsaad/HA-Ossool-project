import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Employees.module.css";
import Modal from "../../components/Modal/Modal";
import { employeesSchema } from "./EmployeesSchema";

const initialEmployees = [
  {
    id: "E001",
    name: "Amwaj",
    department: "HR",
    phone: "0551234567",
    asset: "Laptop",
    branch: "Main Office",
    status: "Active",
  },
  {
    id: "E002",
    name: "Naser",
    department: "IT",
    phone: "0552345678",
    asset: "Printer",
    branch: "Branch A",
    status: "Inactive",
  },
  {
    id: "E003",
    name: "Sara",
    department: "Finance",
    phone: "0553456789",
    asset: "Projector",
    branch: "Main Office",
    status: "Active",
  },
  {
    id: "E004",
    name: "Fahad",
    department: "Operations",
    phone: "0554567890",
    asset: "Camera",
    branch: "Warehouse",
    status: "Active",
  },
];

const STORAGE_KEY = "employees_data";

const defaultValues = {
  name: "",
  department: "",
  phone: "",
  asset: "",
  branch: "",
  status: "Active",
};

const Employees = () => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialEmployees;
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
    resolver: zodResolver(employeesSchema),
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const filtered = useMemo(() => {
    return employees.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.asset.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q)
      );
    });
  }, [employees, search]);

  const resetFormState = () => {
    reset(defaultValues);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  const openEditModal = (employee) => {
    reset({
      name: employee.name,
      department: employee.department,
      phone: employee.phone,
      asset: employee.asset,
      branch: employee.branch,
      status: employee.status,
    });
    setEditingId(employee.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    setEmployees((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "This will reset employees to the default list. Continue?"
    );
    if (!confirmReset) return;

    setEmployees(initialEmployees);
    localStorage.removeItem(STORAGE_KEY);
  };

  const onSubmit = async (data) => {
    console.log(data);

    if (editingId) {
      setEmployees((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: data.name.trim(),
                department: data.department.trim(),
                phone: data.phone.trim(),
                asset: data.asset.trim(),
                branch: data.branch.trim(),
                status: data.status,
              }
            : item
        )
      );
    } else {
      const nextIdNumber = employees.length + 1;

      const newEmployee = {
        id: `E${String(nextIdNumber).padStart(3, "0")}`,
        name: data.name.trim(),
        department: data.department.trim(),
        phone: data.phone.trim(),
        asset: data.asset.trim(),
        branch: data.branch.trim(),
        status: data.status,
      };

      setEmployees((prev) => [newEmployee, ...prev]);
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
          <h2 className="ui-title">Employees</h2>
          <p className="ui-subtitle">Manage employees and assigned assets.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset} type="button">
            Reset
          </button>

          <button className="ui-btn-primary" onClick={openAddModal} type="button">
            ➕ Add Employee
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={`ui-input ${styles.searchInput}`}
          placeholder="Search employee..."
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
              <th>Department</th>
              <th>Phone</th>
              <th>Asset</th>
              <th>Branch</th>
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
                  <td>{item.department}</td>
                  <td>{item.phone}</td>
                  <td>{item.asset}</td>
                  <td>{item.branch}</td>
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
                <td colSpan="8" className="ui-empty">
                  No employees found — start by adding one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Employee" : "Add Employee"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.modalGrid}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  className={`ui-input ${errors.name ? styles.inputError : ""}`}
                  placeholder="Employee name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Department</label>
                <input
                  className={`ui-input ${
                    errors.department ? styles.inputError : ""
                  }`}
                  placeholder="Department"
                  {...register("department")}
                />
                {errors.department && (
                  <span className={styles.errorText}>
                    {errors.department.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  className={`ui-input ${errors.phone ? styles.inputError : ""}`}
                  placeholder="05XXXXXXXX"
                  {...register("phone")}
                />
                {errors.phone && (
                  <span className={styles.errorText}>{errors.phone.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Assigned Asset</label>
                <input
                  className={`ui-input ${errors.asset ? styles.inputError : ""}`}
                  placeholder="Assigned asset"
                  {...register("asset")}
                />
                {errors.asset && (
                  <span className={styles.errorText}>{errors.asset.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Branch</label>
                <input
                  className={`ui-input ${errors.branch ? styles.inputError : ""}`}
                  placeholder="Branch"
                  {...register("branch")}
                />
                {errors.branch && (
                  <span className={styles.errorText}>{errors.branch.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
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
                {editingId ? "Update Employee" : "Save Employee"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Employees;