import { useTheme } from "../../../hooks/useTheme";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

export const ConfirmationDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}) => {
  const { isDark } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={isDark ? "bg-[#00170C] text-amber-100 border-gray-800" : ""}
      >
        <DialogHeader>
          <DialogTitle className={isDark ? "text-amber-100" : ""}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className={isDark ? "text-amber-100" : ""}>{description}</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`${
              isDark
                ? "text-amber-100 border-gray-700 hover:bg-amber-100 bg-[#00170C]"
                : ""
            } cursor-pointer`}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
