import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Users, Plus } from "lucide-react";
import AddTeamForm from "./AddTeamForm";

interface Team {
  id: number;
  name: string;
  description: string;
}

export default function TeamsView() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddTeam = (team: Omit<Team, "id">) => {
    const newTeam = { ...team, id: Date.now() };
    setTeams([...teams, newTeam]);
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" /> Teams
        </h2>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Team
        </Button>
      </div>

      {/* Add Team Form */}
      {showForm && (
        <AddTeamForm
          onAddTeam={handleAddTeam}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Teams List */}
      <div className="grid gap-4 mt-6">
        {teams.length === 0 ? (
          <p className="text-muted-foreground">
            No teams yet. Add your first one!
          </p>
        ) : (
          teams.map((team) => (
            <Card key={team.id}>
              <CardContent className="pt-4">
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Preview Cards for Team Features */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Team Features Preview</h3>
        <div className="grid gap-4">
          <Card className="opacity-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Team Matching</p>
                  <p className="text-sm text-muted-foreground">
                    AI-powered team recommendations based on skills
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="opacity-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Create Teams</p>
                  <p className="text-sm text-muted-foreground">
                    Start your own team and recruit members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

