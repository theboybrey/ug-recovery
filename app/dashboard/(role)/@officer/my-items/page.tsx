"use client";
import React, { useState } from "react";

import NoRecordsFound from "@/components/empty";
import { useItems } from "@/hooks/useitems";

const ItemsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, loading, error, refetch } = useItems({ page, limit });

  const items = data?.data || [];
  const totalCount = data?.meta.totalCount || 0;

  const handleCreateItem = () => {
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
    return <div>Loading items...</div>;
  }

  // if (error) {
  //   return <div>Error loading items: {error?.message}</div>;
  // }

  return (
    <div className="h-[92vh] p-4">
      {items.length === 0 ? (
        <div className="flex h-screen flex-col items-center justify-center p-4">
          <NoRecordsFound entity="Items" onCreate={handleCreateItem} />
        </div>
      ) : (
        <p>Items table here</p>
      )}
      {}
    </div>
  );
};

export default ItemsPage;
