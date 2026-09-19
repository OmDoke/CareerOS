import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useDeleteResume } from "../hooks/useResume";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

import { toast } from "sonner";

export function DeleteResumeDialog({ isOpen, onClose }: Props) {
  const deleteResume = useDeleteResume();

  const handleDelete = () => {
    deleteResume.mutate(undefined, {
      onSuccess: () => {
        toast.success("Resume deleted successfully");
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete resume");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resume</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your resume? This action cannot be undone.
            Your parsed details will also be removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={deleteResume.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteResume.isPending}>
            {deleteResume.isPending ? "Deleting..." : "Delete Resume"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
