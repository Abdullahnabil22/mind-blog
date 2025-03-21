import { useTheme } from "../../../hooks/useTheme";
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
export function CreateDialog({
  isOpen,
  onOpenChange,
  newContentName,
  setNewContentName,
  handleCreateContent,
  title,
}) {
  const { isDark } = useTheme();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className={
            isDark ? "bg-[#00170C] text-amber-100 border-gray-800" : ""
          }
        >
          <DialogHeader>
            <DialogTitle className={isDark ? "text-amber-100" : ""}>
              Create New {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label
                htmlFor="folder-name"
                className={isDark ? "text-amber-100" : ""}
              >
                {title} Name
              </Label>
              <Input
                id="folder-name"
                value={newContentName}
                onChange={(e) => setNewContentName(e.target.value)}
                placeholder={`Enter ${title} name`}
                className={
                  isDark ? "bg-[#000e07] text-amber-100 border-gray-700" : ""
                }
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
                  : ""
              } cursor-pointer`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateContent}
              className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
