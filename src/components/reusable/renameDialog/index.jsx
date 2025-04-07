import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useTheme } from "../../../hooks/useTheme";

export const RenameDialog = ({
  isOpen,
  onOpenChange,
  title = "Rename Item",
  labelText = "Name",
  inputId = "item-name",
  value,
  onChange,
  onSave,
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
}) => {
  const { isDark } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={isDark ? "bg-[#00170C] text-amber-100 border-gray-800" : "text-black"}
      >
        <DialogHeader>
          <DialogTitle className={isDark ? "text-amber-100" : "text-black"}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor={inputId} className={isDark ? "text-amber-100" : "text-black"}>
              {labelText}
            </Label>
            <Input
              id={inputId}
              value={value}
              onChange={onChange}
              className={
                isDark ? "bg-[#000e07] text-amber-100 border-gray-700" : "text-black"
              }
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`${
              isDark
                ? "text-amber-100 border-gray-700 hover:bg-amber-100 bg-[#00170C]"
                : "text-black"
            } cursor-pointer`}
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onSave}
            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          >
            {saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
