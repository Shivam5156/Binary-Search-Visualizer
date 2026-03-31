import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Check } from "lucide-react";

const BinarySearchVisualization = () => {
  const [nums, setNums] = useState([1, 3, 5, 7, 9, 11]);
  const [target, setTarget] = useState(7);

  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(nums.length - 1);
  const [mid, setMid] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [found, setFound] = useState(null);

  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const [customInput, setCustomInput] = useState("");
  const [customTarget, setCustomTarget] = useState("");

  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [testCases, setTestCases] = useState([
    { nums: [1, 3, 5, 7, 9, 11], target: 7 },
    { nums: [2, 4, 6, 8, 10], target: 10 },
    { nums: [1, 2, 3, 4, 5], target: 6 },
  ]);

  const isSorted = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };

  const stepForward = () => {
    if (low > high) {
      setIsPlaying(false);
      setFound(-1);
      return;
    }

    if (found !== null) return;

    const m = Math.floor((low + high) / 2);
    setMid(m);

    setHistory((prev) => [...prev, { low, high, mid: m }]);

    if (nums[m] === target) {
      setFound(m);
      setIsPlaying(false);
      return;
    }

    if (nums[m] < target) setLow(m + 1);
    else setHigh(m - 1);
  };

  const stepBack = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const last = newHistory.pop();

    setHistory(newHistory);

    if (last) {
      setLow(last.low);
      setHigh(last.high);
      setMid(last.mid);
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => stepForward(), 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, low, high]);

  const reset = (arr = nums, tgt = target) => {
    setNums(arr);
    setTarget(tgt);
    setLow(0);
    setHigh(arr.length - 1);
    setMid(null);
    setHistory([]);
    setFound(null);
    setIsPlaying(false);
    setError("");
  };

  const handleReset = () => {
    if (testCases[currentCaseIndex]) {
      const { nums: n, target: t } = testCases[currentCaseIndex];
      reset(n, t);
    } else {
      reset(nums, target);
    }
  };

  const runTestCase = (index) => {
    const { nums: n, target: t } = testCases[index];
    setCurrentCaseIndex(index);
    setNums(n);
    setTarget(t);
    reset(n, t);
  };

  const addCustomTestCase = () => {
    if (!customInput.trim() || !customTarget.trim()) {
      setError("Array and Target cannot be empty");
      return;
    }

    const arr = customInput.split(",").map(Number);
    const tgt = Number(customTarget);

    if (arr.some(isNaN) || isNaN(tgt)) {
      setError("Invalid input (numbers only)");
      return;
    }

    if (!isSorted(arr)) {
      setError("Array must be sorted in ascending order");
      return;
    }

    setError("");

    const newCases = [...testCases, { nums: arr, target: tgt }];
    setTestCases(newCases);

    const newIndex = newCases.length - 1;
    setCurrentCaseIndex(newIndex);
    reset(arr, tgt);

    setCustomInput("");
    setCustomTarget("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col gap-6 items-center">

        <h1 className="text-3xl font-extrabold text-purple-400 text-center">
          Binary Search Visualization
        </h1>

        {/* Inputs */}
        <div className="w-full bg-gray-800/60 backdrop-blur-md p-5 rounded-2xl shadow-lg flex gap-4 flex-wrap border border-gray-700 justify-center">
          <input
            className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={nums.join(",")}
            onChange={(e) =>
              setNums(e.target.value.split(",").map(Number))
            }
          />

          <input
            className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </div>

        {/* Custom Test Case */}
        <div className="w-full bg-gray-800/60 p-5 rounded-2xl flex gap-2 flex-wrap border border-gray-700 backdrop-blur-md justify-center">
          <input
            placeholder="Array"
            className="px-3 py-2 bg-gray-900 border rounded focus:ring-2 focus:ring-green-500"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />

          <input
            placeholder="Target"
            className="px-3 py-2 bg-gray-900 border rounded focus:ring-2 focus:ring-green-500"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
          />

          <button
            className="px-4 py-2 bg-green-500 rounded transition-all duration-300 hover:bg-green-400 hover:scale-105 shadow-md cursor-pointer"
            onClick={addCustomTestCase}
          >
            Add
          </button>
        </div>

        {/* ERROR UI */}
        {error && (
          <div className="text-red-400 bg-gray-800 px-4 py-2 rounded border border-red-500">
            {error}
          </div>
        )}

        {/* Test Cases */}
        <div className="flex gap-3 flex-wrap justify-center">
          {testCases.map((_, i) => (
            <button
              key={i}
              className="px-4 py-2 bg-blue-600 rounded transition-all duration-300 hover:bg-blue-500 hover:scale-105 shadow-md cursor-pointer"
              onClick={() => runTestCase(i)}
            >
              Case {i + 1}
            </button>
          ))}
        </div>

        {/* Array */}
        <div className="flex gap-5 flex-wrap justify-center">
          {nums.map((num, index) => (
            <div
              key={index}
              className={`w-16 h-16 flex items-center justify-center rounded-xl font-bold
              transition-all duration-300 transform cursor-pointer shadow-md hover:scale-110
              ${index === mid ? "bg-yellow-400 scale-125 text-black" : "bg-gray-700"}
              ${index >= low && index <= high ? "bg-blue-600" : ""}
              ${found === index ? "bg-green-500 scale-125" : ""}
            `}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="flex gap-8 bg-gray-800 px-6 py-3 rounded-xl border border-gray-700 shadow-md">
          <p>Low: {low}</p>
          <p>High: {high}</p>
          <p>Mid: {mid ?? "-"}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={stepBack}
            className="p-3 bg-gray-700 rounded transition-all duration-300 hover:bg-gray-600 hover:scale-110 shadow-md cursor-pointer"
          >
            <SkipBack />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-purple-600 rounded transition-all duration-300 hover:bg-purple-500 hover:scale-110 shadow-lg cursor-pointer"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button
            onClick={stepForward}
            className="p-3 bg-gray-700 rounded transition-all duration-300 hover:bg-gray-600 hover:scale-110 shadow-md cursor-pointer"
          >
            <SkipForward />
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 rounded transition-all duration-300 hover:bg-red-400 hover:scale-105 shadow-md cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Result */}
        {found !== null && (
          <div className={`flex items-center gap-2 text-lg font-semibold px-6 py-3 rounded-xl
          ${found === -1 ? "text-red-400 border border-red-500 bg-gray-800" : "text-green-400 border border-green-500 bg-gray-800"}
        `}>
            {found === -1 ? "❌ Target Not Found" : <><Check /> Found at index {found}</>}
          </div>
        )}

      </div>
    </div>
  );
};

export default BinarySearchVisualization;