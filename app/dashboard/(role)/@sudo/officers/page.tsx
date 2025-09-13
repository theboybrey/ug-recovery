"use client";

import React, { useState } from "react";

import Button from "@/components/core/button";
import Modal from "@/components/modal";
import NoRecordsFound from "@/components/empty";
import { Table } from "@/components/table";
import UserForm from "@/components/forms/users";
import { useUsers } from "@/hooks/useUsers";

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for handling pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch users using the useUsers hook
  const { data, loading, error, refetch } = useUsers({ page, limit });

  const users = data?.data || [];
  const totalCount = data?.meta.totalCount || 0;

  const handleCreateUser = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const paginationHandler = (action: "first" | "last" | "next" | "prev") => {
    const totalPages = Math.ceil(totalCount / limit);

    switch (action) {
      case "first":
        setPage(1);
        break;
      case "last":
        setPage(totalPages);
        break;
      case "next":
        if (page < totalPages) {
          setPage(page + 1);
        }
        break;
      case "prev":
        if (page > 1) {
          setPage(page - 1);
        }
        break;
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div className="h-[92vh] p-4">
      {users.length === 0 ? (
        <div className="flex h-screen flex-col items-center justify-center p-4">
          <NoRecordsFound entity="Users" onCreate={handleCreateUser} />
        </div>
      ) : (
        <p>Users table here</p>
      )}
      {}
    </div>
  );
};

export default Users;
