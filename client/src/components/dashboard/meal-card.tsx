interface MealCardProps {
  name: string;
  description: string;
  time: string;
  calories: number;
  icon: string;
}

export function MealCard({ name, description, time, calories, icon }: MealCardProps) {
  return (
    <div className="mb-4 pb-4 border-b border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <span className="material-icons text-primary">{icon}</span>
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="mt-1 flex items-center text-xs text-gray-500">
              <span className="flex items-center mr-2">
                <span className="material-icons text-xs mr-1">schedule</span>
                {time}
              </span>
              <span>{calories} calories</span>
            </div>
          </div>
        </div>
        <span className="material-icons text-gray-400">more_vert</span>
      </div>
    </div>
  );
}
