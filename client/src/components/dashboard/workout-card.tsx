interface ExerciseProps {
  name: string;
  sets?: number;
  reps?: number;
  icon: string;
}

interface WorkoutCardProps {
  title: string;
  duration: number;
  exercises: ExerciseProps[];
  buttonText?: string;
  onButtonClick?: () => void;
}

export function WorkoutCard({
  title,
  duration,
  exercises,
  buttonText = "Start Workout",
  onButtonClick,
}: WorkoutCardProps) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs font-medium bg-indigo-100 text-primary px-2 py-1 rounded-full">
          {duration} min
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-3 flex flex-col items-center justify-center"
          >
            <span className="material-icons text-primary mb-1">{exercise.icon}</span>
            <p className="text-xs text-center">{exercise.name}</p>
            {exercise.sets && exercise.reps && (
              <p className="text-xs text-gray-500">
                {exercise.sets} x {exercise.reps}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onButtonClick}
        className="w-full border border-primary text-primary py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}

interface UpcomingWorkoutCardProps {
  icon: string;
  title: string;
  date: string;
  time: string;
  duration: number;
}

export function UpcomingWorkoutCard({
  icon,
  title,
  date,
  time,
  duration,
}: UpcomingWorkoutCardProps) {
  return (
    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
          <span className="material-icons text-primary">{icon}</span>
        </div>
        <div>
          <h5 className="font-medium text-sm">{title}</h5>
          <p className="text-xs text-gray-500">{date}, {time}</p>
        </div>
      </div>
      <span className="text-xs font-medium bg-indigo-100 text-primary px-2 py-1 rounded-full">
        {duration} min
      </span>
    </div>
  );
}
