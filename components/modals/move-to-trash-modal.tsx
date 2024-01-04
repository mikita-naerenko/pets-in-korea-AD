"use client";
import { Modal } from "@/components/ui/modal";
import { useMoveToTrashModal } from "@/hooks/use-move-to-trash-modal";
import { Button } from "../ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MoveToTrashModal() {
  const [loading, setLoading] = useState(false);
  const useMoveToTrash = useMoveToTrashModal();
  const router = useRouter();

  const onCancelClick = () => {
    useMoveToTrash.setItem("");
    useMoveToTrash.onClose();
  };

  const onAgreeClick = () => {
    if (useMoveToTrash.item && useMoveToTrash.item.typeOfItem === "article") {
      setLoading(true);
      const fetchData = async () => {
        const item = useMoveToTrash.item && useMoveToTrash.item.itemId;
        try {
          await axios.delete(`/api/${item}`);
          useMoveToTrash.onClose();
          toast.success("Item has been moved to the trash");
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
          console.error("Error fetching data:", error);
        } finally {
          useMoveToTrash.setItem("");
          setLoading(false);
        }
      };

      fetchData();
    } else if (
      useMoveToTrash.item &&
      useMoveToTrash.item.typeOfItem === "alreadyInTrash"
    ) {
      setLoading(true);
      const item = useMoveToTrash.item && useMoveToTrash.item.itemId;
      const fetchData = async () => {
        try {
          await axios.delete(`/api/removed-items/${item}`);
          useMoveToTrash.onClose();
          toast.success("The item has been permanently removed");
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
          console.error("Error fetching data:", error);
        } finally {
          useMoveToTrash.setItem("");
          setLoading(false);
        }
      };
      fetchData();
    } else if (
      useMoveToTrash.item &&
      useMoveToTrash.item.typeOfItem === "tag"
    ) {
      setLoading(true);
      const item = useMoveToTrash.item && useMoveToTrash.item.itemId;
      const fetchData = async () => {
        try {
          await axios.delete(`/api/tags/${item}`);
          useMoveToTrash.onClose();
          toast.success("The item has been permanently removed");
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
          console.error("Error fetching data:", error);
        } finally {
          useMoveToTrash.setItem("");
          setLoading(false);
        }
      };
      fetchData();
    } else if (
      useMoveToTrash.item &&
      useMoveToTrash.item.typeOfItem === "theme"
    ) {
      const fetchData = async () => {
        const item = useMoveToTrash.item && useMoveToTrash.item.itemId;
        try {
          await axios.delete(`/api/theme/${item}`);
          useMoveToTrash.onClose();
          toast.success("Item has been moved to the trash");
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
          console.error("Error fetching data:", error);
        } finally {
          useMoveToTrash.setItem("");
          setLoading(false);
        }
      };

      fetchData();
    } else if (
      useMoveToTrash.item &&
      useMoveToTrash.item.typeOfItem === "phrase"
    ) {
      const fetchData = async () => {
        const item = useMoveToTrash.item && useMoveToTrash.item.itemId;
        try {
          await axios.delete(`/api/phrase/${item}`);
          useMoveToTrash.onClose();
          toast.success("Item has been moved to the trash");
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else if (
      useMoveToTrash.item &&
      useMoveToTrash.item.typeOfItem === "engTranslate"
    ) {
      const fetchData = async () => {
        const typeOfItem =
          useMoveToTrash.item && useMoveToTrash.item.typeOfItem;
        const item = useMoveToTrash.item && useMoveToTrash.item.itemId;
        if (!typeOfItem || !item) {
          throw new Error("TypeOfItem and Item id is required!");
        }
        try {
          await axios.delete(`/api/${typeOfItem}/${item}`);
          useMoveToTrash.onClose();
          toast.success("Item has been moved to the trash");
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else if (
      useMoveToTrash.item &&
      useMoveToTrash.item.typeOfItem === "news"
    ) {
      const fetchData = async () => {
        const typeOfItem =
          useMoveToTrash.item && useMoveToTrash.item.typeOfItem;
        const item = useMoveToTrash.item && useMoveToTrash.item.itemId;
        if (!typeOfItem || !item) {
          throw new Error("TypeOfItem and Item id is required!");
        }
        try {
          await axios.delete(`/api/news/${item}`);
          useMoveToTrash.onClose();
          toast.success("Item has been moved to the trash");
          router.refresh();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data, {
              duration: 10000,
            });
          } else {
            toast.error("Something went wrong");
          }
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  };

  return (
    <Modal
      title={
        (useMoveToTrash.item &&
          useMoveToTrash.item.typeOfItem === "alreadyInTrash") ||
        (useMoveToTrash.item && useMoveToTrash.item.typeOfItem === "tag")
          ? "Delete Permanently?"
          : "Move to trash?"
      }
      description="All dependes relations will be moved to the trash too"
      isOpen={useMoveToTrash.isOpen}
      onClose={useMoveToTrash.onClose}
    >
      <p>{useMoveToTrash.item ? useMoveToTrash.item.itemName : null}</p>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} onClick={onCancelClick} variant="outline">
          Cancel
        </Button>
        <Button disabled={loading} onClick={onAgreeClick}>
          {(useMoveToTrash.item &&
            useMoveToTrash.item.typeOfItem === "alreadyInTrash") ||
          (useMoveToTrash.item && useMoveToTrash.item.typeOfItem === "tag")
            ? "Delete Permanently"
            : "Move"}
        </Button>
      </div>
    </Modal>
  );
}
