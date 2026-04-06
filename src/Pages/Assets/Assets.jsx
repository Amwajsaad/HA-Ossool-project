import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Assets.module.css";
import Modal from "../../components/Modal/Modal";
import { assetsSchema } from "./AssetsSchema";

const initialAssets = [
  {
    id: "A001",
    name: "Laptop",
    location: "HR Office",
    status: "Active",
    lastMaintenance: "12/02/2026",
  },
  {
    id: "A002",
    name: "Printer",
    location: "Main Office",
    status: "Inactive",
    lastMaintenance: "10/02/2026",
  },
];

const STORAGE_KEY = "assets_data";

const defaultValues = {
  name: "",
  location: "",
  status: "Active",
  lastMaintenance: "",
};

const Assets = () => {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialAssets;
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
    resolver: zodResolver(assetsSchema),
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  const filtered = useMemo(() => {
    return assets.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
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
      name: item.name,
      location: item.location,
      status: item.status,
      lastMaintenance: item.lastMaintenance,
    });
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset(defaultValues);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setAssets((prev) => prev.filter((item) => item.id !== id));
  };

  const onSubmit = async (data) => {
    console.log(data);

    if (editingId) {
      setAssets((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: data.name.trim(),
                location: data.location.trim(),
                status: data.status,
                lastMaintenance: data.lastMaintenance.trim(),
              }
            : item
        )
      );
    } else {
      const newAsset = {
        id: `A${Date.now()}`,
        name: data.name.trim(),
        location: data.location.trim(),
        status: data.status,
        lastMaintenance: data.lastMaintenance.trim(),
      };

      setAssets((prev) => [newAsset, ...prev]);
    }

    closeModal();
  };

  const getStatusClass = (status) =>
    status === "Active" ? "ui-success" : "ui-danger";

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
              <th>Location</th>
              <th>Status</th>
              <th>Last Maintenance</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`ui-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.lastMaintenance}</td>
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
                <td colSpan="5" className="ui-empty">
                  No assets found — start by adding one.
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
            <input
              className="ui-input"
              placeholder="Name"
              {...register("name")}
            />
            {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}

            <input
              className="ui-input"
              placeholder="Location"
              {...register("location")}
            />
            {errors.location && (
              <p className={styles.errorText}>{errors.location.message}</p>
            )}

            <input
              className="ui-input"
              placeholder="DD/MM/YYYY" 
              type="date"
              {...register("lastMaintenance")}
            />
            {errors.lastMaintenance && (
              <p className={styles.errorText}>{errors.lastMaintenance.message}</p>
            )}

            <select className="ui-input" {...register("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              className="ui-btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {editingId ? "Update Asset" : "Save Asset"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Assets;