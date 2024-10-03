"use client";

import { useState, useEffect, useCallback } from "react";
import { TimerIcon } from "lucide-react";

import { useSound } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [bgColor, setBgColor] = useState("bg-red-800");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const playClick = useSound("/click.mp3");
  const playAlert = useSound("/alert.wav");

  const getBackgroundColor = (mode: TimerMode): string => {
    switch (mode) {
      case "pomodoro":
        return "bg-red-800";
      case "shortBreak":
        return "bg-green-800";
      case "longBreak":
        return "bg-blue-800";
    }
  };

  const getCardColor = (mode: TimerMode): string => {
    switch (mode) {
      case "pomodoro":
        return "bg-red-700";
      case "shortBreak":
        return "bg-green-700";
      case "longBreak":
        return "bg-blue-700";
    }
  };

  const getButtonColor = (mode: TimerMode): string => {
    switch (mode) {
      case "pomodoro":
        return "text-red-800 hover:bg-red-100";
      case "shortBreak":
        return "text-green-800 hover:bg-green-100";
      case "longBreak":
        return "text-blue-800 hover:bg-blue-100";
    }
  };

  useEffect(() => {
    setBgColor(getBackgroundColor(mode));
  }, [mode]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      playClick();
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask.trim(), completed: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    playClick();
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = useCallback(() => {
    switch (mode) {
      case "pomodoro":
        setTime(25 * 60);
        break;
      case "shortBreak":
        setTime(5 * 60);
        break;
      case "longBreak":
        setTime(15 * 60);
        break;
    }
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      playAlert();
    }
    return () => clearInterval(interval);
  }, [isRunning, time, playAlert]);

  return (
    <main className={`flex flex-col min-h-screen ${bgColor}`}>
      <section className="flex-grow flex flex-col md:py-24">
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-0">
          <div
            id="pomodoro"
            className={`w-full max-w-md flex flex-col justify-center relative ${getCardColor(
              mode
            )} rounded-lg p-4`}
          >
            <div className="absolute top-4 left-4 flex items-center gap-2 text-white">
              <TimerIcon className="size-8" />
              <h1 className="text-2xl font-bold">Pomofocus</h1>
            </div>

            <div className="mt-16 flex-grow flex items-center justify-center mb-4">
              <Card className={`${getCardColor(mode)} w-full`}>
                <CardContent className="p-6">
                  <Tabs
                    value={mode}
                    onValueChange={(value) => {
                      playClick();
                      setMode(value as TimerMode);
                    }}
                    className="w-full"
                  >
                    <TabsList
                      className={`grid w-full grid-cols-3 ${getBackgroundColor(
                        mode
                      )}`}
                    >
                      <TabsTrigger
                        value="pomodoro"
                        className={`text-white/60 data-[state=active]:text-white data-[state=active]:${getCardColor(
                          "pomodoro"
                        )}`}
                      >
                        Pomodoro
                      </TabsTrigger>
                      <TabsTrigger
                        value="shortBreak"
                        className={`text-white/60 data-[state=active]:text-white data-[state=active]:${getCardColor(
                          "shortBreak"
                        )}`}
                      >
                        Short Break
                      </TabsTrigger>
                      <TabsTrigger
                        value="longBreak"
                        className={`text-white/60 data-[state=active]:text-white data-[state=active]:${getCardColor(
                          "longBreak"
                        )}`}
                      >
                        Long Break
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="text-8xl font-bold text-white text-center my-8">
                    {formatTime(time)}
                  </div>
                  <Button
                    className={`w-full bg-white font-bold ${getButtonColor(
                      mode
                    )}`}
                    size="lg"
                    onClick={handleStart}
                  >
                    {isRunning ? "STOP" : "START"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card
              className={`mt-4 ${getCardColor(
                mode
              )} h-[60vh] md:h-auto md:max-h-[40vh] overflow-hidden flex flex-col`}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-white mb-2">Tasks</h2>
                  <Button
                    onClick={() => setTasks([])}
                    variant="link"
                    size="sm"
                    className="text-white/60 hover:text-white"
                  >
                    Reset
                  </Button>
                </div>
                <div className="flex mb-2">
                  <Input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddTask();
                      }
                    }}
                    className="flex-grow mr-2"
                  />
                  <Button variant="secondary" onClick={handleAddTask}>
                    Add
                  </Button>
                </div>
                <ul className="space-y-2 overflow-y-auto flex-grow">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center text-black p-2 bg-white rounded-md"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <Checkbox checked={task.completed} className="mr-2" />
                      <span className={task.completed ? "line-through" : ""}>
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white w-full">
        <article className="prose max-w-2xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold mb-6">
            Boost Your Productivity with Pomopilot: A Customizable Pomodoro
            Timer
          </h1>

          <p>
            Are you struggling to maintain focus on your tasks? Meet{" "}
            <strong>Pomopilot</strong>, a customizable Pomodoro timer that works
            seamlessly on both desktop and mobile browsers. Designed to enhance
            your productivity, Pomopilot helps you concentrate on any task—be it
            studying, writing, or coding—by incorporating the proven Pomodoro
            Technique into your daily routine.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            What Is the Pomodoro Technique?
          </h2>
          <p>
            The <strong>Pomodoro Technique</strong> is a time management method
            developed by Francesco Cirillo in the late 1980s. It involves
            breaking your work into intervals, traditionally 25 minutes in
            length, separated by short breaks. Each interval is called a
            &quot;pomodoro,&quot; the Italian word for &quot;tomato,&quot;
            inspired by the tomato-shaped kitchen timer Cirillo used during his
            university days.
          </p>
          <p>
            This technique helps you maintain focus and prevents burnout by
            balancing concentrated work sessions with regular breaks. Over time,
            it can improve your attention span and overall productivity.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            How to Use Pomopilot
          </h2>
          <p>
            Pomopilot simplifies the Pomodoro Technique with an intuitive
            interface and customizable features. Here&apos;s how you can get
            started:
          </p>

          <ol className="list-decimal pl-6 mt-4">
            <li className="mb-2">
              <strong>Add Tasks for Today:</strong> Begin by listing the tasks
              you want to accomplish. Breaking down your workload into specific
              tasks clarifies what needs to be done and helps you prioritize.
            </li>
            <li className="mb-2">
              <strong>Set Estimated Pomodoros:</strong> Assign an estimated
              number of pomodoros (each representing 25 minutes of focused work)
              to each task. This helps you manage your time effectively and stay
              on track.
            </li>
            <li className="mb-2">
              <strong>Select a Task to Work On:</strong> Choose a task from your
              list to focus on first. Concentrating on one task at a time
              minimizes distractions and increases efficiency.
            </li>
            <li className="mb-2">
              <strong>Start the Timer and Focus for 25 Minutes:</strong>{" "}
              Activate the Pomopilot timer and dedicate the next 25 minutes
              solely to your selected task. Avoid interruptions to maximize
              productivity.
            </li>
            <li className="mb-2">
              <strong>Take a 5-Minute Break:</strong> When the timer rings, take
              a short 5-minute break. Use this time to relax, stretch, or grab a
              quick snack. Short breaks help refresh your mind for the next
              session.
            </li>
            <li className="mb-2">
              <strong>Repeat the Cycle:</strong> Continue this cycle of focused
              work and short breaks until you complete your tasks. After four
              pomodoros, consider taking a longer break of 15-30 minutes to
              recharge fully.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Why Choose Pomopilot?
          </h2>
          <ul className="list-disc pl-6 mt-4">
            <li className="mb-2">
              <strong>Customizable Settings:</strong> Adjust work intervals and
              break times to suit your personal preferences.
            </li>
            <li className="mb-2">
              <strong>Cross-Platform Compatibility:</strong> Use Pomopilot on
              any device with a web browser—no downloads required.
            </li>
            <li className="mb-2">
              <strong>Enhanced Focus:</strong> Structured intervals help
              eliminate procrastination and keep you engaged.
            </li>
            <li className="mb-2">
              <strong>User-Friendly Interface:</strong> Get started quickly with
              an easy-to-navigate design.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Start Boosting Your Productivity Today
          </h2>
          <p>
            Embrace the Pomodoro Technique with Pomopilot and take control of
            your time. Whether you&apos;re a student, a professional, or anyone
            looking to enhance their productivity, Pomopilot offers a
            straightforward solution to help you achieve your goals.
          </p>

          <hr className="my-8" />

          <blockquote className="font-semibold">
            Experience the difference that structured time management can make.
            Try Pomopilot now and unlock your full productivity potential.{" "}
            <a href="#" className="text-primary hover:underline">
              Use the app for free.
            </a>
          </blockquote>
        </article>
      </section>
    </main>
  );
}
