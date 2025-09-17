import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface AddTeamFormProps {
  onAddTeam: (team: { name: string; description: string }) => void;
  onCancel: () => void;
}

export default function AddTeamForm({ onAddTeam, onCancel }: AddTeamFormProps) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onAddTeam(formData);
    setFormData({ name: "", description: "" });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter team name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Brief description of the team"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Team</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
