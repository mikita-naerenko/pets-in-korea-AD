"use client";
import { Modal } from "@/components/ui/modal";
import { useRecoveryModal } from "@/hooks/use-recovery-modal";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function RecoveryItemModal() {
  const router = useRouter();
  const recoveryModal = useRecoveryModal();
  const [loading, setLoading] = useState(false);

  const onCancelClick = () => {
    recoveryModal.setItem("");
    recoveryModal.onClose();
  };

  const onAgreeClick = () => {
    const id = recoveryModal.item && recoveryModal.item;
    const fetchData = async () => {
      setLoading(true);
      try {
        await axios.post(`/api/removed-items/${id}`, { id: id });
        toast.success("Item has been recovered");
        recoveryModal.onClose();
        router.refresh();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data, {
            duration: 10000,
          });
        } else {
          console.error("Error fetching data:", error);
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data, {
              duration: 10000,
            });
          } else {
            toast.error("Something went wrong");
          }
        }

        recoveryModal.onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return (
    <Modal
      title="Recovery Item"
      description=""
      isOpen={recoveryModal.isOpen}
      onClose={recoveryModal.onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} onClick={onCancelClick} variant="outline">
          Cancel
        </Button>
        <Button disabled={loading} onClick={onAgreeClick}>
          Agree
        </Button>
      </div>
    </Modal>
  );
}
